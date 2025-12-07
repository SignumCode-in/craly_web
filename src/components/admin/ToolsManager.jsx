import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Plus, Edit, Trash2, X, Save, Search, Power } from 'lucide-react';

const ToolsManager = () => {
  const [tools, setTools] = useState([]);
  const [filteredTools, setFilteredTools] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingTool, setEditingTool] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    shortDescription: '',
    longDescription: '',
    url: '',
    logoUrl: '',
    pricing: 'Freemium',
    tags: '',
    isTrending: false,
    enabled: true,
    likesCount: 0
  });

  useEffect(() => {
    fetchTools();
    fetchCategories();
  }, []);

  const fetchTools = async () => {
    try {
      const q = query(collection(db, 'tools'), orderBy('name'));
      const snapshot = await getDocs(q);
      const toolsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTools(toolsData);
      setFilteredTools(toolsData);
    } catch (error) {
      console.error('Error fetching tools:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      const filtered = tools.filter(tool =>
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTools(filtered);
    } else {
      setFilteredTools(tools);
    }
  }, [searchTerm, tools]);

  const fetchCategories = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'categories'));
      setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const toolData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        likesCount: parseInt(formData.likesCount) || 0
      };

      if (editingTool) {
        await updateDoc(doc(db, 'tools', editingTool.id), toolData);
      } else {
        await addDoc(collection(db, 'tools'), toolData);
      }

      resetForm();
      fetchTools();
    } catch (error) {
      console.error('Error saving tool:', error);
      alert('Error saving tool: ' + error.message);
    }
  };

  const handleEdit = (tool) => {
    setEditingTool(tool);
    setFormData({
      ...tool,
      enabled: tool.enabled !== undefined ? tool.enabled : true,
      tags: Array.isArray(tool.tags) ? tool.tags.join(', ') : tool.tags || ''
    });
    setShowForm(true);
  };

  const handleToggleEnabled = async (tool) => {
    try {
      await updateDoc(doc(db, 'tools', tool.id), {
        enabled: !tool.enabled
      });
      fetchTools();
    } catch (error) {
      console.error('Error toggling tool:', error);
      alert('Error updating tool: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this tool?')) {
      try {
        await deleteDoc(doc(db, 'tools', id));
        fetchTools();
      } catch (error) {
        console.error('Error deleting tool:', error);
        alert('Error deleting tool: ' + error.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      shortDescription: '',
      longDescription: '',
      url: '',
      logoUrl: '',
      pricing: 'Freemium',
      tags: '',
      isTrending: false,
      enabled: true,
      likesCount: 0
    });
    setEditingTool(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tools Manager</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Tool
        </button>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-soft-grey" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tools by name, category, or description..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white placeholder-soft-grey"
          />
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark border border-white/10 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{editingTool ? 'Edit Tool' : 'Add New Tool'}</h2>
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
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
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
                <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
                  placeholder="AI, Productivity, Writing"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                  {editingTool ? 'Update' : 'Create'}
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
                <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Pricing</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Trending</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTools.map((tool) => (
                <tr key={tool.id} className="border-t border-white/10 hover:bg-white/5">
                  <td className="px-6 py-4">{tool.name}</td>
                  <td className="px-6 py-4">{tool.category}</td>
                  <td className="px-6 py-4">{tool.pricing}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleEnabled(tool)}
                      className={`flex items-center gap-2 px-3 py-1 rounded text-xs font-medium transition-colors ${
                        tool.enabled !== false
                          ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                          : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                      }`}
                    >
                      <Power className={`w-3 h-3 ${tool.enabled !== false ? '' : 'opacity-50'}`} />
                      {tool.enabled !== false ? 'Enabled' : 'Disabled'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    {tool.isTrending ? (
                      <span className="px-2 py-1 bg-accent/20 text-accent rounded text-xs">Yes</span>
                    ) : (
                      <span className="text-soft-grey">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(tool)}
                        className="p-2 hover:bg-white/10 rounded transition-colors"
                      >
                        <Edit className="w-4 h-4 text-primary" />
                      </button>
                      <button
                        onClick={() => handleDelete(tool.id)}
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

export default ToolsManager;

