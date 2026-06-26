import { useState, useCallback } from 'react';
import { HiTable, HiUpload, HiX } from 'react-icons/hi';
import { parseExcelFile, autoMapColumns } from '../../utils/excelParser';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

const ExcelUpload = ({ fields, onDataParsed }) => {
  const [fileName, setFileName] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [rows, setRows] = useState([]);
  const [mapping, setMapping] = useState({});
  const [loading, setLoading] = useState(false);

  const fieldNames = fields.map(f => f.name);

  const handleFile = useCallback(async (file) => {
    if (!file) return;
    setLoading(true);

    try {
      const { headers: excelHeaders, rows: excelRows } = await parseExcelFile(file);
      setFileName(file.name);
      setHeaders(excelHeaders);
      setRows(excelRows);

      // Auto-map columns
      const autoMapping = autoMapColumns(excelHeaders, fieldNames);
      setMapping(autoMapping);

      toast.success(`Loaded ${excelRows.length} rows from ${file.name}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [fieldNames]);

  const handleMappingChange = (fieldName, excelHeader) => {
    setMapping(prev => ({ ...prev, [fieldName]: excelHeader }));
  };

  const handleConfirm = () => {
    // Map Excel data using the column mapping
    const mappedData = rows.map(row => {
      const mapped = {};
      fieldNames.forEach(fieldName => {
        const excelCol = mapping[fieldName];
        mapped[fieldName] = excelCol ? String(row[excelCol] || '') : '';
      });
      return mapped;
    });

    onDataParsed(mappedData);
    toast.success(`${mappedData.length} records ready for generation`);
  };

  const handleClear = () => {
    setFileName(null);
    setHeaders([]);
    setRows([]);
    setMapping({});
  };

  if (!fileName) {
    return (
      <label
        className="flex flex-col items-center justify-center w-full min-h-[200px] border-2 border-dashed border-surface-600 rounded-2xl hover:border-primary-500/50 hover:bg-surface-800/30 transition-all cursor-pointer group"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFile(e.dataTransfer?.files?.[0]);
        }}
      >
        <div className="flex flex-col items-center gap-3 p-6">
          <div className="p-3 rounded-xl bg-success-400/10 text-success-400 group-hover:bg-success-400/20 transition-colors">
            <HiTable className="w-8 h-8" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-surface-200">Upload Excel or CSV</p>
            <p className="text-xs text-surface-400 mt-1">.xlsx, .xls, or .csv files</p>
          </div>
        </div>
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={(e) => handleFile(e.target.files?.[0])}
          className="hidden"
        />
      </label>
    );
  }

  return (
    <div className="space-y-4">
      {/* File info */}
      <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-success-400/10 border border-success-400/20">
        <div className="flex items-center gap-2">
          <HiTable className="w-5 h-5 text-success-400" />
          <span className="text-sm text-surface-200">{fileName}</span>
          <span className="text-xs text-surface-400">({rows.length} rows)</span>
        </div>
        <button onClick={handleClear} className="p-1 text-surface-400 hover:text-danger-400 transition-colors cursor-pointer">
          <HiX className="w-4 h-4" />
        </button>
      </div>

      {/* Column Mapping */}
      <div>
        <h4 className="text-sm font-semibold text-surface-200 mb-3">Column Mapping</h4>
        <div className="space-y-2">
          {fieldNames.map(fieldName => (
            <div key={fieldName} className="flex items-center gap-3">
              <span className="text-sm text-surface-300 w-40 truncate">{fieldName}</span>
              <span className="text-surface-600">→</span>
              <select
                value={mapping[fieldName] || ''}
                onChange={(e) => handleMappingChange(fieldName, e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-surface-800/50 border border-surface-700/50 text-surface-100 text-sm outline-none focus:border-primary-500/50 transition-all cursor-pointer"
              >
                <option value="">-- Select column --</option>
                {headers.map(h => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Preview table */}
      {rows.length > 0 && (
        <div className="overflow-x-auto rounded-xl border border-surface-700/50">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-800/50">
                {headers.map(h => (
                  <th key={h} className="px-3 py-2 text-left text-xs font-medium text-surface-400 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 5).map((row, i) => (
                <tr key={i} className="border-t border-surface-800/50 hover:bg-surface-800/30">
                  {headers.map(h => (
                    <td key={h} className="px-3 py-2 text-surface-300 whitespace-nowrap">
                      {String(row[h] || '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length > 5 && (
            <div className="px-3 py-2 text-xs text-surface-500 bg-surface-800/30">
              Showing 5 of {rows.length} rows
            </div>
          )}
        </div>
      )}

      <Button onClick={handleConfirm} size="lg" icon={HiUpload} className="w-full sm:w-auto">
        Confirm & Proceed ({rows.length} records)
      </Button>
    </div>
  );
};

export default ExcelUpload;
