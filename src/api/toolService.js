import client from './client';

export const toolService = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const result = await client.get(`/tools?${query}`);

    // Safely extract the array whether it acts as the raw output or nested within .tools
    const sourceTools = Array.isArray(result) ? result : (result.tools || []);
    const tools = sourceTools.map(item => ({ ...item, id: item._id || item.id }));

    // If it's a paginated bundle, return it cleanly with metadata, otherwise just the array
    if (!Array.isArray(result) && result.totalPages !== undefined) {
      return {
        tools,
        pagination: {
          count: result.count,
          totalPages: result.totalPages,
          currentPage: result.currentPage
        }
      };
    }
    return tools;
  },
  getById: async (id) => {
    const item = await client.get(`/tools/${id}`);
    return { ...item, id: item._id };
  },
  create: (data) => client.post('/tools', data),
  update: (id, data) => client.put(`/tools/${id}`, data),
  delete: (id) => client.delete(`/tools/${id}`),
};
