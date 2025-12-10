import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../firebase/config';
import { Plus, Edit, Trash2, X, Save, Search, Power, Image as ImageIcon, Upload as UploadIcon } from 'lucide-react';

const BannerManager = () => {
  const [banners, setBanners] = useState([]);
  const [filteredBanners, setFilteredBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingBanner, setEditingBanner] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    link: '',
    linkText: '',
    position: 'top',
    enabled: true,
    order: 0
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const q = query(collection(db, 'banners'), orderBy('order'));
      const snapshot = await getDocs(q);
      const bannersData = snapshot.docs.map(docSnapshot => ({
        id: docSnapshot.id,
        documentId: docSnapshot.id,
        ...docSnapshot.data()
      }));
      setBanners(bannersData);
      setFilteredBanners(bannersData);
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

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async () => {
    if (!imageFile) return null;

    try {
      setUploadingImage(true);
      const imageRef = ref(storage, `banners/${Date.now()}_${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      const downloadURL = await getDownloadURL(imageRef);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = formData.imageUrl;

      // Upload new image if selected
      if (imageFile) {
        imageUrl = await uploadImage();
      }

      const bannerData = {
        ...formData,
        imageUrl,
        order: parseInt(formData.order) || 0,
        updatedAt: serverTimestamp()
      };

      if (editingBanner) {
        const documentId = editingBanner.documentId || editingBanner.id;
        await updateDoc(doc(db, 'banners', documentId), bannerData);
      } else {
        bannerData.createdAt = serverTimestamp();
        await addDoc(collection(db, 'banners'), bannerData);
      }

      resetForm();
      fetchBanners();
    } catch (error) {
      console.error('Error saving banner:', error);
      alert('Error saving banner: ' + error.message);
    }
  };

  const handleEdit = (banner) => {
    const documentId = banner.documentId || banner.id;
    setEditingBanner({ ...banner, documentId, id: documentId });
    setFormData({
      title: banner.title || '',
      description: banner.description || '',
      imageUrl: banner.imageUrl || '',
      link: banner.link || '',
      linkText: banner.linkText || '',
      position: banner.position || 'top',
      enabled: banner.enabled !== undefined ? banner.enabled : true,
      order: banner.order || 0
    });
    setImagePreview(banner.imageUrl || '');
    setImageFile(null);
    setShowForm(true);
  };

  const handleToggleEnabled = async (banner) => {
    try {
      const documentId = banner.documentId || banner.id;
      await updateDoc(doc(db, 'banners', documentId), {
        enabled: !banner.enabled,
        updatedAt: serverTimestamp()
      });
      fetchBanners();
    } catch (error) {
      console.error('Error toggling banner:', error);
      alert('Error updating banner: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this banner?')) {
      try {
        await deleteDoc(doc(db, 'banners', id));
        fetchBanners();
      } catch (error) {
        console.error('Error deleting banner:', error);
        alert('Error deleting banner: ' + error.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      link: '',
      linkText: '',
      position: 'top',
      enabled: true,
      order: 0
    });
    setEditingBanner(null);
    setImageFile(null);
    setImagePreview('');
    setShowForm(false);
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Banner Manager</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Banner
        </button>
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

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark border border-white/10 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{editingBanner ? 'Edit Banner' : 'Add New Banner'}</h2>
              <button onClick={resetForm} className="text-soft-grey hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
                  required
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

              <div>
                <label className="block text-sm font-medium mb-2">Banner Image *</label>
                <div className="space-y-3">
                  {imagePreview && (
                    <div className="relative w-full h-48 bg-white/5 rounded-lg overflow-hidden border border-white/10">
                      <img
                        src={imagePreview}
                        alt="Banner preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 cursor-pointer transition-colors">
                      <UploadIcon className="w-5 h-5" />
                      <span>Upload Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </label>
                    {!imageFile && formData.imageUrl && (
                      <span className="text-sm text-soft-grey">Or enter URL below</span>
                    )}
                  </div>
                  {!imageFile && (
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => {
                        setFormData({ ...formData, imageUrl: e.target.value });
                        setImagePreview(e.target.value);
                      }}
                      placeholder="https://example.com/banner.jpg"
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Link URL</label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Link Text</label>
                  <input
                    type="text"
                    value={formData.linkText}
                    onChange={(e) => setFormData({ ...formData, linkText: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
                    placeholder="Learn More"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Position</label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
                  >
                    <option value="top">Top</option>
                    <option value="middle">Middle</option>
                    <option value="bottom">Bottom</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Order</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
                    placeholder="0"
                  />
                </div>
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
                  disabled={uploadingImage}
                  className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-5 h-5" />
                  {uploadingImage ? 'Uploading...' : editingBanner ? 'Update' : 'Create'}
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
                <tr key={banner.id} className="border-t border-white/10 hover:bg-white/5">
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
                      className={`flex items-center gap-2 px-3 py-1 rounded text-xs font-medium transition-colors ${
                        banner.enabled !== false
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
                        onClick={() => handleEdit(banner)}
                        className="p-2 hover:bg-white/10 rounded transition-colors"
                      >
                        <Edit className="w-4 h-4 text-primary" />
                      </button>
                      <button
                        onClick={() => handleDelete(banner.id)}
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

export default BannerManager;
