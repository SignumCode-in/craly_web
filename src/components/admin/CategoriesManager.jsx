import { useState, useEffect, useRef } from 'react';
import { categoryService } from '../../api/categoryService';
import { toolService } from '../../api/toolService';
import { Plus, Edit, Trash2, X, Save, Search, Power, ChevronDown, LayoutGrid, List, Layers, Loader } from 'lucide-react';
import MultiTagInput from './MultiTagInput';
import { tagService } from '../../api/tagService';

const CategoriesManager = () => {
  const [categories, setCategories] = useState([]);
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [toolSearchTerm, setToolSearchTerm] = useState('');
  const [showToolDropdown, setShowToolDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // View states
  const [viewType, setViewType] = useState('table'); // table, grid, tile

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 20;

  const [formData, setFormData] = useState({
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

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCategories(currentPage);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, currentPage]);

  const fetchCategories = async (page = 1) => {
    setLoading(true);
    try {
      // Backend actually does not natively support text search on categories GET endpoint inside getCategories
      // It supports pagination.
      // We will perform API search for all categories if there's no search query
      // but if there IS a search query we'll fetch all and filter client side OR use the new search API

      if (searchTerm) {
        // Using the new search API would be ideal, but for now we'll rely on the existing getAll which we just modified to take params
        // Wait, categoryController.js doesn't have search query support built-in for text matching yet. 
        // Let's just fetch everything and do client-side filtering if there's a searchTerm, 
        // OR use limit:0 to grab all and handle it locally
        const response = await categoryService.getAll({ limit: 0 }); // gets all
        const allCats = response.data?.categories || Array.isArray(response.data) ? response.data : (response.categories || response);
        const catList = Array.isArray(allCats) ? allCats.map(item => ({ ...item, id: item._id })) : [];

        const filtered = catList.filter(cat =>
          cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cat.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Set pagination locally for searched items
        setTotalCount(filtered.length);
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));

        const paginatedFiltered = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);
        setCategories(paginatedFiltered);
      } else {
        const response = await categoryService.getAll({ page: page, limit: itemsPerPage });

        // Extract data depending on how backend responded
        if (response.data && response.data.categories) {
          setCategories(response.data.categories.map(item => ({ ...item, id: item._id })));
          setTotalCount(response.data.count || 0);
          setTotalPages(response.data.totalPages || 1);
          setCurrentPage(response.data.currentPage || page);
        } else if (response.categories) {
          setCategories(response.categories.map(item => ({ ...item, id: item._id })));
          setTotalCount(response.count || 0);
          setTotalPages(response.totalPages || 1);
        } else if (Array.isArray(response.data)) {
          setCategories(response.data.map(item => ({ ...item, id: item._id })));
        } else if (Array.isArray(response)) {
          setCategories(response.map(item => ({ ...item, id: item._id })));
        }
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTools = async () => {
    try {
      const data = await toolService.getAll({ limit: 0 });
      setTools(data);
    } catch (error) {
      console.error('Error fetching tools:', error);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowToolDropdown(false);
      }
    };

    if (showToolDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showToolDropdown]);

  const generateCategoryId = (name) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const categoryData = {
        name: formData.name,
        iconName: formData.iconName,
        toolCount: parseInt(formData.toolCount) || 0,
        description: formData.description,
        enabled: formData.enabled,
        tools: formData.tools || [],
        tags: formData.tags || []
      };

      if (editingCategory) {
        // Update existing category
        await categoryService.update(editingCategory.id, categoryData);
      } else {
        // Create new category
        await categoryService.create({
          ...categoryData,
          _id: formData.id || generateCategoryId(formData.name)
        });
      }

      resetForm();
      fetchCategories(currentPage);
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Error saving category: ' + error.message);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      id: category.id,
      name: category.name,
      iconName: category.iconName || '',
      toolCount: category.toolCount || 0,
      description: category.description || '',
      enabled: category.enabled !== undefined ? category.enabled : true,
      tools: category.tools ? category.tools.map(t => typeof t === 'object' ? (t.id || t._id) : t) : [],
      tags: category.tags || []
    });
    setShowForm(true);
  };

  const handleToggleEnabled = async (category) => {
    try {
      await categoryService.update(category.id, {
        enabled: !category.enabled
      });
      fetchCategories(currentPage);
    } catch (error) {
      console.error('Error toggling category:', error);
      alert('Error updating category: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await categoryService.delete(id);
        fetchCategories(currentPage);
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Error deleting category: ' + error.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      iconName: '',
      toolCount: 0,
      description: '',
      enabled: true,
      tools: [],
      tags: []
    });
    setEditingCategory(null);
    setShowForm(false);
    setToolSearchTerm('');
    setShowToolDropdown(false);
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
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Categories Manager</h1>
          <p className="text-soft-grey mt-1">Total Categories: {totalCount}</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-soft-grey" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to page 1 on search
            }}
            placeholder="Search all categories..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white placeholder-soft-grey"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setViewType('table')}
            className={`p-2 rounded-lg transition-colors ${viewType === 'table' ? 'bg-primary text-white' : 'bg-white/5 text-soft-grey hover:bg-white/10 hover:text-white'}`}
          >
            <List className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewType('grid')}
            className={`p-2 rounded-lg transition-colors ${viewType === 'grid' ? 'bg-primary text-white' : 'bg-white/5 text-soft-grey hover:bg-white/10 hover:text-white'}`}
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewType('tile')}
            className={`p-2 rounded-lg transition-colors ${viewType === 'tile' ? 'bg-primary text-white' : 'bg-white/5 text-soft-grey hover:bg-white/10 hover:text-white'}`}
          >
            <Layers className="w-5 h-5" />
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark border border-white/10 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
              <button onClick={resetForm} className="text-soft-grey hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

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
                        id: editingCategory ? formData.id : generateCategoryId(name)
                      });
                    }}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">ID {editingCategory ? '(Read-only)' : '(Auto-generated)'}</label>
                  <input
                    type="text"
                    value={formData.id}
                    onChange={(e) => !editingCategory && setFormData({ ...formData, id: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary disabled:opacity-50 text-white"
                    disabled={!!editingCategory}
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

              {/* Multi-select Tool Dropdown */}
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

              {/* Tags */}
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
                  {editingCategory ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader className="w-8 h-8 text-primary animate-spin" />
        </div>
      ) : (
        <>
          {/* Table View */}
          {viewType === 'table' && (
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Icon & Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">ID</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Tool Count</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Description</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => (
                      <tr key={category.id} className="border-t border-white/10 hover:bg-white/5">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden shrink-0">
                            {category.iconName ? (
                              category.iconName.startsWith('http') ? (
                                <img
                                  src={category.iconName}
                                  alt={category.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-lg">{category.iconName}</span>
                              )
                            ) : '-'}
                          </div>
                          <span className="font-medium">{category.name}</span>
                        </td>
                        <td className="px-6 py-4 text-xs text-soft-grey font-mono">{category.id}</td>
                        <td className="px-6 py-4">
                          {category.tools && category.tools.length > 0 ? (
                            <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded">
                              {category.tools.length} tool(s)
                            </span>
                          ) : (
                            <span className="text-soft-grey">{category.toolCount || 0}</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleToggleEnabled(category)}
                            className={`flex items-center gap-2 px-3 py-1 rounded text-xs font-medium transition-colors ${category.enabled !== false
                              ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                              : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                              }`}
                          >
                            <Power className={`w-3 h-3 ${category.enabled !== false ? '' : 'opacity-50'}`} />
                            {category.enabled !== false ? 'Enabled' : 'Disabled'}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-soft-grey max-w-xs truncate">{category.description || '-'}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(category)}
                              className="p-2 hover:bg-white/10 rounded transition-colors"
                            >
                              <Edit className="w-4 h-4 text-primary" />
                            </button>
                            <button
                              onClick={() => handleDelete(category.id)}
                              className="p-2 hover:bg-white/10 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {categories.length === 0 && (
                      <tr><td colSpan="6" className="text-center py-8 text-soft-grey">No categories found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Grid View */}
          {viewType === 'grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
              {categories.map((category) => (
                <div key={category.id} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-colors flex flex-col group relative">
                  <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleEdit(category)} className="p-1.5 hover:bg-white/20 rounded text-primary bg-dark/50"><Edit className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(category.id)} className="p-1.5 hover:bg-white/20 rounded text-red-400 bg-dark/50"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 overflow-hidden">
                      {category.iconName ? (
                        category.iconName.startsWith('http') ? (
                          <img src={category.iconName} alt="" className="w-full h-full object-cover" />
                        ) : (<span className="text-2xl">{category.iconName}</span>)
                      ) : <span className="text-primary text-xl font-bold">{category.name[0]}</span>}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white truncate max-w-[150px]">{category.name}</h3>
                      <span className="text-xs text-soft-grey font-mono">{category.id}</span>
                    </div>
                  </div>
                  <p className="text-sm text-soft-grey mb-4 flex-1 line-clamp-2">{category.description || 'No description provided.'}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="px-2.5 py-1 bg-white/5 rounded text-xs font-semibold text-white">
                      {category.tools?.length || category.toolCount || 0} Tools
                    </div>
                    <button
                      onClick={() => handleToggleEnabled(category)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-colors ${category.enabled !== false
                        ? 'text-green-400 bg-green-400/10'
                        : 'text-red-400 bg-red-400/10'
                        }`}
                    >
                      <Power className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tile/List View */}
          {viewType === 'tile' && (
            <div className="flex flex-col gap-4 mb-6">
              {categories.map((category) => (
                <div key={category.id} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-colors flex items-center justify-between gap-6 group">
                  <div className="flex items-center gap-4 flex-1 overflow-hidden">
                    <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center shrink-0 border border-white/10 overflow-hidden">
                      {category.iconName ? (
                        category.iconName.startsWith('http') ? (
                          <img src={category.iconName} alt="" className="w-full h-full object-cover" />
                        ) : (<span className="text-xl">{category.iconName}</span>)
                      ) : <span className="text-white text-lg font-bold">{category.name[0]}</span>}
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <h3 className="font-bold text-white truncate">{category.name}</h3>
                      <p className="text-xs text-soft-grey truncate">{category.description || 'No description'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 shrink-0">
                    <div className="hidden md:flex flex-col items-end">
                      <span className="text-sm font-semibold text-white">{category.tools?.length || category.toolCount || 0} tools</span>
                      <span className="text-xs text-soft-grey font-mono">{category.id}</span>
                    </div>
                    <button
                      onClick={() => handleToggleEnabled(category)}
                      className={`p-2 rounded-full transition-colors ${category.enabled !== false ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}
                    >
                      <Power className="w-4 h-4" />
                    </button>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(category)} className="p-2 hover:bg-white/20 rounded-lg text-primary transition-colors"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(category.id)} className="p-2 hover:bg-white/20 rounded-lg text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8 bg-white/5 py-3 px-6 rounded-xl border border-white/10 inline-flex mx-auto">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
              >
                Previous
              </button>
              <div className="text-sm font-medium text-white">
                Page <span className="text-primary">{currentPage}</span> of {totalPages}
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-medium transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

    </div>
  );
};

export default CategoriesManager;
