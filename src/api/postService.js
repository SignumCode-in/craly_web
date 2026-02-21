import client from './client';

export const postService = {
  getAll: async () => {
    const data = await client.get('/posts');
    return data.map(item => ({ ...item, postId: item._id, id: item._id }));
  },
  getById: async (id) => {
    const item = await client.get(`/posts/${id}`);
    return { ...item, postId: item._id, id: item._id };
  },
  create: (data) => client.post('/posts', data),
  update: (id, data) => client.put(`/posts/${id}`, data),
  delete: (id) => client.delete(`/posts/${id}`),
};
