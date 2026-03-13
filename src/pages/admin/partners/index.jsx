import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { partnerService } from '../../../api/partnerService';
import { Plus, Edit, Trash2, Search, Power, Loader } from 'lucide-react';

const PartnersIndex = () => {
  const navigate = useNavigate();
  const [partners, setPartners] = useState([]);
  const [filteredPartners, setFilteredPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const resp = await partnerService.getAll();
      setPartners(resp || []);
      setFilteredPartners(resp || []);
    } catch (error) {
      console.error('Error fetching partners:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      const filtered = partners.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPartners(filtered);
    } else {
      setFilteredPartners(partners);
    }
  }, [searchTerm, partners]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this partner?')) {
      try {
        await partnerService.delete(id);
        fetchPartners();
      } catch (error) {
        console.error('Error deleting partner:', error);
        alert('Error deleting partner: ' + error.message);
      }
    }
  };

  const handleToggleStatus = async (partner) => {
    try {
      const newStatus = partner.status === 'active' ? 'inactive' : 'active';
      await partnerService.update(partner._id, { status: newStatus });
      fetchPartners();
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Error updating partner: ' + error.message);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-12"><Loader className="w-8 h-8 text-primary animate-spin" /></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Partners Manager</h1>
        <Link
          to="/admin/partners/add"
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Partner
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-soft-grey" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search partners..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white placeholder-soft-grey"
          />
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Contact Person</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPartners.map((partner) => (
                <tr key={partner._id} className="border-t border-white/10 hover:bg-white/5">
                  <td className="px-6 py-4 font-medium">{partner.name}</td>
                  <td className="px-6 py-4">{partner.contactPerson || '-'}</td>
                  <td className="px-6 py-4">{partner.email}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleStatus(partner)}
                      className={`flex items-center gap-2 px-3 py-1 rounded text-xs font-medium transition-colors ${partner.status === 'active'
                          ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                          : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        }`}
                    >
                      <Power className={`w-3 h-3 ${partner.status === 'active' ? '' : 'opacity-50'}`} />
                      {partner.status === 'active' ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/admin/partners/edit/${partner._id}`)}
                        className="p-2 hover:bg-white/10 rounded transition-colors"
                      >
                        <Edit className="w-4 h-4 text-primary" />
                      </button>
                      <button
                        onClick={() => handleDelete(partner._id)}
                        className="p-2 hover:bg-white/10 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPartners.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-soft-grey">No partners found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PartnersIndex;
