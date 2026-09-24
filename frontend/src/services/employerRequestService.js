import api from './api';

export const submitEmployerRequest = async (data) => {
  const response = await api.post('/employer-requests', data);
  return response.data;
};

export const getEmployerRequests = async (params = {}) => {
  const response = await api.get('/employer-requests', { params });
  return response.data;
};

export const updateEmployerRequestStatus = async (id, status) => {
  const response = await api.patch(`/employer-requests/${id}/status`, { status });
  return response.data;
};

export const addEmployerRequestNote = async (id, text) => {
  const response = await api.post(`/employer-requests/${id}/notes`, { text });
  return response.data;
};

export const deleteEmployerRequest = async (id) => {
  const response = await api.delete(`/employer-requests/${id}`);
  return response.data;
};
