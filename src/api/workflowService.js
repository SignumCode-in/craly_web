import client from './client';

export const workflowService = {
  getAll: async (params = {}) => {
    // Construct query string since client.get takes a single endpoint string
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.append('page', params.page);
    if (params.limit) searchParams.append('limit', params.limit);
    if (params.search) searchParams.append('search', params.search);
    
    const queryString = searchParams.toString();
    const endpoint = queryString ? `/workflows?${queryString}` : '/workflows';
    
    // client returns result.data directly if it exists, otherwise result
    const data = await client.get(endpoint);
    
    // Extract workflows array safely
    const workflowsArray = Array.isArray(data?.workflows) ? data.workflows : 
                           Array.isArray(data) ? data : [];

    return {
      items: workflowsArray.map(item => ({ ...item, id: item._id || item.id })),
      totalPages: data?.totalPages || 1,
      totalCount: data?.count || workflowsArray.length,
      currentPage: data?.currentPage || 1
    };
  },
  getById: async (id) => {
    const item = await client.get(`/workflows/${id}`);
    return { ...item, id: item._id };
  },
  create: (data) => client.post('/workflows', data),
  update: (id, data) => client.put(`/workflows/${id}`, data),
  delete: (id) => client.delete(`/workflows/${id}`),
};
