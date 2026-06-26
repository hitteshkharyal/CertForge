import { useState } from 'react';
import { HiArrowRight } from 'react-icons/hi';
import Button from '../ui/Button';

const ManualEntryForm = ({ fields, onGenerate, loading = false }) => {
  const [formData, setFormData] = useState({});

  const handleChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(formData);
  };

  if (!fields || fields.length === 0) {
    return (
      <div className="text-center py-8 text-surface-400">
        <p className="text-sm">No fields defined. Go back to the editor to add fields.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map((field) => (
          <div key={field.id}>
            <label
              htmlFor={`field-${field.id}`}
              className="block text-xs font-medium text-surface-400 mb-1.5"
            >
              {field.name}
            </label>
            <input
              id={`field-${field.id}`}
              type="text"
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              placeholder={`Enter ${field.name}`}
              className="w-full px-4 py-3 rounded-xl bg-surface-800/50 border border-surface-700/50 text-surface-100 placeholder-surface-500 focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/30 outline-none transition-all text-sm"
            />
          </div>
        ))}
      </div>

      <div className="pt-4">
        <Button
          type="submit"
          size="lg"
          loading={loading}
          icon={HiArrowRight}
          className="w-full sm:w-auto"
        >
          Generate Certificate
        </Button>
      </div>
    </form>
  );
};

export default ManualEntryForm;
