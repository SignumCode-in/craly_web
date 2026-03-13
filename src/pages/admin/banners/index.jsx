import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { bannerService } from '../../../api/bannerService';
import { Plus, Edit, Trash2, Search, Power, Image as ImageIcon, Loader } from 'lucide-react';

const BannersIndex = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);
  const [filteredBanners, setFilteredBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const data = await bannerService.getAll();
      setBanners(data);
      setFilteredBanners(data);
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      const filtered = banners.filter(banner =>
        banner.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        banner.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredBanners(filtered);
    } else {
      setFilteredBanners(banners);
    }
  }, [searchTerm, banners]);

  const handleToggleEnabled = async (banner) => {
    try {
      await bannerService.update(banner.id || banner.documentId, {
        enabled: !banner.enabled
      });
      fetchBanners();
    } catch (error) {
      console.error('Error toggling banner:', error);
      alert('Error updating banner: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        await bannerService.delete(id);
        fetchBanners();
      } catch (error) {
        console.error('Error deleting banner:', error);
        alert('Error deleting banner: ' + error.message);
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center p-12"><Loader className="w-8 h-8 text-primary animate-spin" /></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Banner Manager</h1>
        <Link
          to="/admin/banners/add"
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Banner
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-soft-grey" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search banners..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white placeholder-soft-grey"
          />
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Image</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Title</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Position</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Order</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBanners.map((banner) => (
                <tr key={banner.id || banner.documentId} className="border-t border-white/10 hover:bg-white/5">
                  <td className="px-6 py-4">
                    {banner.imageUrl ? (
                      <img
                        src={banner.imageUrl}
                        alt={banner.title}
                        className="w-20 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-20 h-12 bg-white/5 rounded flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-soft-grey" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 font-medium">{banner.title}</td>
                  <td className="px-6 py-4">{banner.position || 'top'}</td>
                  <td className="px-6 py-4">{banner.order || 0}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleEnabled(banner)}
                      className={`flex items-center gap-2 px-3 py-1 rounded text-xs font-medium transition-colors ${banner.enabled !== false
                          ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                          : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        }`}
                    >
                      <Power className={`w-3 h-3 ${banner.enabled !== false ? '' : 'opacity-50'}`} />
                      {banner.enabled !== false ? 'Enabled' : 'Disabled'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/admin/banners/edit/${banner.id || banner.documentId}`)}
                        className="p-2 hover:bg-white/10 rounded transition-colors"
                      >
                        <Edit className="w-4 h-4 text-primary" />
                      </button>
                      <button
                        onClick={() => handleDelete(banner.id || banner.documentId)}
                        className="p-2 hover:bg-white/10 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredBanners.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-soft-grey">No banners found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BannersIndex;
