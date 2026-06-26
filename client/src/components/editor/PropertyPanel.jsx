import useEditorStore from '../../store/editorStore';
import { HiAdjustments } from 'react-icons/hi';

const FONT_FAMILIES = [
  'Inter', 'Arial', 'Helvetica', 'Times New Roman', 'Georgia',
  'Courier New', 'Verdana', 'Trebuchet MS', 'Outfit',
  'Playfair Display', 'Roboto',
];

const PropertyPanel = ({ canvasApi }) => {
  const { selectedFieldId, fields, updateField } = useEditorStore();
  const selectedField = fields.find(f => f.id === selectedFieldId);

  if (!selectedField) {
    return (
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-surface-200 flex items-center gap-2">
          <HiAdjustments className="w-4 h-4 text-primary-400" />
          Properties
        </h3>
        <p className="text-xs text-surface-500 text-center py-8">
          Select a field on the canvas to edit its properties
        </p>
      </div>
    );
  }

  const handleUpdate = (key, value) => {
    updateField(selectedField.id, { [key]: value });
    if (canvasApi?.updateTextField) {
      canvasApi.updateTextField(selectedField.id, { [key]: value });
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-surface-200 flex items-center gap-2">
        <HiAdjustments className="w-4 h-4 text-primary-400" />
        Properties — <span className="text-primary-400">{selectedField.name}</span>
      </h3>

      {/* Font Family */}
      <div>
        <label className="block text-xs text-surface-400 mb-1">Font Family</label>
        <select
          value={selectedField.fontFamily}
          onChange={(e) => handleUpdate('fontFamily', e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-surface-800/50 border border-surface-700/50 text-surface-100 text-sm outline-none focus:border-primary-500/50 transition-all cursor-pointer"
        >
          {FONT_FAMILIES.map(font => (
            <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
          ))}
        </select>
      </div>

      {/* Font Size */}
      <div>
        <label className="block text-xs text-surface-400 mb-1">
          Font Size: <span className="text-primary-400">{selectedField.fontSize}px</span>
        </label>
        <input
          type="range"
          min="8"
          max="120"
          value={selectedField.fontSize}
          onChange={(e) => handleUpdate('fontSize', parseInt(e.target.value))}
          className="w-full accent-primary-500"
        />
      </div>

      {/* Font Color */}
      <div>
        <label className="block text-xs text-surface-400 mb-1">Color</label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={selectedField.fontColor}
            onChange={(e) => handleUpdate('fontColor', e.target.value)}
            className="w-8 h-8 rounded-lg border border-surface-700 cursor-pointer bg-transparent"
          />
          <input
            type="text"
            value={selectedField.fontColor}
            onChange={(e) => handleUpdate('fontColor', e.target.value)}
            className="flex-1 px-3 py-1.5 rounded-lg bg-surface-800/50 border border-surface-700/50 text-surface-100 text-xs font-mono outline-none focus:border-primary-500/50 transition-all"
          />
        </div>
      </div>

      {/* Font Weight & Style */}
      <div className="flex gap-2">
        <button
          onClick={() => handleUpdate('fontWeight', selectedField.fontWeight === 'bold' ? 'normal' : 'bold')}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${
            selectedField.fontWeight === 'bold'
              ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
              : 'bg-surface-800/50 text-surface-400 border border-surface-700/50 hover:text-surface-200'
          }`}
        >
          B
        </button>
        <button
          onClick={() => handleUpdate('fontStyle', selectedField.fontStyle === 'italic' ? 'normal' : 'italic')}
          className={`flex-1 px-3 py-2 rounded-lg text-sm italic transition-all cursor-pointer ${
            selectedField.fontStyle === 'italic'
              ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
              : 'bg-surface-800/50 text-surface-400 border border-surface-700/50 hover:text-surface-200'
          }`}
        >
          I
        </button>
      </div>

      {/* Text Alignment */}
      <div>
        <label className="block text-xs text-surface-400 mb-1">Alignment</label>
        <div className="flex gap-1">
          {['left', 'center', 'right'].map(align => (
            <button
              key={align}
              onClick={() => handleUpdate('textAlign', align)}
              className={`flex-1 px-3 py-2 rounded-lg text-xs capitalize transition-all cursor-pointer ${
                selectedField.textAlign === align
                  ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                  : 'bg-surface-800/50 text-surface-400 border border-surface-700/50 hover:text-surface-200'
              }`}
            >
              {align}
            </button>
          ))}
        </div>
      </div>

      {/* Position */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs text-surface-400 mb-1">X Position</label>
          <input
            type="number"
            value={Math.round(selectedField.x)}
            onChange={(e) => handleUpdate('x', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-1.5 rounded-lg bg-surface-800/50 border border-surface-700/50 text-surface-100 text-sm outline-none focus:border-primary-500/50 transition-all"
          />
        </div>
        <div>
          <label className="block text-xs text-surface-400 mb-1">Y Position</label>
          <input
            type="number"
            value={Math.round(selectedField.y)}
            onChange={(e) => handleUpdate('y', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-1.5 rounded-lg bg-surface-800/50 border border-surface-700/50 text-surface-100 text-sm outline-none focus:border-primary-500/50 transition-all"
          />
        </div>
      </div>
    </div>
  );
};

export default PropertyPanel;
