import api from './api';

export const submitConsultancyBooking = async (formData) => {
  const response = await api.post('/consultancy-bookings', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getConsultancyBookings = async (params = {}) => {
  const response = await api.get('/consultancy-bookings', { params });
  return response.data;
};

export const updateConsultancyBookingStatus = async (id, data) => {
  const response = await api.patch(`/consultancy-bookings/${id}/status`, data);
  return response.data;
};

export const addConsultancyBookingNote = async (id, text) => {
  const response = await api.post(`/consultancy-bookings/${id}/notes`, { text });
  return response.data;
};

export const deleteConsultancyBooking = async (id) => {
  const response = await api.delete(`/consultancy-bookings/${id}`);
  return response.data;
};
