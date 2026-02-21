import client from './client';

export const userService = {
  getProfile: () => client.get('/users/profile'),
  updateProfile: (data) => client.put('/users/profile', data),
  getSavedTools: () => client.get('/users/saved-tools'),
  saveTool: (toolId) => client.post(`/users/save-tool/${toolId}`),
  unsaveTool: (toolId) => client.delete(`/users/save-tool/${toolId}`),
  getActivity: () => client.get('/users/activity'),
  updatePreferences: (data) => client.put('/users/preferences', data),
  
  // Admin methods
  getAll: async () => {
    const data = await client.get('/users');
    return data.map(item => ({ ...item, id: item._id }));
  },
  delete: (id) => client.delete(`/users/${id}`),
};
