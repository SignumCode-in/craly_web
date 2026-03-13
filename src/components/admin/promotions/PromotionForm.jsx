import { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import SearchableSelect from '../SearchableSelect';
import MultiTagInput from '../MultiTagInput';
import MultiSelectDropdown from '../MultiSelectDropdown';
import { partnerService } from '../../../api/partnerService';
import { toolService } from '../../../api/toolService';
import { tagService } from '../../../api/tagService';
import { categoryService } from '../../../api/categoryService';
import { COUNTRIES, formatCategoriesForSelect } from '../../../utils/constants';

const PromotionForm = ({ initialData, onSubmit, onCancel, submitText, isEditing }) => {
  const [partners, setPartners] = useState([]);
  const [tools, setTools] = useState([]);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState(initialData || {
    partnerId: '',
    toolId: '',
    placementType: 'homepage',
    startDate: '',
    endDate: '',
    priority: 0,
    isActive: true,
    targetCategories: [],
    targetTags: [],
    targetCountries: [],
    impressions: 0,
    clicks: 0,
    amountPaid: 0,
    currency: 'INR',
    media: { type: 'image', url: '' },
    customHeadline: '',
    showSponsoredLabel: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [partnerRes, toolRes, catRes] = await Promise.all([
        partnerService.getAll(),
        toolService.getAll({ limit: 0 }),
        categoryService.getAll()
      ]);
      setPartners(partnerRes || []);
      setTools(toolRes?.tools || (Array.isArray(toolRes) ? toolRes : []));
      const cats = catRes?.categories || (catRes?.data && catRes?.data?.categories) || (Array.isArray(catRes) ? catRes : []);
      setCategories(cats);
    } catch (error) {
      console.error('Error fetching form data:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Partner *</label>
          <SearchableSelect
            options={[
              { value: '', label: 'Select Partner' },
              ...partners.map(p => ({ value: p._id, label: p.name }))
            ]}
            value={formData.partnerId}
            onChange={(value) => setFormData({ ...formData, partnerId: value })}
            placeholder="Select Partner"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Tool *</label>
          <SearchableSelect
            options={[
              { value: '', label: 'Select Tool' },
              ...tools.map(t => ({ value: (t._id || t.id), label: t.name }))
            ]}
            value={formData.toolId}
            onChange={(value) => setFormData({ ...formData, toolId: value })}
            placeholder="Select Tool"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Placement Type *</label>
        <select
          value={formData.placementType}
          onChange={(e) => setFormData({ ...formData, placementType: e.target.value })}
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white"
          required
        >
          <option value="homepage">Homepage</option>
          <option value="category_top">Category Top</option>
          <option value="banner">Banner</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Start Date *</label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">End Date *</label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Priority (higher = first)</label>
        <input
          type="number"
          value={formData.priority}
          onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          className="w-4 h-4"
        />
        <label htmlFor="isActive" className="text-sm font-medium">Active Campaign</label>
      </div>

      <div className="border-t border-white/10 pt-4 mt-4">
        <h3 className="text-lg font-semibold mb-4 text-primary">Targeting</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Categories</label>
            <MultiSelectDropdown
              options={formatCategoriesForSelect(categories)}
              value={formData.targetCategories}
              onChange={(val) => setFormData({ ...formData, targetCategories: val })}
              placeholder="Select categories"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tags (Type # to search)</label>
            <MultiTagInput
              value={formData.targetTags}
              onChange={(val) => setFormData({ ...formData, targetTags: val })}
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
          <div>
            <label className="block text-sm font-medium mb-1">Countries</label>
            <MultiSelectDropdown
              options={COUNTRIES}
              value={formData.targetCountries}
              onChange={(val) => setFormData({ ...formData, targetCountries: val })}
              placeholder="Select countries"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 pt-4 mt-4">
        <h3 className="text-lg font-semibold mb-4 text-primary">Analytics & Payment</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Impressions</label>
            <input
              type="number"
              value={formData.impressions}
              onChange={(e) => setFormData({ ...formData, impressions: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Clicks</label>
            <input
              type="number"
              value={formData.clicks}
              onChange={(e) => setFormData({ ...formData, clicks: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Amount Paid</label>
            <input
              type="number"
              value={formData.amountPaid}
              onChange={(e) => setFormData({ ...formData, amountPaid: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Currency</label>
            <input
              type="text"
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 pt-4 mt-4">
        <h3 className="text-lg font-semibold mb-4 text-primary">Visuals</h3>
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="w-1/3">
              <label className="block text-sm font-medium mb-1">Media Type</label>
              <select
                value={formData.media.type}
                onChange={(e) => setFormData({ ...formData, media: { ...formData.media, type: e.target.value } })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Media URL</label>
              <input
                type="url"
                value={formData.media.url}
                onChange={(e) => setFormData({ ...formData, media: { ...formData.media, url: e.target.value } })}
                placeholder="https://..."
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Custom Headline</label>
            <input
              type="text"
              value={formData.customHeadline}
              onChange={(e) => setFormData({ ...formData, customHeadline: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="showSponsoredLabel"
              checked={formData.showSponsoredLabel}
              onChange={(e) => setFormData({ ...formData, showSponsoredLabel: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="showSponsoredLabel" className="text-sm font-medium">Show "Sponsored" Label</label>
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4 mt-6 border-t border-white/10">
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

export default PromotionForm;
