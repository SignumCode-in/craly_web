import client from './client';

export const searchService = {
  searchAll: (query) => client.get(`/search?q=${query}`),
  searchTools: (query) => client.get(`/search/tools?q=${query}`),
  searchCategories: (query) => client.get(`/search/categories?q=${query}`),
  searchPosts: (query) => client.get(`/search/posts?q=${query}`),
  searchWorkflows: (query) => client.get(`/search/workflows?q=${query}`),
};
