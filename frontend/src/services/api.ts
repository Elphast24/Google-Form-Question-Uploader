import axios from 'axios';
import type {
  UploadResponse,
  SaveDraftPayload,
  SaveDraftResponse,
  GenerateFormPayload,
  GenerateFormResponse,
  UserForm,
  UserDraft,
} from '@/types/api';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('firebaseToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const message = error.response.data?.error || 'An error occurred';
      throw new Error(message);
    } else if (error.request) {
      throw new Error(
        'Network error. Please check your connection and ensure the backend is running.'
      );
    } else {
      throw new Error(error.message);
    }
  }
);

export const uploadFile = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const saveDraft = async (
  payload: SaveDraftPayload
): Promise<SaveDraftResponse> => {
  const response = await api.post('/forms/drafts', payload);
  return response.data;
};

export const getUserDrafts = async (): Promise<{ drafts: UserDraft[] }> => {
  const response = await api.get('/forms/drafts');
  return response.data;
};

export const getDraft = async (draftId: string) => {
  const response = await api.get(`/forms/drafts/${draftId}`);
  return response.data;
};

export const deleteDraft = async (draftId: string) => {
  const response = await api.delete(`/forms/drafts/${draftId}`);
  return response.data;
};

export const generateForm = async (
  payload: GenerateFormPayload
): Promise<GenerateFormResponse> => {
  const response = await api.post('/forms/generate', payload);
  return response.data;
};

export const getUserForms = async (): Promise<{ forms: UserForm[] }> => {
  const response = await api.get('/forms');
  return response.data;
};

export const getGoogleAuthUrl = async () => {
  const response = await api.get('/auth/google');
  return response.data;
};

export const checkGoogleStatus = async () => {
  const response = await api.get('/auth/google/status');
  return response.data;
};

export default api;
