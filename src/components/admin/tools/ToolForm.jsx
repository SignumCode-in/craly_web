import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryService } from '../../../api/categoryService';
import { tagService } from '../../../api/tagService';
import MultiTagInput from '../MultiTagInput';
import { Save, Heart } from 'lucide-react';

const ToolForm = ({ initialData, onSubmit, onCancel, submitText }) => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState(initialData || {
    name: '',
    category: '',
    shortDescription: '',
    longDescription: '',
    url: '',
    logoUrl: '',
    pricing: 'Freemium',
    tags: [],
    isTrending: false,
    isPartnerTool: false,
    enabled: true,
    likesCount: 0
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAll({ limit: 0 });
      const cats = response.categories || (response.data && response.data.categories) || (Array.isArray(response) ? response : []);
      setCategories(cats.map(item => ({ ...item, id: item._id || item.id })));
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      likesCount: parseInt(formData.likesCount) || 0
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Category *</label>
          <select
            value={formData.category || ''}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
            required
          >
            <option value="">Select Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Short Description *</label>
        <input
          type="text"
          value={formData.shortDescription}
          onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Long Description</label>
        <textarea
          value={formData.longDescription}
          onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
          rows="4"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">URL *</label>
          <input
            type="url"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Logo URL</label>
          <input
            type="url"
            value={formData.logoUrl}
            onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Pricing</label>
          <select
            value={formData.pricing}
            onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
          >
            <option value="Free">Free</option>
            <option value="Freemium">Freemium</option>
            <option value="Paid">Paid</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Likes Count</label>
          <input
            type="number"
            value={formData.likesCount}
            onChange={(e) => setFormData({ ...formData, likesCount: e.target.value })}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Tags (Type # to search)</label>
        <MultiTagInput
          value={formData.tags}
          onChange={(val) => setFormData({ ...formData, tags: val })}
          fetchSuggestions={async (q) => {
            const tags = await tagService.getAll(q);
            return tags.map(t => ({ label: t.name, value: t.name }));
          }}
          onCreateNew={async (newTagName) => {
            return await tagService.create(newTagName);
          }}
          placeholder="Add tags..."
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isTrending"
            checked={formData.isTrending}
            onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
            className="w-4 h-4"
          />
          <label htmlFor="isTrending" className="text-sm font-medium">Is Trending</label>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isPartnerTool"
            checked={formData.isPartnerTool}
            onChange={(e) => setFormData({ ...formData, isPartnerTool: e.target.checked })}
            className="w-4 h-4"
          />
          <label htmlFor="isPartnerTool" className="text-sm font-medium flex items-center gap-1"><Heart className="w-4 h-4 text-blue-400" /> Partner Tool</label>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="enabled"
            checked={formData.enabled}
            onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
            className="w-4 h-4"
          />
          <label htmlFor="enabled" className="text-sm font-medium">Enabled</label>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
        >
          <Save className="w-5 h-5" />
          {submitText || 'Save'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ToolForm;
