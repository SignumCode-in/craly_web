import { useState, useEffect } from 'react';
import { toolService } from '../../../api/toolService';
import { categoryService } from '../../../api/categoryService';
import { tagService } from '../../../api/tagService';
import SimpleTextEditor from '../SimpleTextEditor';
import SearchableSelect from '../SearchableSelect';
import MultiTagInput from '../MultiTagInput';
import { Save, X } from 'lucide-react';

const PostForm = ({ initialData, onSubmit, onCancel, submitText, isEditing }) => {
  const [tools, setTools] = useState([]);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState(initialData || {
    postType: 'post',
    title: '',
    body: '',
    tool: '',
    category: '',
    media: { type: 'image', url: '', thumbnailUrl: '' },
    prompt: { content: '', toolId: '', copyEnabled: true, difficulty: 'beginner', estimatedTime: '', usedCount: 0 },
    tags: [],
    likes: 0,
    sharesCount: 0,
    isTrending: false,
    isFeatured: false,
    isSponsored: false,
    status: 'draft',
    timestamp: Date.now()
  });

  useEffect(() => {
    fetchTools();
    fetchCategories();
  }, []);

  const fetchTools = async () => {
    try {
      const response = await toolService.getAll({ limit: 0 });
      const toolsData = response.tools || (Array.isArray(response) ? response : []);
      setTools(toolsData);
    } catch (error) {
      console.error('Error fetching tools:', error);
      setTools([]);
    }
  };

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
      likes: parseInt(formData.likes) || 0,
      timestamp: isEditing ? formData.timestamp : Date.now()
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Post Type *</label>
          <select
            value={formData.postType}
            onChange={(e) => setFormData({ ...formData, postType: e.target.value })}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
            required
          >
            <option value="post">Post</option>
            <option value="news">News</option>
            <option value="prompt">Prompt</option>
            <option value="announcement">Announcement</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Status *</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
            required
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Body *</label>
        <SimpleTextEditor
          value={formData.body}
          onChange={(value) => setFormData({ ...formData, body: value })}
          placeholder="Enter post body content..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Tool</label>
          <SearchableSelect
            options={[
              { value: '', label: 'Select Tool' },
              ...tools.map(tool => ({ value: tool.id || tool._id, label: tool.name }))
            ]}
            value={formData.tool}
            onChange={(value) => setFormData({ ...formData, tool: value })}
            placeholder="Select Tool"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <SearchableSelect
            options={[
              { value: '', label: 'Select Category' },
              ...categories.map(category => ({ value: category.id, label: category.name }))
            ]}
            value={formData.category}
            onChange={(value) => setFormData({ ...formData, category: value })}
            placeholder="Select Category"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Media Type</label>
          <select
            value={formData.media.type}
            onChange={(e) => setFormData({ ...formData, media: { ...formData.media, type: e.target.value } })}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Media URL</label>
          <input
            type="url"
            value={formData.media.url || ''}
            onChange={(e) => setFormData({ ...formData, media: { ...formData.media, url: e.target.value } })}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
            placeholder="https://example.com/media"
          />
        </div>
        {formData.media.type === 'video' && (
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-2">Thumbnail URL</label>
            <input
              type="url"
              value={formData.media.thumbnailUrl || ''}
              onChange={(e) => setFormData({ ...formData, media: { ...formData.media, thumbnailUrl: e.target.value } })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
              placeholder="https://example.com/thumbnail.jpg"
            />
          </div>
        )}
      </div>

      {formData.postType === 'prompt' && (
        <div className="space-y-4 p-4 border border-white/10 rounded-lg bg-white/5">
          <h3 className="font-semibold text-lg">Prompt Details</h3>
          <div>
            <label className="block text-sm font-medium mb-2">Prompt Content</label>
            <textarea
              value={formData.prompt.content || ''}
              onChange={(e) => setFormData({ ...formData, prompt: { ...formData.prompt, content: e.target.value } })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary h-24 whitespace-pre-wrap"
              placeholder="Enter the prompt content..."
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Difficulty</label>
              <select
                value={formData.prompt.difficulty}
                onChange={(e) => setFormData({ ...formData, prompt: { ...formData.prompt, difficulty: e.target.value } })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Estimated Time</label>
              <input
                type="text"
                value={formData.prompt.estimatedTime || ''}
                onChange={(e) => setFormData({ ...formData, prompt: { ...formData.prompt, estimatedTime: e.target.value } })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
                placeholder="e.g. 10 mins"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 mt-8 flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.prompt.copyEnabled}
                  onChange={(e) => setFormData({ ...formData, prompt: { ...formData.prompt, copyEnabled: e.target.checked } })}
                  className="rounded text-primary focus:ring-primary w-4 h-4"
                />
                Copy Enabled
              </label>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
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
        <div>
          <label className="block text-sm font-medium mb-2">Likes</label>
          <input
            type="number"
            value={formData.likes}
            onChange={(e) => setFormData({ ...formData, likes: e.target.value })}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 p-4 border border-white/10 rounded-lg bg-white/5">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isTrending}
            onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
            className="w-4 h-4 rounded text-primary focus:ring-primary"
          />
          <span className="text-sm font-medium">Trending</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isFeatured}
            onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
            className="w-4 h-4 rounded text-primary focus:ring-primary"
          />
          <span className="text-sm font-medium">Featured</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isSponsored}
            onChange={(e) => setFormData({ ...formData, isSponsored: e.target.checked })}
            className="w-4 h-4 rounded text-primary focus:ring-primary"
          />
          <span className="text-sm font-medium">Sponsored</span>
        </label>
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

export default PostForm;
