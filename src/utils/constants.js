export const COUNTRIES = [
  { value: 'GLOBAL', label: 'Global (All)' },
  { value: 'US', label: 'United States' },
  { value: 'IN', label: 'India' },
  { value: 'UK', label: 'United Kingdom' },
  { value: 'CA', label: 'Canada' },
  { value: 'AU', label: 'Australia' },
  { value: 'DE', label: 'Germany' },
  { value: 'FR', label: 'France' },
  { value: 'JP', label: 'Japan' },
  { value: 'CN', label: 'China' },
  { value: 'SG', label: 'Singapore' },
  // More can be added as deemed fit
];

export const formatCategoriesForSelect = (categories) => {
  if (!categories) return [];
  return categories.map(cat => ({
    value: cat.name,
    label: cat.name
  }));
};
