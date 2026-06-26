import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

const useEditorStore = create((set, get) => ({
  // Template data
  templateId: null,
  templateName: 'Untitled Template',
  templateImageUrl: null,
  templateWidth: 0,
  templateHeight: 0,
  canvasWidth: 0,
  canvasHeight: 0,

  // Fields
  fields: [],
  selectedFieldId: null,

  // Signature & stamp
  signatureImageUrl: null,
  stampImageUrl: null,
  signaturePosition: { x: 0, y: 0, width: 150, height: 80, angle: 0, opacity: 1 },
  stampPosition: { x: 0, y: 0, width: 100, height: 100, angle: 0, opacity: 1 },

  // Canvas state
  canvasJSON: null,
  isDirty: false,

  // Actions — Template
  setTemplateId: (id) => set({ templateId: id }),
  setTemplateName: (name) => set({ templateName: name, isDirty: true }),
  setTemplateImage: (url, width, height) => set({
    templateImageUrl: url,
    templateWidth: width,
    templateHeight: height,
    isDirty: true,
  }),
  setCanvasDimensions: (width, height) => set({
    canvasWidth: width,
    canvasHeight: height,
    isDirty: true,
  }),

  // Actions — Fields
  addField: (name) => {
    const id = uuidv4();
    const newField = {
      id,
      name,
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      fontSize: 24,
      fontFamily: 'Inter',
      fontColor: '#1a1a2e',
      fontWeight: 'normal',
      fontStyle: 'normal',
      textAlign: 'center',
      width: 200,
      height: 40,
    };
    set((state) => ({
      fields: [...state.fields, newField],
      selectedFieldId: id,
      isDirty: true,
    }));
    return id;
  },

  removeField: (id) => set((state) => ({
    fields: state.fields.filter(f => f.id !== id),
    selectedFieldId: state.selectedFieldId === id ? null : state.selectedFieldId,
    isDirty: true,
  })),

  updateField: (id, updates) => set((state) => ({
    fields: state.fields.map(f => f.id === id ? { ...f, ...updates } : f),
    isDirty: true,
  })),

  selectField: (id) => set({ selectedFieldId: id }),

  getSelectedField: () => {
    const state = get();
    return state.fields.find(f => f.id === state.selectedFieldId) || null;
  },

  // Actions — Signature & Stamp
  setSignatureImage: (url) => set({ signatureImageUrl: url, isDirty: true }),
  setStampImage: (url) => set({ stampImageUrl: url, isDirty: true }),
  updateSignaturePosition: (pos) => set((state) => ({
    signaturePosition: { ...state.signaturePosition, ...pos },
    isDirty: true,
  })),
  updateStampPosition: (pos) => set((state) => ({
    stampPosition: { ...state.stampPosition, ...pos },
    isDirty: true,
  })),

  // Actions — Canvas
  setCanvasJSON: (json) => set({ canvasJSON: json }),
  setDirty: (dirty) => set({ isDirty: dirty }),

  // Actions — Load template data from API
  loadTemplate: (template) => set({
    templateId: template._id,
    templateName: template.name,
    templateImageUrl: template.templateImageUrl,
    templateWidth: template.templateWidth || 0,
    templateHeight: template.templateHeight || 0,
    canvasWidth: template.canvasWidth || 0,
    canvasHeight: template.canvasHeight || 0,
    fields: template.fields || [],
    signatureImageUrl: template.signatureImageUrl,
    stampImageUrl: template.stampImageUrl,
    signaturePosition: template.signaturePosition || { x: 0, y: 0, width: 150, height: 80, angle: 0, opacity: 1 },
    stampPosition: template.stampPosition || { x: 0, y: 0, width: 100, height: 100, angle: 0, opacity: 1 },
    canvasJSON: template.canvasJSON,
    selectedFieldId: null,
    isDirty: false,
  }),

  // Reset
  reset: () => set({
    templateId: null,
    templateName: 'Untitled Template',
    templateImageUrl: null,
    templateWidth: 0,
    templateHeight: 0,
    canvasWidth: 0,
    canvasHeight: 0,
    fields: [],
    selectedFieldId: null,
    signatureImageUrl: null,
    stampImageUrl: null,
    signaturePosition: { x: 0, y: 0, width: 150, height: 80, angle: 0, opacity: 1 },
    stampPosition: { x: 0, y: 0, width: 100, height: 100, angle: 0, opacity: 1 },
    canvasJSON: null,
    isDirty: false,
  }),
}));

export default useEditorStore;
