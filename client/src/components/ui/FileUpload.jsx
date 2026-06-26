import { useCallback } from 'react';
import { HiCloudUpload, HiPhotograph } from 'react-icons/hi';

const FileUpload = ({
  onFileSelect,
  accept = 'image/*',
  label = 'Upload File',
  sublabel = 'PNG, JPG or WebP up to 10MB',
  icon: Icon = HiPhotograph,
  className = '',
  id,
}) => {
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer?.files?.[0];
    if (file) onFileSelect(file);
  }, [onFileSelect]);

  const handleChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  }, [onFileSelect]);

  return (
    <label
      htmlFor={id}
      className={`
        relative flex flex-col items-center justify-center w-full min-h-[180px]
        border-2 border-dashed border-surface-600 rounded-2xl
        hover:border-primary-500/50 hover:bg-surface-800/30
        transition-all duration-300 cursor-pointer group
        ${className}
      `}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center gap-3 p-6">
        <div className="p-3 rounded-xl bg-primary-500/10 text-primary-400 group-hover:bg-primary-500/20 transition-colors">
          <HiCloudUpload className="w-8 h-8" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-surface-200">{label}</p>
          <p className="text-xs text-surface-400 mt-1">{sublabel}</p>
        </div>
      </div>
      <input
        id={id}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
    </label>
  );
};

export default FileUpload;
