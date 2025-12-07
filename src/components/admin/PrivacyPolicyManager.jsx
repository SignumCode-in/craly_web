import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Save } from 'lucide-react';
import SimpleTextEditor from './SimpleTextEditor';

const PrivacyPolicyManager = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPrivacyPolicy();
  }, []);

  const fetchPrivacyPolicy = async () => {
    try {
      const docRef = doc(db, 'settings', 'privacyPolicy');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setContent(docSnap.data().content || '');
      }
    } catch (error) {
      console.error('Error fetching privacy policy:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'privacyPolicy'), {
        content,
        updatedAt: new Date().toISOString()
      });
      alert('Privacy Policy saved successfully!');
    } catch (error) {
      console.error('Error saving privacy policy:', error);
      alert('Error saving privacy policy: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Privacy Policy Manager</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <label className="block text-sm font-medium mb-4">Privacy Policy Content</label>
        <SimpleTextEditor
          value={content}
          onChange={setContent}
          placeholder="Enter privacy policy content..."
        />
      </div>
    </div>
  );
};

export default PrivacyPolicyManager;

