import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Plus, Edit, Trash2, X, Save, Search, Power } from 'lucide-react';

const CategoriesManager = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    iconName: '',
    toolCount: 0,
    description: '',
    enabled: true
  });

  useEffect(() => {
    fetchCategories();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const categoryData = {
        ...formData,
        toolCount: parseInt(formData.toolCount) || 0
      };

      if (editingCategory) {
        await updateDoc(doc(db, 'categories', editingCategory.id), categoryData);
      } else {
        await addDoc(collection(db, 'categories'), categoryData);
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
      ...category,
      enabled: category.enabled !== undefined ? category.enabled : true
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
      name: '',
      iconName: '',
      toolCount: 0,
      description: '',
      enabled: true
    });
    setEditingCategory(null);
    setShowForm(false);
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
          <div className="bg-dark border border-white/10 rounded-xl p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
              <button onClick={resetForm} className="text-soft-grey hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                <label className="block text-sm font-medium mb-2">Icon Name</label>
                <input
                  type="text"
                  value={formData.iconName}
                  onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
                  placeholder="e.g., folder, tag, star"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tool Count</label>
                <input
                  type="number"
                  value={formData.toolCount}
                  onChange={(e) => setFormData({ ...formData, toolCount: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
                  rows="3"
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

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Icon</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Tool Count</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Description</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.map((category) => (
                <tr key={category.id} className="border-t border-white/10 hover:bg-white/5">
                  <td className="px-6 py-4 font-medium">{category.name}</td>
                  <td className="px-6 py-4">{category.iconName || '-'}</td>
                  <td className="px-6 py-4">{category.toolCount || 0}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleEnabled(category)}
                      className={`flex items-center gap-2 px-3 py-1 rounded text-xs font-medium transition-colors ${
                        category.enabled !== false
                          ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                          : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                      }`}
                    >
                      <Power className={`w-3 h-3 ${category.enabled !== false ? '' : 'opacity-50'}`} />
                      {category.enabled !== false ? 'Enabled' : 'Disabled'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-soft-grey">{category.description || '-'}</td>
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

