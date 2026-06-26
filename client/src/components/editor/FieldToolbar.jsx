import { useState } from 'react';
import { HiPlus, HiTrash, HiCursorClick } from 'react-icons/hi';
import useEditorStore from '../../store/editorStore';
import Button from '../ui/Button';

const FieldToolbar = ({ canvasApi }) => {
  const [newFieldName, setNewFieldName] = useState('');
  const { fields, selectedFieldId, addField, removeField, selectField } = useEditorStore();

  const handleAddField = () => {
    const name = newFieldName.trim();
    if (!name) return;

    // Check duplicate
    if (fields.some(f => f.name.toLowerCase() === name.toLowerCase())) {
      return;
    }

    const id = addField(name);
    if (canvasApi?.addTextField) {
      const field = useEditorStore.getState().fields.find(f => f.id === id);
      canvasApi.addTextField(field);
    }
    setNewFieldName('');
  };

  const handleRemoveField = (id) => {
    removeField(id);
    if (canvasApi?.removeTextField) {
      canvasApi.removeTextField(id);
    }
  };

  const handleSelectField = (id) => {
    selectField(id);
    if (canvasApi?.selectCanvasField) {
      canvasApi.selectCanvasField(id);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-surface-200 flex items-center gap-2">
        <HiCursorClick className="w-4 h-4 text-primary-400" />
        Certificate Fields
      </h3>

      {/* Add field input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newFieldName}
          onChange={(e) => setNewFieldName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddField()}
          placeholder="e.g. Student Name"
          className="flex-1 px-3 py-2 rounded-lg bg-surface-800/50 border border-surface-700/50 text-surface-100 placeholder-surface-500 focus:border-primary-500/50 outline-none transition-all text-sm"
        />
        <Button
          variant="primary"
          size="sm"
          onClick={handleAddField}
          disabled={!newFieldName.trim()}
          icon={HiPlus}
        >
          Add
        </Button>
      </div>

      {/* Fields list */}
      <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
        {fields.length === 0 ? (
          <p className="text-xs text-surface-500 text-center py-4">
            No fields yet. Add your first field above.
          </p>
        ) : (
          fields.map((field) => (
            <div
              key={field.id}
              className={`
                flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer
                transition-all duration-200 group
                ${selectedFieldId === field.id
                  ? 'bg-primary-500/15 border border-primary-500/30 text-primary-300'
                  : 'bg-surface-800/30 border border-transparent hover:bg-surface-800/50 text-surface-300'
                }
              `}
              onClick={() => handleSelectField(field.id)}
            >
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  selectedFieldId === field.id ? 'bg-primary-400' : 'bg-surface-600'
                }`} />
                <span className="text-sm font-medium">{field.name}</span>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); handleRemoveField(field.id); }}
                className="opacity-0 group-hover:opacity-100 p-1 rounded text-surface-500 hover:text-danger-400 transition-all cursor-pointer"
              >
                <HiTrash className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      {fields.length > 0 && (
        <p className="text-xs text-surface-500">
          {fields.length} field{fields.length !== 1 ? 's' : ''} defined
        </p>
      )}
    </div>
  );
};

export default FieldToolbar;
