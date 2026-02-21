import client from './client';

export const workflowService = {
  getAll: async () => {
    const data = await client.get('/workflows');
    return data.map(item => ({ ...item, id: item._id }));
  },
  getById: async (id) => {
    const item = await client.get(`/workflows/${id}`);
    return { ...item, id: item._id };
  },
  create: (data) => client.post('/workflows', data),
  update: (id, data) => client.put(`/workflows/${id}`, data),
  delete: (id) => client.delete(`/workflows/${id}`),
};
