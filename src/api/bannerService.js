import client from './client';

export const bannerService = {
  getAll: async () => {
    const data = await client.get('/banners');
    return data.map(item => ({ ...item, id: item._id }));
  },
  create: (data) => client.post('/banners', data),
  update: (id, data) => client.put(`/banners/${id}`, data),
  delete: (id) => client.delete(`/banners/${id}`),
};
