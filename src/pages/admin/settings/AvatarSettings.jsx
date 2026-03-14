import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Check, X, Loader, Upload } from 'lucide-react';
import { settingsService } from '../../../api/settingsService';

const AvatarSettings = () => {
  const [avatars, setAvatars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newAvatar, setNewAvatar] = useState({ name: '', imageUrl: '', isEnabled: true });
  const [editingAvatar, setEditingAvatar] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAvatars();
  }, []);

  const fetchAvatars = async () => {
    try {
      setLoading(true);
      const response = await settingsService.getAvatars();
      setAvatars(response || []);
    } catch (error) {
      console.error('Error fetching avatars:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newAvatar.name || !newAvatar.imageUrl) {
      alert('Please provide both name and image URL');
      return;
    }

    try {
      setSaving(true);
      const res = await settingsService.createAvatar(newAvatar);
      if (res) {
        setAvatars([res, ...avatars]);
        setIsAdding(false);
        setNewAvatar({ name: '', imageUrl: '', isEnabled: true });
      }
    } catch (error) {
      console.error('Error adding avatar:', error);
      alert('Failed to add avatar');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingAvatar.name || !editingAvatar.imageUrl) {
      alert('Please provide both name and image URL');
      return;
    }

    try {
      setSaving(true);
      const id = editingAvatar._id || editingAvatar.id;
      const res = await settingsService.updateAvatar(id, editingAvatar);
      if (res) {
        setAvatars(avatars.map(av => (av._id === id || av.id === id) ? res : av));
        setEditingAvatar(null);
      }
    } catch (error) {
      console.error('Error updating avatar:', error);
      alert('Failed to update avatar');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = async (avatar) => {
    try {
      const id = avatar._id || avatar.id;
      const updatedAvatar = { ...avatar, isEnabled: !avatar.isEnabled };
      const res = await settingsService.updateAvatar(id, updatedAvatar);
      if (res) {
        setAvatars(avatars.map(av => (av._id === id || av.id === id) ? res : av));
      }
    } catch (error) {
      console.error('Error toggling avatar:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this avatar?')) {
      try {
        await settingsService.deleteAvatar(id);
        setAvatars(avatars.filter(av => (av._id !== id && av.id !== id)));
      } catch (error) {
        console.error('Error deleting avatar:', error);
        alert('Failed to delete avatar');
      }
    }
  };

  if (loading) return <div className="flex justify-center p-8"><Loader className="animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Avatar Management</h2>
          <p className="text-sm text-soft-grey">Manage avatars used across the platform</p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Avatar
          </button>
        )}
      </div>

      {(isAdding || editingAvatar) && (
        <div className="bg-white/5 border border-primary/30 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-medium text-white">{editingAvatar ? 'Edit Avatar' : 'Add New Avatar'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-soft-grey">Avatar Name</label>
              <input
                type="text"
                value={editingAvatar ? editingAvatar.name : newAvatar.name}
                onChange={(e) => editingAvatar
                  ? setEditingAvatar({ ...editingAvatar, name: e.target.value })
                  : setNewAvatar({ ...newAvatar, name: e.target.value })
                }
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white"
                placeholder="Enter name..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-soft-grey">Avatar Image URL</label>
              <input
                type="text"
                value={editingAvatar ? editingAvatar.imageUrl : newAvatar.imageUrl}
                onChange={(e) => editingAvatar
                  ? setEditingAvatar({ ...editingAvatar, imageUrl: e.target.value })
                  : setNewAvatar({ ...newAvatar, imageUrl: e.target.value })
                }
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white"
                placeholder="https://example.com/image.png"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => editingAvatar ? setEditingAvatar(null) : setIsAdding(false)}
              className="px-4 py-2 text-soft-grey hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={editingAvatar ? handleUpdate : handleAdd}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {editingAvatar ? 'Update Avatar' : 'Save Avatar'}
            </button>
          </div>
        </div>
      )}

      {avatars.length === 0 ? (
        <div className="text-center py-12 bg-white/5 border border-dashed border-white/10 rounded-2xl">
          <p className="text-soft-grey">No avatars found. Add your first one above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {avatars.map((avatar) => (
            <div key={avatar.id} className="bg-white/5 border border-white/10 rounded-xl p-4 group transition-all hover:border-primary/30">
              <div className="relative aspect-square rounded-lg bg-black/20 mb-4 overflow-hidden border border-white/5">
                <img src={avatar.imageUrl} alt={avatar.name} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${avatar.isEnabled ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {avatar.isEnabled ? 'Active' : 'Disabled'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-white truncate">{avatar.name}</h3>
                <div className="flex gap-1">
                  <button onClick={() => setEditingAvatar(avatar)} className="p-1.5 hover:bg-primary/10 rounded-lg text-soft-grey hover:text-primary transition-colors" title="Edit">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleToggle(avatar)} className="p-1.5 hover:bg-primary/10 rounded-lg text-soft-grey hover:text-primary transition-colors" title={avatar.isEnabled ? 'Disable' : 'Enable'}>
                    {avatar.isEnabled ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                  </button>
                  <button onClick={() => handleDelete(avatar._id || avatar.id)} className="p-1.5 hover:bg-red-500/10 rounded-lg text-soft-grey hover:text-red-400 transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvatarSettings;
