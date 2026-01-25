// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  // Auth endpoints
  REGISTER: `${API_BASE_URL}/api/auth/register`,
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  ADMIN_LOGIN: `${API_BASE_URL}/api/auth/admin-login`,
  
  // Complaint endpoints
  COMPLAINTS: `${API_BASE_URL}/api/complaints`,
  COMPLAINT_BY_ID: (id) => `${API_BASE_URL}/api/complaints/${id}`,
};

export default API_BASE_URL;
