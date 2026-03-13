import { useState } from 'react';
import { Save, X } from 'lucide-react';

const PartnerForm = ({ initialData, onSubmit, onCancel, submitText, isEditing }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    status: 'active'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
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

export default PartnerForm;
