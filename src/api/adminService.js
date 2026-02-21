import client from './client';

export const adminService = {
  bulkUpload: (data) => client.post('/admin/bulk-upload', data),
  getStats: () => client.get('/admin/stats'),
};
