import client from './client';

export const authService = {
  adminLogin: async (email, password) => {
    const data = await client.post('/auth/admin/login', { email, password });
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  },
  userLogin: async (idToken) => {
    const data = await client.post('/auth/user/login', { idToken });
    return data;
  },
  logout: () => {
    localStorage.removeItem('token');
  }
};
