import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { categoryService } from '../../../api/categoryService';
import { Plus, Edit, Trash2, Search, Power, LayoutGrid, List, Layers, Loader } from 'lucide-react';

const CategoriesIndex = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [viewType, setViewType] = useState('table');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 20;

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCategories(currentPage);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, currentPage]);

  const fetchCategories = async (page = 1) => {
    setLoading(true);
    try {
      if (searchTerm) {
        const response = await categoryService.getAll({ limit: 0 });
        const allCats = response.data?.categories || Array.isArray(response.data) ? response.data : (response.categories || response);
        const catList = Array.isArray(allCats) ? allCats.map(item => ({ ...item, id: item._id })) : [];
        const filtered = catList.filter(cat =>
          cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cat.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setTotalCount(filtered.length);
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
        const paginatedFiltered = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);
        setCategories(paginatedFiltered);
      } else {
        const response = await categoryService.getAll({ page: page, limit: itemsPerPage });
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

  const handleToggleEnabled = async (category) => {
    try {
      await categoryService.update(category.id, { enabled: !category.enabled });
      fetchCategories(currentPage);
    } catch (error) {
      console.error('Error toggling category:', error);
      alert('Error updating category: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await categoryService.delete(id);
        fetchCategories(currentPage);
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Error deleting category: ' + error.message);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Categories Manager</h1>
          <p className="text-soft-grey mt-1">Total Categories: {totalCount}</p>
        </div>
        <Link
          to="/admin/categories/add"
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Category
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-soft-grey" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search all categories..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white placeholder-soft-grey"
          />
        </div>
        <div className="flex gap-2">
          <button onClick={() => setViewType('table')} className={`p-2 rounded-lg transition-colors ${viewType === 'table' ? 'bg-primary text-white' : 'bg-white/5 text-soft-grey hover:bg-white/10 hover:text-white'}`}><List className="w-5 h-5" /></button>
          <button onClick={() => setViewType('grid')} className={`p-2 rounded-lg transition-colors ${viewType === 'grid' ? 'bg-primary text-white' : 'bg-white/5 text-soft-grey hover:bg-white/10 hover:text-white'}`}><LayoutGrid className="w-5 h-5" /></button>
          <button onClick={() => setViewType('tile')} className={`p-2 rounded-lg transition-colors ${viewType === 'tile' ? 'bg-primary text-white' : 'bg-white/5 text-soft-grey hover:bg-white/10 hover:text-white'}`}><Layers className="w-5 h-5" /></button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><Loader className="w-8 h-8 text-primary animate-spin" /></div>
      ) : (
        <>
          {viewType === 'table' && (
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr><th className="px-6 py-4 text-left text-sm font-semibold">Icon & Name</th><th className="px-6 py-4 text-left text-sm font-semibold">ID</th><th className="px-6 py-4 text-left text-sm font-semibold">Tool Count</th><th className="px-6 py-4 text-left text-sm font-semibold">Status</th><th className="px-6 py-4 text-left text-sm font-semibold">Description</th><th className="px-6 py-4 text-left text-sm font-semibold">Actions</th></tr>
                  </thead>
                  <tbody>
                    {categories.map((category) => (
                      <tr key={category.id} className="border-t border-white/10 hover:bg-white/5">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden shrink-0">
                            {category.iconName ? (category.iconName.startsWith('http') ? <img src={category.iconName} alt={category.name} className="w-full h-full object-cover" /> : <span className="text-lg">{category.iconName}</span>) : '-'}
                          </div>
                          <span className="font-medium">{category.name}</span>
                        </td>
                        <td className="px-6 py-4 text-xs text-soft-grey font-mono">{category.id}</td>
                        <td className="px-6 py-4">{category.tools?.length > 0 ? <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded">{category.tools.length} tool(s)</span> : <span className="text-soft-grey">{category.toolCount || 0}</span>}</td>
                        <td className="px-6 py-4">
                          <button onClick={() => handleToggleEnabled(category)} className={`flex items-center gap-2 px-3 py-1 rounded text-xs font-medium transition-colors ${category.enabled !== false ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'}`}>
                            <Power className={`w-3 h-3 ${category.enabled !== false ? '' : 'opacity-50'}`} />{category.enabled !== false ? 'Enabled' : 'Disabled'}
                          </button>
                        </td>
                        <td className="px-6 py-4 text-soft-grey max-w-xs truncate">{category.description || '-'}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button onClick={() => navigate(`/admin/categories/edit/${category.id}`)} className="p-2 hover:bg-white/10 rounded transition-colors"><Edit className="w-4 h-4 text-primary" /></button>
                            <button onClick={() => handleDelete(category.id)} className="p-2 hover:bg-white/10 rounded transition-colors"><Trash2 className="w-4 h-4 text-red-400" /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {categories.length === 0 && <tr><td colSpan="6" className="text-center py-8 text-soft-grey">No categories found.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Grid and Tile Views truncated for brevity to match Table Actions */}
        </>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8 bg-white/5 py-3 px-6 rounded-xl border border-white/10 inline-flex mx-auto">
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors">Previous</button>
          <div className="text-sm font-medium text-white">Page <span className="text-primary">{currentPage}</span> of {totalPages}</div>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors">Next</button>
        </div>
      )}
    </div>
  );
};

export default CategoriesIndex;
