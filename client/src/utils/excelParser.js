import * as XLSX from 'xlsx';

/**
 * Parse an Excel or CSV file and return headers and rows.
 * @param {File} file - The uploaded file
 * @returns {Promise<{ headers: string[], rows: Object[] }>}
 */
export const parseExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        // Get first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert to JSON (objects with headers as keys)
        const rows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (rows.length === 0) {
          reject(new Error('The file is empty or has no data rows.'));
          return;
        }

        const headers = Object.keys(rows[0]);

        resolve({ headers, rows });
      } catch (error) {
        reject(new Error('Failed to parse file. Please ensure it is a valid Excel or CSV file.'));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Auto-map Excel column headers to certificate field names.
 * Matches by case-insensitive containment.
 * @param {string[]} excelHeaders - Column headers from Excel
 * @param {string[]} fieldNames - Certificate field names
 * @returns {Object} mapping of fieldName → excelHeader
 */
export const autoMapColumns = (excelHeaders, fieldNames) => {
  const mapping = {};

  fieldNames.forEach((fieldName) => {
    const normalizedField = fieldName.toLowerCase().replace(/[_\s-]/g, '');

    // Try exact match first
    const exactMatch = excelHeaders.find(
      h => h.toLowerCase().replace(/[_\s-]/g, '') === normalizedField
    );

    if (exactMatch) {
      mapping[fieldName] = exactMatch;
      return;
    }

    // Try containment match
    const containsMatch = excelHeaders.find(
      h => h.toLowerCase().replace(/[_\s-]/g, '').includes(normalizedField)
        || normalizedField.includes(h.toLowerCase().replace(/[_\s-]/g, ''))
    );

    if (containsMatch) {
      mapping[fieldName] = containsMatch;
    }
  });

  return mapping;
};
