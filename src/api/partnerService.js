import client from './client';

export const partnerService = {
  getAll: async () => {
    const data = await client.get('/partners');
    return data;
  },

  getById: async (id) => {
    const item = await client.get(`/partners/${id}`);
    return item;
  },

  create: (data) => client.post('/partners', data),
  
  update: (id, data) => client.put(`/partners/${id}`, data),
  
  delete: (id) => client.delete(`/partners/${id}`)
};
