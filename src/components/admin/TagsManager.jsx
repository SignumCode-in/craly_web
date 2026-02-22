import { useState, useEffect } from 'react';
import { tagService } from '../../api/tagService';
import { Plus, Edit, Trash2, X, Save, Search, Power } from 'lucide-react';

const TagsManager = () => {
    const [tags, setTags] = useState([]);
    const [filteredTags, setFilteredTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingTag, setEditingTag] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        logoUrl: '',
        isActive: true
    });

    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = async () => {
        try {
            const data = await tagService.getAll('', true);
            setTags(data);
            setFilteredTags(data);
        } catch (error) {
            console.error('Error fetching tags:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (searchTerm) {
            const filtered = tags.filter(tag =>
                tag.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredTags(filtered);
        } else {
            setFilteredTags(tags);
        }
    }, [searchTerm, tags]);


    const handleCreateOrUpdate = async (e) => {
        e.preventDefault();
        try {
            const tagData = {
                name: formData.name,
                logoUrl: formData.logoUrl,
                isActive: formData.isActive
            };

            if (editingTag) {
                await tagService.update(editingTag._id, tagData);
            } else {
                await tagService.create(tagData);
            }

            resetForm();
            fetchTags();
        } catch (error) {
            console.error('Error saving tag:', error);
            alert('Error saving tag: ' + error.message);
        }
    };

    const handleEdit = (tag) => {
        setEditingTag(tag);
        setFormData({
            name: tag.name,
            logoUrl: tag.logoUrl || '',
            isActive: tag.isActive !== undefined ? tag.isActive : true
        });
        setShowForm(true);
    };

    const handleToggleActive = async (tag) => {
        try {
            await tagService.update(tag._id, {
                isActive: !tag.isActive
            });
            fetchTags();
        } catch (error) {
            console.error('Error toggling tag:', error);
            alert('Error updating tag: ' + error.message);
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this tag?')) {
            try {
                await tagService.delete(id);
                fetchTags();
            } catch (error) {
                console.error('Error deleting tag:', error);
                alert('Error deleting tag: ' + error.message);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            logoUrl: '',
            isActive: true
        });
        setEditingTag(null);
        setShowForm(false);
    };

    if (loading) {
        return <div className="text-white">Loading...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Tags Manager</h1>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add Tag
                </button>
            </div>

            <div className="mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-soft-grey" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search tags..."
                        className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white placeholder-soft-grey"
                    />
                </div>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-dark border border-white/10 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">{editingTag ? 'Edit Tag' : 'Add New Tag'}</h2>
                            <button onClick={resetForm} className="text-soft-grey hover:text-white">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateOrUpdate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Name *</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Logo URL (Optional)</label>
                                <input
                                    type="url"
                                    value={formData.logoUrl}
                                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white"
                                    placeholder="https://example.com/logo.png"
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
                                <label htmlFor="isActive" className="text-sm font-medium">Active (Suggest in Tag Inputs)</label>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
                                >
                                    <Save className="w-5 h-5" />
                                    {editingTag ? 'Update' : 'Create'}
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
                                <th className="px-6 py-4 text-left text-sm font-semibold">Logo</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Usage Count</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTags.map((tag) => (
                                <tr key={tag._id} className="border-t border-white/10 hover:bg-white/5">
                                    <td className="px-6 py-4 font-medium">#{tag.name}</td>
                                    <td className="px-6 py-4">
                                        {tag.logoUrl ? (
                                            <img src={tag.logoUrl} alt={tag.name} className="w-6 h-6 object-contain" />
                                        ) : '-'}
                                    </td>
                                    <td className="px-6 py-4">{tag.usageCount || 0}</td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleToggleActive(tag)}
                                            className={`flex items-center gap-2 px-3 py-1 rounded text-xs font-medium transition-colors ${tag.isActive !== false
                                                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                                : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                                }`}
                                        >
                                            <Power className={`w-3 h-3 ${tag.isActive !== false ? '' : 'opacity-50'}`} />
                                            {tag.isActive !== false ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(tag)}
                                                className="p-2 hover:bg-white/10 rounded transition-colors"
                                            >
                                                <Edit className="w-4 h-4 text-primary" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(tag._id)}
                                                className="p-2 hover:bg-white/10 rounded transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-400" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredTags.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-soft-grey">No tags found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TagsManager;
