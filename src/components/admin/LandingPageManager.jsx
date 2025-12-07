import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Save } from 'lucide-react';

const LandingPageManager = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    heroHeadline: 'Discover AI. Build Anything.',
    heroSubheadline: 'All the AI tools you need — organized, categorized, and ready to use.',
    problemTitle: 'Why Craly?',
    problemText: 'AI is exploding with thousands of tools — but finding the right one is still confusing.',
    solutionTitle: 'Craly makes AI simple.',
    solutionText: 'Craly organizes the entire AI ecosystem into one clean, minimal interface.',
    downloadTitle: 'Get Craly on Your Phone',
    downloadText: 'Take your AI toolkit wherever you go. Download now and start building.'
  });

  useEffect(() => {
    fetchLandingData();
  }, []);

  const fetchLandingData = async () => {
    try {
      const docRef = doc(db, 'settings', 'landingPage');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setFormData({ ...formData, ...docSnap.data() });
      }
    } catch (error) {
      console.error('Error fetching landing page data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'landingPage'), {
        ...formData,
        updatedAt: new Date().toISOString()
      });
      alert('Landing page data saved successfully!');
    } catch (error) {
      console.error('Error saving landing page data:', error);
      alert('Error saving: ' + error.message);
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
        <h1 className="text-3xl font-bold">Landing Page Data Manager</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {saving ? 'Saving...' : 'Save All'}
        </button>
      </div>

      <div className="space-y-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Hero Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Headline</label>
              <input
                type="text"
                value={formData.heroHeadline}
                onChange={(e) => setFormData({ ...formData, heroHeadline: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Sub-headline</label>
              <textarea
                value={formData.heroSubheadline}
                onChange={(e) => setFormData({ ...formData, heroSubheadline: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
                rows="2"
              />
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Problem Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={formData.problemTitle}
                onChange={(e) => setFormData({ ...formData, problemTitle: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Text</label>
              <textarea
                value={formData.problemText}
                onChange={(e) => setFormData({ ...formData, problemText: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
                rows="3"
              />
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Solution Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={formData.solutionTitle}
                onChange={(e) => setFormData({ ...formData, solutionTitle: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Text</label>
              <textarea
                value={formData.solutionText}
                onChange={(e) => setFormData({ ...formData, solutionText: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
                rows="3"
              />
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Download Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={formData.downloadTitle}
                onChange={(e) => setFormData({ ...formData, downloadTitle: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Text</label>
              <textarea
                value={formData.downloadText}
                onChange={(e) => setFormData({ ...formData, downloadText: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
                rows="3"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPageManager;

