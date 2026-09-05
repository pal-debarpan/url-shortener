import axios from 'axios';

const API_BASE_URL = import.meta.env.PROD
  ? ''
  : import.meta.env.VITE_API_BASE_URL || '';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('urlshawtie_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token expiry and error normalizing
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token if unauthorized and not already on auth pages
      localStorage.removeItem('urlshawtie_token');
      localStorage.removeItem('urlshawtie_user');
      if (
        !window.location.pathname.startsWith('/login') &&
        !window.location.pathname.startsWith('/signup') &&
        window.location.pathname !== '/'
      ) {
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

// Format human-readable error messages
export const formatErrorMessage = (error) => {
  if (!error.response) {
    return 'Unable to connect to the server. Please check your network or ensure the backend is running.';
  }

  const { status, data } = error.response;
  
  if (data?.detail) {
    if (typeof data.detail === 'string') {
      if (status === 409) {
        return 'The custom alias is already in use. Please choose another.';
      }
      return data.detail;
    }
    if (Array.isArray(data.detail) && data.detail.length > 0) {
      const firstErr = data.detail[0];
      const field = firstErr.loc?.slice(-1)[0] || 'Field';
      return `${field}: ${firstErr.msg}`;
    }
  }

  switch (status) {
    case 400:
      return 'Invalid request. Please check your input.';
    case 401:
      return 'Invalid email or password or session expired.';
    case 403:
      return 'You do not have permission to access this resource.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return 'The custom alias is already in use. Please choose another.';
    case 422:
      return 'Validation error. Please verify the provided URL and format.';
    case 500:
      return 'Internal server error. Please try again later.';
    default:
      return `An unexpected error occurred (Status ${status}).`;
  }
};

// Authentication API calls
export const registerUser = async ({ email, password }) => {
  const response = await apiClient.post('/api/v1/auth/register', {
    email,
    password,
  });
  return response.data;
};

export const loginUser = async ({ email, password }) => {
  const params = new URLSearchParams();
  params.append('username', email);
  params.append('password', password);

  const response = await apiClient.post('/api/v1/auth/login', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  return response.data;
};

export const supabaseLogin = async ({ email, supabase_uid }) => {
  const response = await apiClient.post('/api/v1/auth/supabase-login', {
    email,
    supabase_uid,
  });
  return response.data;
};

export const getCurrentUser = async () => {

  const response = await apiClient.get('/api/v1/auth/me');
  return response.data;
};

// URL API calls
export const createUrl = async ({ original_url, custom_alias }) => {
  const payload = {
    original_url,
    custom_alias: custom_alias?.trim() || null,
  };
  const response = await apiClient.post('/api/v1/urls', payload);
  return response.data;
};

export const getUrls = async () => {
  const response = await apiClient.get('/api/v1/urls');
  return response.data;
};

export const getUrl = async (shortCode) => {
  const response = await apiClient.get(`/api/v1/urls/${shortCode}`);
  return response.data;
};

export const getUrlStats = async (shortCode) => {
  const response = await apiClient.get(`/api/v1/urls/${shortCode}/stats`);
  return response.data;
};

export const deleteUrl = async (shortCode) => {
  const response = await apiClient.delete(`/api/v1/urls/${shortCode}`);
  return response.data;
};
