import { useEffect, useRef } from 'react';
import useCanvas from '../../hooks/useCanvas';
import useEditorStore from '../../store/editorStore';

const CanvasEditor = ({ onCanvasReady }) => {
  const canvasElRef = useRef(null);
  const containerRef = useRef(null);
  const { templateImageUrl, fields } = useEditorStore();

  const {
    initCanvas,
    setBackgroundImage,
    addTextField,
    dispose,
    fabricRef,
    updateTextField,
    removeTextField,
    selectCanvasField,
    addImageOverlay,
    getCanvasJSON,
    exportAsPNG,
  } = useCanvas(canvasElRef, containerRef);

  // Initialize canvas
  useEffect(() => {
    const canvas = initCanvas();
    if (canvas && onCanvasReady) {
      onCanvasReady({
        addTextField,
        removeTextField,
        updateTextField,
        selectCanvasField,
        addImageOverlay,
        getCanvasJSON,
        exportAsPNG,
        fabricRef,
      });
    }
    return () => dispose();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Load template image when URL changes
  useEffect(() => {
    if (templateImageUrl) {
      setBackgroundImage(templateImageUrl);
    }
  }, [templateImageUrl, setBackgroundImage]);

  // Sync fields to canvas
  useEffect(() => {
    if (!fabricRef.current) return;

    const canvasObjects = fabricRef.current.getObjects();
    const canvasFieldIds = canvasObjects
      .filter(o => o.fieldId)
      .map(o => o.fieldId);
    const storeFieldIds = fields.map(f => f.id);

    // Add new fields
    fields.forEach(field => {
      if (!canvasFieldIds.includes(field.id)) {
        addTextField(field);
      }
    });

    // Remove deleted fields
    canvasFieldIds.forEach(id => {
      if (!storeFieldIds.includes(id)) {
        removeTextField(id);
      }
    });
  }, [fields, addTextField, removeTextField, fabricRef]);

  return (
    <div
      ref={containerRef}
      className="relative w-full flex items-center justify-center bg-surface-900 rounded-xl overflow-hidden canvas-container"
      style={{ minHeight: '400px' }}
    >
      <canvas ref={canvasElRef} id="certificate-canvas" />

      {!templateImageUrl && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-surface-400 pointer-events-none">
          <svg className="w-16 h-16 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="text-sm">Upload a template to get started</p>
        </div>
      )}
    </div>
  );
};

export default CanvasEditor;
