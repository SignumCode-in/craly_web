import client from './client';

export const toolService = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const result = await client.get(`/tools?${query}`);
    // If it's a paginated result, it might be in result.tools
    const tools = result.tools || (Array.isArray(result) ? result : []);
    return tools.map(item => ({ ...item, id: item._id }));
  },
  getById: async (id) => {
    const item = await client.get(`/tools/${id}`);
    return { ...item, id: item._id };
  },
  create: (data) => client.post('/tools', data),
  update: (id, data) => client.put(`/tools/${id}`, data),
  delete: (id) => client.delete(`/tools/${id}`),
};
