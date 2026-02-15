import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

if (!import.meta.env.VITE_API_URL) {
  console.warn('⚠️ VITE_API_URL not found. Using localhost.');
}else{
  console.log('✅ VITE_API_URL found:', import.meta.env.VITE_API_URL);
}

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('firebaseToken');
    
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      hasToken: !!token
    });

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('⚠️ No auth token found in localStorage');
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      message: error.response?.data?.error,
      url: error.config?.url
    });

    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.error || 'An error occurred';
      
      // Handle specific error cases
      if (error.response.status === 401) {
        console.error('❌ Unauthorized - Token may be invalid or expired');
        // Optionally clear token and redirect to sign in
        // localStorage.removeItem('firebaseToken');
        // window.location.href = '/';
      }
      
      if (error.response.status === 404) {
        console.error('❌ Route not found:', error.config?.url);
      }
      
      throw new Error(message);
    } else if (error.request) {
      // Request made but no response
      console.error('❌ Network Error - No response from server');
      throw new Error('Network error. Please check your connection and ensure backend is running.');
    } else {
      // Something else happened
      console.error('❌ Request Error:', error.message);
      throw new Error(error.message);
    }
  }
);

/**
 * Upload file and get parsed questions
 */
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' }});
  return response.data;
};

/**
 * Save draft form
 */
export const saveDraft = async (payload) => {
  console.log('💾 Saving draft:', payload.title);
  const response = await api.post('/forms/drafts', payload);
  return response.data;
};

/**
 * Get all drafts for user
 */
export const getUserDrafts = async () => {
  console.log('📋 Fetching user drafts');
  const response = await api.get('/forms/drafts');
  return response.data;
};

/**
 * Get single draft by ID
 */
export const getDraft = async (draftId) => {
  console.log('📄 Fetching draft:', draftId);
  const response = await api.get(`/forms/drafts/${draftId}`);
  return response.data;
};

/**
 * Delete draft
 */
export const deleteDraft = async (draftId) => {
  console.log('🗑️ Deleting draft:', draftId);
  const response = await api.delete(`/forms/drafts/${draftId}`);
  return response.data;
};


/**
 * Generate Google Form from questions
 */
export const generateForm = async (payload) => {
  console.log('📝 Generating form:', payload.title);
  const response = await api.post('/forms/generate', payload);
  return response.data;
};

/**
 * Get all forms for authenticated user
 */
export const getUserForms = async () => {
  console.log('📋 Fetching user forms');
  const response = await api.get('/forms');
  return response.data;
};

/**
 * Get Google OAuth URL
 */
export const getGoogleAuthUrl = async () => {
  console.log('🔐 Getting Google OAuth URL');
  const response = await api.get('/auth/google');
  return response.data;
};

/**
 * Check Google connection status
 */
export const checkGoogleStatus = async () => {
  console.log('🔍 Checking Google connection status');
  const response = await api.get('/auth/google/status');
  return response.data;
};

export default api;