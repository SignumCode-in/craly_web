import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { promotionService } from '../../../api/promotionService';
import { Plus, Edit, Trash2, Search, Power, Loader } from 'lucide-react';

const PromotionsIndex = () => {
  const navigate = useNavigate();
  const [promotions, setPromotions] = useState([]);
  const [filteredPromotions, setFilteredPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const resp = await promotionService.getAll();
      setPromotions(resp || []);
      setFilteredPromotions(resp || []);
    } catch (error) {
      console.error('Error fetching promotions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      const filtered = promotions.filter(p =>
        (p.partnerId?.name && p.partnerId.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (p.toolId?.name && p.toolId.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredPromotions(filtered);
    } else {
      setFilteredPromotions(promotions);
    }
  }, [searchTerm, promotions]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this promotion?')) {
      try {
        await promotionService.delete(id);
        fetchPromotions();
      } catch (error) {
        console.error('Error deleting promotion:', error);
        alert('Error deleting promotion: ' + error.message);
      }
    }
  };

  const handleToggleStatus = async (promotion) => {
    try {
      await promotionService.update(promotion._id, { isActive: !promotion.isActive });
      fetchPromotions();
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Error updating promotion: ' + error.message);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-12"><Loader className="w-8 h-8 text-primary animate-spin" /></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Promotions Manager</h1>
        <Link
          to="/admin/promotions/add"
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Promotion
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-soft-grey" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by partner or tool..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white placeholder-soft-grey"
          />
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Partner</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Tool</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Placement</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Dates</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Priority</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPromotions.map((promo) => (
                <tr key={promo._id} className="border-t border-white/10 hover:bg-white/5">
                  <td className="px-6 py-4 font-medium">{promo.partnerId?.name || '-'}</td>
                  <td className="px-6 py-4">{promo.toolId?.name || '-'}</td>
                  <td className="px-6 py-4 capitalize">{promo.placementType?.replace('_', ' ')}</td>
                  <td className="px-6 py-4 text-sm text-soft-grey">
                    {new Date(promo.startDate).toLocaleDateString()} - <br />
                    {new Date(promo.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">{promo.priority}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleStatus(promo)}
                      className={`flex items-center gap-2 px-3 py-1 rounded text-xs font-medium transition-colors ${promo.isActive
                          ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                          : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        }`}
                    >
                      <Power className={`w-3 h-3 ${promo.isActive ? '' : 'opacity-50'}`} />
                      {promo.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/admin/promotions/edit/${promo._id}`)}
                        className="p-2 hover:bg-white/10 rounded transition-colors"
                      >
                        <Edit className="w-4 h-4 text-primary" />
                      </button>
                      <button
                        onClick={() => handleDelete(promo._id)}
                        className="p-2 hover:bg-white/10 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPromotions.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-soft-grey">No promotions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PromotionsIndex;
