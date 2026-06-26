import { useEffect, useRef } from 'react';
import { HiX } from 'react-icons/hi';

const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) => {
  const overlayRef = useRef(null);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-surface-950/80 backdrop-blur-sm animate-fade-in" />

      {/* Modal */}
      <div className={`relative w-full ${maxWidth} glass rounded-2xl shadow-2xl animate-slide-up`}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-700/50">
          <h3 className="text-lg font-semibold text-surface-100">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-surface-400 hover:text-surface-100 hover:bg-surface-700/50 transition-colors cursor-pointer"
          >
            <HiX className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
