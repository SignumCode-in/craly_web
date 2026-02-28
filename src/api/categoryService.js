import client from './client';

export const categoryService = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const data = await client.get(`/categories?${query}`);
    return data;
  },
  getById: async (id) => {
    const item = await client.get(`/categories/${id}`);
    return { ...item, id: item._id };
  },
  create: (data) => client.post('/categories', data),
  update: (id, data) => client.put(`/categories/${id}`, data),
  delete: (id) => client.delete(`/categories/${id}`),
};
