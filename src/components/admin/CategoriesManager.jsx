import { useState, useEffect, useRef } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Plus, Edit, Trash2, X, Save, Search, Power, ChevronDown } from 'lucide-react';

const CategoriesManager = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [toolSearchTerm, setToolSearchTerm] = useState('');
  const [showToolDropdown, setShowToolDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    iconName: '',
    toolCount: 0,
    description: '',
    enabled: true,
    tools: []
  });

  useEffect(() => {
    fetchCategories();
    fetchTools();
  }, []);

  const fetchCategories = async () => {
    try {
      const q = query(collection(db, 'categories'), orderBy('name'));
      const snapshot = await getDocs(q);
      const categoriesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCategories(categoriesData);
      setFilteredCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTools = async () => {
    try {
      const q = query(collection(db, 'tools'), orderBy('name'));
      const snapshot = await getDocs(q);
      const toolsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTools(toolsData);
    } catch (error) {
      console.error('Error fetching tools:', error);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      const filtered = categories.filter(cat =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories);
    }
  }, [searchTerm, categories]);

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
        tools: formData.tools || []
      };

      if (editingCategory) {
        // Update existing category
        await updateDoc(doc(db, 'categories', editingCategory.id), categoryData);
      } else {
        // Create new category with custom document ID
        const categoryId = formData.id || generateCategoryId(formData.name);
        await setDoc(doc(db, 'categories', categoryId), {
          ...categoryData,
          id: categoryId
        });
      }

      resetForm();
      fetchCategories();
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
      tools: category.tools || []
    });
    setShowForm(true);
  };

  const handleToggleEnabled = async (category) => {
    try {
      await updateDoc(doc(db, 'categories', category.id), {
        enabled: !category.enabled
      });
      fetchCategories();
    } catch (error) {
      console.error('Error toggling category:', error);
      alert('Error updating category: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteDoc(doc(db, 'categories', id));
        fetchCategories();
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
      tools: []
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

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Categories Manager</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </button>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-soft-grey" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search categories..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white placeholder-soft-grey"
          />
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
                <label className="block text-sm font-medium mb-2">Icon Name</label>
                <input
                  type="text"
                  value={formData.iconName}
                  onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white"
                  placeholder="e.g., folder, tag, star"
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
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-sm focus:outline-none focus:border-primary"
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
                              <span className="text-sm">{tool.name}</span>
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

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Icon</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Tool Count</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Tools</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Description</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category) => (
                <tr key={category.id} className="border-t border-white/10 hover:bg-white/5">
                  <td className="px-6 py-4 text-xs text-soft-grey font-mono">{category.id}</td>
                  <td className="px-6 py-4 font-medium">{category.name}</td>
                  <td className="px-6 py-4">{category.iconName || '-'}</td>
                  <td className="px-6 py-4">{category.toolCount || 0}</td>
                  <td className="px-6 py-4">
                    {category.tools && category.tools.length > 0 ? (
                      <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded">
                        {category.tools.length} tool(s)
                      </span>
                    ) : (
                      <span className="text-soft-grey">-</span>
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CategoriesManager;

