import { useState } from 'react';
import { Save, X } from 'lucide-react';
import MultiTagInput from '../MultiTagInput';

const UserForm = ({ initialData, onSubmit, onCancel, submitText, isEditing }) => {
  const [formData, setFormData] = useState(initialData || {
    displayName: '',
    email: '',
    photoUrl: '',
    heardFrom: 'organic',
    interests: []
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Display Name *</label>
        <input
          type="text"
          value={formData.displayName}
          onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white"
          required
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
        <label className="block text-sm font-medium mb-2">Photo URL</label>
        <input
          type="url"
          value={formData.photoUrl || ''}
          onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Heard From</label>
        <input
          type="text"
          value={formData.heardFrom || ''}
          onChange={(e) => setFormData({ ...formData, heardFrom: e.target.value })}
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white"
          placeholder="e.g. Google, Friend..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Interests (Type and enter)</label>
        <MultiTagInput
          value={formData.interests || []}
          onChange={(val) => setFormData({ ...formData, interests: val })}
          fetchSuggestions={async () => []} // No remote suggestions for user interests locally
          onCreateNew={async (newTag) => ({ label: newTag, value: newTag })}
          placeholder="Add interest..."
        />
      </div>

      <div className="flex gap-4 pt-4 mt-6 border-t border-white/10">
        <button
          type="submit"
          className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
        >
          <Save className="w-5 h-5" />
          {submitText || 'Save'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default UserForm;
