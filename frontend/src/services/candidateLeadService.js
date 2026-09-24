import api from './api';

export const submitCandidateLead = async (formData) => {
  const response = await api.post('/candidate-leads', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getTalentPoolLeads = async (params = {}) => {
  const response = await api.get('/candidate-leads', { params });
  return response.data;
};

export const getTalentPoolLeadById = async (id) => {
  const response = await api.get(`/candidate-leads/${id}`);
  return response.data;
};

export const updateLeadStatus = async (id, status) => {
  const response = await api.patch(`/candidate-leads/${id}/status`, { status });
  return response.data;
};

export const addLeadNote = async (id, text) => {
  const response = await api.post(`/candidate-leads/${id}/notes`, { text });
  return response.data;
};

export const deleteLead = async (id) => {
  const response = await api.delete(`/candidate-leads/${id}`);
  return response.data;
};
