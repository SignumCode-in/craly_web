const BASE_URL = import.meta.env.VITE_API_URL || 'http://192.168.0.100:5000/api';

const getHeaders = async () => {
  const headers = {
    'Content-Type': 'application/json',
  };

  // If you have a way to get the token, add it here
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

const handleResponse = async (response) => {
  let result;
  try {
    result = await response.json();
  } catch (err) {
    result = { message: 'Invalid server response' };
  }

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      // Only redirect if we are not already on the auth page
      if (window.location.pathname !== '/admin/auth') {
        window.location.href = '/admin/auth';
      }
    }
    // Throw error so UI components can display it
    throw new Error(result.message || 'An error occurred');
  }

  return result.data !== undefined ? result.data : result;
};

const client = {
  get: async (endpoint) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: await getHeaders(),
    });
    return handleResponse(response);
  },

  post: async (endpoint, data) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: await getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  put: async (endpoint, data) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: await getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  delete: async (endpoint) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: await getHeaders(),
    });
    return handleResponse(response);
  },
};

export default client;
