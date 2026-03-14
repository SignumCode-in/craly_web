import client from './client';

export const settingsService = {
  get: (key) => client.get(`/settings/${key}`),
  update: (key, value) => client.put(`/settings/${key}`, { value }),
  
  getAvatars: () => client.get('/settings/avatars'),
  createAvatar: (data) => client.post('/settings/avatars', data),
  updateAvatar: (id, data) => client.put(`/settings/avatars/${id}`, data),
  deleteAvatar: (id) => client.delete(`/settings/avatars/${id}`),
  
  getModels: () => client.get('/settings/models'),
  updateModels: (value) => client.put('/settings/models', { value }),
  
  getAppUpdate: () => client.get('/settings/app-update'),
  updateAppUpdate: (value) => client.put('/settings/app-update', { value }),
  
  upload: (formData) => client.post('/settings/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};
