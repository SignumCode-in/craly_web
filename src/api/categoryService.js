import client from './client';

export const categoryService = {
  getAll: async () => {
    const data = await client.get('/categories');
    return data.map(item => ({ ...item, id: item._id }));
  },
  getById: async (id) => {
    const item = await client.get(`/categories/${id}`);
    return { ...item, id: item._id };
  },
  create: (data) => client.post('/categories', data),
  update: (id, data) => client.put(`/categories/${id}`, data),
  delete: (id) => client.delete(`/categories/${id}`),
};
