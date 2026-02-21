import client from './client';

export const settingsService = {
  get: (key) => client.get(`/settings/${key}`),
  update: (key, value) => client.put(`/settings/${key}`, { value }),
};
