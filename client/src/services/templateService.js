import api from './api';

export const templateService = {
  create: async (formData) => {
    const res = await api.post('/templates', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  getAll: async () => {
    const res = await api.get('/templates');
    return res.data;
  },

  getById: async (id) => {
    const res = await api.get(`/templates/${id}`);
    return res.data;
  },

  update: async (id, data) => {
    const res = await api.put(`/templates/${id}`, data);
    return res.data;
  },

  delete: async (id) => {
    const res = await api.delete(`/templates/${id}`);
    return res.data;
  },

  uploadSignature: async (id, formData) => {
    const res = await api.post(`/templates/${id}/upload-signature`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  uploadStamp: async (id, formData) => {
    const res = await api.post(`/templates/${id}/upload-stamp`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
};
