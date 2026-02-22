import { useState, useEffect } from 'react';
import { promotionService } from '../../api/promotionService';
import { partnerService } from '../../api/partnerService';
import { toolService } from '../../api/toolService';
import { Plus, Edit, Trash2, X, Save, Search, Power } from 'lucide-react';
import SearchableSelect from './SearchableSelect';
import MultiTagInput from './MultiTagInput';
import MultiSelectDropdown from './MultiSelectDropdown';
import { tagService } from '../../api/tagService';
import { categoryService } from '../../api/categoryService';
import { COUNTRIES, formatCategoriesForSelect } from '../../utils/constants';

const PromotionsManager = () => {
    const [promotions, setPromotions] = useState([]);
    const [filteredPromotions, setFilteredPromotions] = useState([]);
    const [partners, setPartners] = useState([]);
    const [tools, setTools] = useState([]);
    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingPromotion, setEditingPromotion] = useState(null);

    const [formData, setFormData] = useState({
        partnerId: '',
        toolId: '',
        placementType: 'homepage',
        startDate: '',
        endDate: '',
        priority: 0,
        isActive: true,
        targetCategories: [],
        targetTags: [],
        targetCountries: [],
        impressions: 0,
        clicks: 0,
        amountPaid: 0,
        currency: 'INR',
        bannerImageUrl: '',
        customHeadline: '',
        showSponsoredLabel: true
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [promoRes, partnerRes, toolRes, catRes] = await Promise.all([
                promotionService.getAll(),
                partnerService.getAll(),
                toolService.getAll({ limit: 0 }),
                categoryService.getAll()
            ]);
            setPromotions(promoRes || []);
            setFilteredPromotions(promoRes || []);
            setPartners(partnerRes || []);
            setTools(toolRes || []);
            setCategories(catRes || []);
        } catch (error) {
            console.error('Error fetching data:', error);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
            };

            if (editingPromotion) {
                await promotionService.update(editingPromotion._id, payload);
            } else {
                await promotionService.create(payload);
            }

            resetForm();
            fetchData(); // refresh promotions
        } catch (error) {
            console.error('Error saving promotion:', error);
            alert('Error saving promotion: ' + error.message);
        }
    };

    const handleEdit = (promotion) => {
        setEditingPromotion(promotion);
        setFormData({
            partnerId: promotion.partnerId?._id || '',
            toolId: promotion.toolId?._id || promotion.toolId?.id || '',
            placementType: promotion.placementType || 'homepage',
            startDate: promotion.startDate ? new Date(promotion.startDate).toISOString().split('T')[0] : '',
            endDate: promotion.endDate ? new Date(promotion.endDate).toISOString().split('T')[0] : '',
            priority: promotion.priority || 0,
            isActive: promotion.isActive !== undefined ? promotion.isActive : true,
            targetCategories: promotion.targetCategories || [],
            targetTags: promotion.targetTags || [],
            targetCountries: promotion.targetCountries || [],
            impressions: promotion.impressions || 0,
            clicks: promotion.clicks || 0,
            amountPaid: promotion.amountPaid || 0,
            currency: promotion.currency || 'INR',
            bannerImageUrl: promotion.bannerImageUrl || '',
            customHeadline: promotion.customHeadline || '',
            showSponsoredLabel: promotion.showSponsoredLabel !== undefined ? promotion.showSponsoredLabel : true
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this promotion?')) {
            try {
                await promotionService.delete(id);
                fetchData();
            } catch (error) {
                console.error('Error deleting promotion:', error);
                alert('Error deleting promotion: ' + error.message);
            }
        }
    };

    const handleToggleStatus = async (promotion) => {
        try {
            await promotionService.update(promotion._id, { isActive: !promotion.isActive });
            fetchData();
        } catch (error) {
            console.error('Error toggling status:', error);
            alert('Error updating promotion: ' + error.message);
        }
    }

    const resetForm = () => {
        setFormData({
            partnerId: '',
            toolId: '',
            placementType: 'homepage',
            startDate: '',
            endDate: '',
            priority: 0,
            isActive: true,
            targetCategories: [],
            targetTags: [],
            targetCountries: [],
            impressions: 0,
            clicks: 0,
            amountPaid: 0,
            currency: 'INR',
            bannerImageUrl: '',
            customHeadline: '',
            showSponsoredLabel: true
        });
        setEditingPromotion(null);
        setShowForm(false);
    };

    if (loading) {
        return <div className="text-white">Loading...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Promotions Manager</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add Promotion
                </button>
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

            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-dark border border-white/10 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">{editingPromotion ? 'Edit Promotion' : 'Add New Promotion'}</h2>
                            <button onClick={resetForm} className="text-soft-grey hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Partner *</label>
                                    <SearchableSelect
                                        options={[
                                            { value: '', label: 'Select Partner' },
                                            ...partners.map(p => ({ value: p._id, label: p.name }))
                                        ]}
                                        value={formData.partnerId}
                                        onChange={(value) => setFormData({ ...formData, partnerId: value })}
                                        placeholder="Select Partner"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Tool *</label>
                                    <SearchableSelect
                                        options={[
                                            { value: '', label: 'Select Tool' },
                                            ...tools.map(t => ({ value: (t._id || t.id), label: t.name }))
                                        ]}
                                        value={formData.toolId}
                                        onChange={(value) => setFormData({ ...formData, toolId: value })}
                                        placeholder="Select Tool"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Placement Type *</label>
                                <select
                                    value={formData.placementType}
                                    onChange={(e) => setFormData({ ...formData, placementType: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white"
                                    required
                                >
                                    <option value="homepage">Homepage</option>
                                    <option value="category_top">Category Top</option>
                                    <option value="banner">Banner</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Start Date *</label>
                                    <input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">End Date *</label>
                                    <input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Priority (higher = first)</label>
                                <input
                                    type="number"
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="isActive"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                <label htmlFor="isActive" className="text-sm font-medium">Active Campaign</label>
                            </div>

                            {/* New Fields Sections */}
                            <div className="border-t border-white/10 pt-4 mt-4">
                                <h3 className="text-lg font-semibold mb-4 text-primary">Targeting</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Categories</label>
                                        <MultiSelectDropdown
                                            options={formatCategoriesForSelect(categories)}
                                            value={formData.targetCategories}
                                            onChange={(val) => setFormData({ ...formData, targetCategories: val })}
                                            placeholder="Select categories"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Tags (Type # to search)</label>
                                        <MultiTagInput
                                            value={formData.targetTags}
                                            onChange={(val) => setFormData({ ...formData, targetTags: val })}
                                            fetchSuggestions={async (q) => {
                                                const tags = await tagService.getAll(q);
                                                return tags.map(t => ({ label: t.name, value: t.name }));
                                            }}
                                            onCreateNew={async (newTagName) => {
                                                return await tagService.create(newTagName);
                                            }}
                                            placeholder="Add tags..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Countries</label>
                                        <MultiSelectDropdown
                                            options={COUNTRIES}
                                            value={formData.targetCountries}
                                            onChange={(val) => setFormData({ ...formData, targetCountries: val })}
                                            placeholder="Select countries"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-4 mt-4">
                                <h3 className="text-lg font-semibold mb-4 text-primary">Analytics & Payment</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Impressions</label>
                                        <input
                                            type="number"
                                            value={formData.impressions}
                                            onChange={(e) => setFormData({ ...formData, impressions: e.target.value })}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Clicks</label>
                                        <input
                                            type="number"
                                            value={formData.clicks}
                                            onChange={(e) => setFormData({ ...formData, clicks: e.target.value })}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Amount Paid</label>
                                        <input
                                            type="number"
                                            value={formData.amountPaid}
                                            onChange={(e) => setFormData({ ...formData, amountPaid: e.target.value })}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Currency</label>
                                        <input
                                            type="text"
                                            value={formData.currency}
                                            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-white/10 pt-4 mt-4">
                                <h3 className="text-lg font-semibold mb-4 text-primary">Visuals</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Banner Image URL</label>
                                        <input
                                            type="url"
                                            value={formData.bannerImageUrl}
                                            onChange={(e) => setFormData({ ...formData, bannerImageUrl: e.target.value })}
                                            placeholder="https://..."
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Custom Headline</label>
                                        <input
                                            type="text"
                                            value={formData.customHeadline}
                                            onChange={(e) => setFormData({ ...formData, customHeadline: e.target.value })}
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="showSponsoredLabel"
                                            checked={formData.showSponsoredLabel}
                                            onChange={(e) => setFormData({ ...formData, showSponsoredLabel: e.target.checked })}
                                            className="w-4 h-4"
                                        />
                                        <label htmlFor="showSponsoredLabel" className="text-sm font-medium">Show "Sponsored" Label</label>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4 mt-6 border-t border-white/10">
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
                                >
                                    <Save className="w-5 h-5" />
                                    {editingPromotion ? 'Update' : 'Create'}
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
                                                onClick={() => handleEdit(promo)}
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
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PromotionsManager;
