import client from './client';

export const postService = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const data = await client.get(`/posts${query ? '?' + query : ''}`);
    const posts = Array.isArray(data) ? data : (data.posts || []);
    return posts.map(item => ({ ...item, postId: item._id || item.postId, id: item._id || item.postId }));
  },
  getById: async (id) => {
    const item = await client.get(`/posts/${id}`);
    return { ...item, postId: item._id, id: item._id };
  },
  create: (data) => client.post('/posts', data),
  update: (id, data) => client.put(`/posts/${id}`, data),
  delete: (id) => client.delete(`/posts/${id}`),
};
