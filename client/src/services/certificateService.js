import api from './api';

export const certificateService = {
  generate: async (data) => {
    const res = await api.post('/certificates/generate', data);
    return res.data;
  },

  bulkGenerate: async (data) => {
    const res = await api.post('/certificates/bulk-generate', data);
    return res.data;
  },

  verify: async (certificateId) => {
    const res = await api.get(`/certificates/verify/${certificateId}`);
    return res.data;
  },

  getAll: async (templateId) => {
    const params = templateId ? { templateId } : {};
    const res = await api.get('/certificates', { params });
    return res.data;
  },
};
