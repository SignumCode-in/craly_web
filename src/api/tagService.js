import client from './client';

export const tagService = {
  getAll: async (query = '', all = false) => {
      // Because client already does result.data || result
      const response = await client.get(`/tags?q=${query}&all=${all}`);
      return response;
  },
  create: async (data) => {
      const payload = typeof data === 'string' ? { name: data } : data;
      const response = await client.post('/tags', payload);
      return response;
  },
  update: async (id, data) => {
      const response = await client.put(`/tags/${id}`, data);
      return response;
  },
  delete: async (id) => {
      const response = await client.delete(`/tags/${id}`);
      return response;
  }
};
