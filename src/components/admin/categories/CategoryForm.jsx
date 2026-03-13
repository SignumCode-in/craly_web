import { useState, useEffect, useRef } from 'react';
import { toolService } from '../../../api/toolService';
import { tagService } from '../../../api/tagService';
import MultiTagInput from '../MultiTagInput';
import { Save, X, ChevronDown } from 'lucide-react';

const CategoryForm = ({ initialData, onSubmit, onCancel, submitText, isEditing }) => {
  const [tools, setTools] = useState([]);
  const [toolSearchTerm, setToolSearchTerm] = useState('');
  const [showToolDropdown, setShowToolDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const [formData, setFormData] = useState(initialData || {
    id: '',
    name: '',
    iconName: '',
    toolCount: 0,
    description: '',
    enabled: true,
    tools: [],
    tags: []
  });

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      const data = await toolService.getAll({ limit: 0 });
      setTools(Array.isArray(data) ? data : data?.tools || []);
    } catch (error) {
      console.error('Error fetching tools:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowToolDropdown(false);
      }
    };
    if (showToolDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showToolDropdown]);

  const generateCategoryId = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      toolCount: parseInt(formData.toolCount) || 0
    });
  };

  const toggleToolSelection = (toolId) => {
    setFormData(prev => ({
      ...prev,
      tools: prev.tools.includes(toolId)
        ? prev.tools.filter(id => id !== toolId)
        : [...prev.tools, toolId]
    }));
  };

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(toolSearchTerm.toLowerCase())
  );

  const getToolName = (toolId) => {
    const tool = tools.find(t => t.id === toolId);
    return tool ? tool.name : toolId;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => {
              const name = e.target.value;
              setFormData({
                ...formData,
                name,
                id: isEditing ? formData.id : generateCategoryId(name)
              });
            }}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">ID {isEditing ? '(Read-only)' : '(Auto-generated)'}</label>
          <input
            type="text"
            value={formData.id}
            onChange={(e) => !isEditing && setFormData({ ...formData, id: e.target.value })}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary disabled:opacity-50 text-white"
            disabled={isEditing}
            placeholder="Auto-generated from name"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Icon Name or URL</label>
        <input
          type="text"
          value={formData.iconName}
          onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white"
          placeholder="e.g., folder, tag, star, or https://..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Tool Count</label>
        <input
          type="number"
          value={formData.toolCount}
          onChange={(e) => setFormData({ ...formData, toolCount: e.target.value })}
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white"
          rows="3"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Tools (Optional)</label>
        <div className="relative" ref={dropdownRef}>
          <div
            onClick={() => setShowToolDropdown(!showToolDropdown)}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg cursor-pointer flex items-center justify-between"
          >
            <span className="text-sm text-white">
              {formData.tools.length > 0
                ? `${formData.tools.length} tool(s) selected`
                : 'Select tools...'}
            </span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showToolDropdown ? 'rotate-180' : ''}`} />
          </div>

          {showToolDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-dark border border-white/10 rounded-lg shadow-lg max-h-64 overflow-hidden">
              <div className="p-2 border-b border-white/10">
                <input
                  type="text"
                  value={toolSearchTerm}
                  onChange={(e) => setToolSearchTerm(e.target.value)}
                  placeholder="Search tools..."
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-sm focus:outline-none focus:border-primary text-white placeholder-soft-grey"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              <div className="max-h-48 overflow-y-auto">
                {filteredTools.length > 0 ? (
                  filteredTools.map(tool => (
                    <div
                      key={tool.id}
                      onClick={() => toggleToolSelection(tool.id)}
                      className="px-4 py-2 hover:bg-white/5 cursor-pointer flex items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        checked={formData.tools.includes(tool.id)}
                        onChange={() => { }}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-white">{tool.name}</span>
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-sm text-soft-grey">No tools found</div>
                )}
              </div>
            </div>
          )}
        </div>
        {formData.tools.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.tools.map(toolId => (
              <span
                key={toolId}
                className="px-2 py-1 bg-primary/20 text-primary rounded text-xs flex items-center gap-1"
              >
                {getToolName(toolId)}
                <button
                  type="button"
                  onClick={() => toggleToolSelection(toolId)}
                  className="hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Tags (Type # to search)</label>
        <MultiTagInput
          value={formData.tags}
          onChange={(val) => setFormData({ ...formData, tags: val })}
          fetchSuggestions={async (q) => {
            const fetchedTags = await tagService.getAll(q);
            return fetchedTags.map(t => ({ label: t.name, value: t.name }));
          }}
          onCreateNew={async (newTagName) => {
            return await tagService.create(newTagName);
          }}
          placeholder="Add tags..."
        />
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

export default CategoryForm;
