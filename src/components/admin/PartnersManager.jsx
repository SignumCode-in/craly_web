import { useState, useEffect } from 'react';
import { partnerService } from '../../api/partnerService';
import { Plus, Edit, Trash2, X, Save, Search, Power } from 'lucide-react';

const PartnersManager = () => {
    const [partners, setPartners] = useState([]);
    const [filteredPartners, setFilteredPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingPartner, setEditingPartner] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        contactPerson: '',
        email: '',
        phone: '',
        status: 'active'
    });

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingPartner) {
                await partnerService.update(editingPartner._id, formData);
            } else {
                await partnerService.create(formData);
            }

            resetForm();
            fetchPartners();
        } catch (error) {
            console.error('Error saving partner:', error);
            alert('Error saving partner: ' + error.message);
        }
    };

    const handleEdit = (partner) => {
        setEditingPartner(partner);
        setFormData({
            name: partner.name,
            contactPerson: partner.contactPerson || '',
            email: partner.email,
            phone: partner.phone || '',
            status: partner.status || 'active'
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this partner?')) {
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
    }

    const resetForm = () => {
        setFormData({
            name: '',
            contactPerson: '',
            email: '',
            phone: '',
            status: 'active'
        });
        setEditingPartner(null);
        setShowForm(false);
    };

    if (loading) {
        return <div className="text-white">Loading...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Partners Manager</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add Partner
                </button>
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

            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-dark border border-white/10 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">{editingPartner ? 'Edit Partner' : 'Add New Partner'}</h2>
                            <button onClick={resetForm} className="text-soft-grey hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Company Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Contact Person</label>
                                <input
                                    type="text"
                                    value={formData.contactPerson}
                                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Email *</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Phone</label>
                                <input
                                    type="text"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="status"
                                    checked={formData.status === 'active'}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 'active' : 'inactive' })}
                                    className="w-4 h-4"
                                />
                                <label htmlFor="status" className="text-sm font-medium">Active Partner</label>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
                                >
                                    <Save className="w-5 h-5" />
                                    {editingPartner ? 'Update' : 'Create'}
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
                                                onClick={() => handleEdit(partner)}
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
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PartnersManager;
