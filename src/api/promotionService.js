import client from './client';

export const promotionService = {
  getAll: async () => {
    const data = await client.get('/promotions');
    return data;
  },

  getById: async (id) => {
    const item = await client.get(`/promotions/${id}`);
    return item;
  },

  create: (data) => client.post('/promotions', data),

  update: (id, data) => client.put(`/promotions/${id}`, data),

  delete: (id) => client.delete(`/promotions/${id}`)
};
