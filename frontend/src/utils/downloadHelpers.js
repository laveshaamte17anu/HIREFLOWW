import api from '../services/api';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const API_BASE_HOST = API_URL.replace(/\/api$/, '');

/**
 * Downloads candidate applicants CSV file securely using Axios with JWT token header.
 */
export const downloadApplicantsCSV = async (addToast) => {
  try {
    const response = await api.get('/analytics/export-csv', {
      responseType: 'blob',
    });

    const blob = new Blob([response.data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'hireflow_applicants.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    if (addToast) {
      addToast('CSV report downloaded successfully', 'success');
    }
  } catch (error) {
    console.error('CSV Download Error:', error);
    if (addToast) {
      addToast('Failed to download CSV report', 'error');
    }
  }
};

/**
 * Constructs a full URL for viewing/downloading static resume uploads.
 */
export const getResumeUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return `${API_BASE_HOST}${path.startsWith('/') ? '' : '/'}${path}`;
};
