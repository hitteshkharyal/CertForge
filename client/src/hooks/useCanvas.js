import { useEffect, useRef, useCallback } from 'react';
import { Canvas, IText, FabricImage } from 'fabric';
import useEditorStore from '../store/editorStore';

/**
 * Custom hook for managing the Fabric.js canvas.
 * Handles canvas initialization, field objects, background template, and serialization.
 */
const useCanvas = (canvasElRef, containerRef) => {
  const fabricRef = useRef(null);
  const isInitializing = useRef(false);
  const {
    templateImageUrl,
    fields,
    selectedFieldId,
    selectField,
    updateField,
    setTemplateImage,
    setCanvasDimensions,
  } = useEditorStore();

  // Initialize canvas
  const initCanvas = useCallback(() => {
    if (!canvasElRef.current || isInitializing.current) return;
    if (fabricRef.current) return; // Already initialized

    isInitializing.current = true;

    const container = containerRef.current;
    const width = container?.clientWidth || 800;
    const height = container?.clientHeight || 600;

    const canvas = new Canvas(canvasElRef.current, {
      width,
      height,
      backgroundColor: '#1e293b',
      selection: true,
      preserveObjectStacking: true,
    });

    fabricRef.current = canvas;
    isInitializing.current = false;

    // Selection event — sync with store
    canvas.on('selection:created', (e) => {
      const obj = e.selected?.[0];
      if (obj?.fieldId) {
        selectField(obj.fieldId);
      }
    });

    canvas.on('selection:updated', (e) => {
      const obj = e.selected?.[0];
      if (obj?.fieldId) {
        selectField(obj.fieldId);
      }
    });

    canvas.on('selection:cleared', () => {
      selectField(null);
    });

    // Object modified — sync position back to store
    canvas.on('object:modified', (e) => {
      const obj = e.target;
      if (obj?.fieldId) {
        updateField(obj.fieldId, {
          x: Math.round(obj.left),
          y: Math.round(obj.top),
          width: Math.round(obj.width * (obj.scaleX || 1)),
          height: Math.round(obj.height * (obj.scaleY || 1)),
        });
      } else if (obj?.overlayType) {
        const updates = {
          x: Math.round(obj.left),
          y: Math.round(obj.top),
          width: Math.round(obj.width * (obj.scaleX || 1)),
          height: Math.round(obj.height * (obj.scaleY || 1)),
          angle: Math.round(obj.angle || 0),
        };
        if (obj.overlayType === 'signature') {
          useEditorStore.getState().updateSignaturePosition(updates);
        } else if (obj.overlayType === 'stamp') {
          useEditorStore.getState().updateStampPosition(updates);
        }
      }
    });

    return canvas;
  }, [canvasElRef, containerRef, selectField, updateField]);

  // Set background image
  const setBackgroundImage = useCallback(async (url) => {
    const canvas = fabricRef.current;
    if (!canvas || !url) return;

    try {
      const img = await FabricImage.fromURL(url, { crossOrigin: 'anonymous' });

      // Scale image to fit canvas while maintaining aspect ratio
      const canvasWidth = canvas.getWidth();
      const canvasHeight = canvas.getHeight();
      const imgRatio = img.width / img.height;
      const canvasRatio = canvasWidth / canvasHeight;

      let scale;
      if (imgRatio > canvasRatio) {
        scale = canvasWidth / img.width;
      } else {
        scale = canvasHeight / img.height;
      }

      // Resize canvas to fit image
      const newWidth = img.width * scale;
      const newHeight = img.height * scale;
      canvas.setDimensions({ width: newWidth, height: newHeight });

      img.set({
        scaleX: scale,
        scaleY: scale,
        originX: 'left',
        originY: 'top',
      });

      canvas.backgroundImage = img;
      canvas.renderAll();

      // Store original dimensions
      setTemplateImage(url, img.width, img.height);
      setCanvasDimensions(newWidth, newHeight);
    } catch (err) {
      console.error('Failed to load background image:', err);
    }
  }, [setTemplateImage]);

  // Add a text field to canvas
  const addTextField = useCallback((field) => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    // Check if field already exists on canvas
    const existing = canvas.getObjects().find(o => o.fieldId === field.id);
    if (existing) return;

    const text = new IText(`{{${field.name}}}`, {
      left: field.x,
      top: field.y,
      fontSize: field.fontSize || 24,
      fontFamily: field.fontFamily || 'Inter',
      fill: field.fontColor || '#1a1a2e',
      fontWeight: field.fontWeight || 'normal',
      fontStyle: field.fontStyle || 'normal',
      textAlign: field.textAlign || 'center',
      width: field.width || 200,
      editable: false, // Prevent inline editing — values come from data
      hasControls: true,
      hasBorders: true,
      borderColor: '#6366f1',
      cornerColor: '#6366f1',
      cornerStyle: 'circle',
      cornerSize: 8,
      transparentCorners: false,
      padding: 5,
    });

    // Attach field ID for identification
    text.fieldId = field.id;
    text.fieldName = field.name;

    canvas.add(text);
    canvas.renderAll();
  }, []);

  // Remove a text field from canvas
  const removeTextField = useCallback((fieldId) => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const obj = canvas.getObjects().find(o => o.fieldId === fieldId);
    if (obj) {
      canvas.remove(obj);
      canvas.renderAll();
    }
  }, []);

  // Update a text field on canvas
  const updateTextField = useCallback((fieldId, updates) => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const obj = canvas.getObjects().find(o => o.fieldId === fieldId);
    if (!obj) return;

    if (updates.fontSize !== undefined) obj.set('fontSize', updates.fontSize);
    if (updates.fontFamily !== undefined) obj.set('fontFamily', updates.fontFamily);
    if (updates.fontColor !== undefined) obj.set('fill', updates.fontColor);
    if (updates.fontWeight !== undefined) obj.set('fontWeight', updates.fontWeight);
    if (updates.fontStyle !== undefined) obj.set('fontStyle', updates.fontStyle);
    if (updates.textAlign !== undefined) obj.set('textAlign', updates.textAlign);
    if (updates.x !== undefined) obj.set('left', updates.x);
    if (updates.y !== undefined) obj.set('top', updates.y);
    if (updates.name !== undefined) obj.set('text', `{{${updates.name}}}`);

    canvas.renderAll();
  }, []);

  // Select a field on canvas
  const selectCanvasField = useCallback((fieldId) => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    if (!fieldId) {
      canvas.discardActiveObject();
      canvas.renderAll();
      return;
    }

    const obj = canvas.getObjects().find(o => o.fieldId === fieldId);
    if (obj) {
      canvas.setActiveObject(obj);
      canvas.renderAll();
    }
  }, []);

  // Add image overlay (signature/stamp)
  const addImageOverlay = useCallback(async (url, position, type = 'signature') => {
    const canvas = fabricRef.current;
    if (!canvas || !url) return;

    try {
      // Remove existing overlay of same type
      const existing = canvas.getObjects().find(o => o.overlayType === type);
      if (existing) {
        canvas.remove(existing);
      }

      const img = await FabricImage.fromURL(url, { crossOrigin: 'anonymous' });

      img.set({
        left: position.x || 100,
        top: position.y || 100,
        scaleX: (position.width || 150) / img.width,
        scaleY: (position.height || 80) / img.height,
        opacity: position.opacity || 1,
        angle: position.angle || 0,
        hasControls: true,
        hasBorders: true,
        borderColor: type === 'signature' ? '#10b981' : '#f59e0b',
        cornerColor: type === 'signature' ? '#10b981' : '#f59e0b',
        cornerStyle: 'circle',
        cornerSize: 8,
        transparentCorners: false,
      });

      img.overlayType = type;
      canvas.add(img);
      canvas.renderAll();
    } catch (err) {
      console.error(`Failed to load ${type} image:`, err);
    }
  }, []);

  // Get canvas as JSON
  const getCanvasJSON = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return null;
    return JSON.stringify(canvas.toJSON(['fieldId', 'fieldName', 'overlayType']));
  }, []);

  // Load canvas from JSON
  const loadCanvasJSON = useCallback(async (json) => {
    const canvas = fabricRef.current;
    if (!canvas || !json) return;

    try {
      await canvas.loadFromJSON(JSON.parse(json));
      canvas.renderAll();
    } catch (err) {
      console.error('Failed to load canvas JSON:', err);
    }
  }, []);

  // Export canvas as PNG data URL
  const exportAsPNG = useCallback(() => {
    const canvas = fabricRef.current;
    if (!canvas) return null;
    return canvas.toDataURL({ format: 'png', quality: 1, multiplier: 2 });
  }, []);

  // Dispose canvas
  const dispose = useCallback(() => {
    const canvas = fabricRef.current;
    if (canvas) {
      canvas.dispose();
      fabricRef.current = null;
    }
  }, []);

  return {
    fabricRef,
    initCanvas,
    setBackgroundImage,
    addTextField,
    removeTextField,
    updateTextField,
    selectCanvasField,
    addImageOverlay,
    getCanvasJSON,
    loadCanvasJSON,
    exportAsPNG,
    dispose,
  };
};

export default useCanvas;
