import { useState, useEffect } from 'react';
import { Save, AlertCircle, Loader } from 'lucide-react';
import { settingsService } from '../../../api/settingsService';

const AppUpdateSettings = () => {
  const [config, setConfig] = useState({
    currentVersion: '',
    minSupportedVersion: '',
    forceUpdate: false,
    updateMessage: '',
    androidUrl: '',
    iosUrl: '',
    releaseNotes: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const response = await settingsService.getAppUpdate();
      if (response) {
        setConfig({
          currentVersion: response.currentVersion || '',
          minSupportedVersion: response.minSupportedVersion || '',
          forceUpdate: response.forceUpdate || false,
          updateMessage: response.updateMessage || '',
          androidUrl: response.androidUrl || '',
          iosUrl: response.iosUrl || '',
          releaseNotes: response.releaseNotes || ''
        });
      }
    } catch (error) {
      console.error('Error fetching app update config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await settingsService.updateAppUpdate(config);
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving app update settings:', error);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center p-8"><Loader className="animate-spin text-primary" /></div>;

  return (
    <div className="space-y-8 max-w-4xl pb-12">
      <div>
        <h2 className="text-xl font-bold text-white">App Version Control</h2>
        <p className="text-sm text-soft-grey">Configure versioning and update policies for mobile applications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-soft-grey">Current Version</label>
          <input 
            type="text" 
            value={config.currentVersion} 
            onChange={(e) => setConfig({...config, currentVersion: e.target.value})}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white"
            placeholder="e.g. 1.2.0"
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-soft-grey">Minimum Required Version</label>
          <input 
            type="text" 
            value={config.minSupportedVersion}
            onChange={(e) => setConfig({...config, minSupportedVersion: e.target.value})}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white"
            placeholder="e.g. 1.0.0"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-soft-grey">Android Store URL</label>
          <input 
            type="text" 
            value={config.androidUrl} 
            onChange={(e) => setConfig({...config, androidUrl: e.target.value})}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white"
            placeholder="https://play.google.com/..."
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-soft-grey">iOS Store URL</label>
          <input 
            type="text" 
            value={config.iosUrl}
            onChange={(e) => setConfig({...config, iosUrl: e.target.value})}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white"
            placeholder="https://apps.apple.com/..."
          />
        </div>
      </div>

      <div className="flex items-center gap-4 p-4 bg-primary/10 border border-primary/20 rounded-xl">
        <div className="p-2 bg-primary/20 rounded-lg text-primary">
          <AlertCircle className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-white">Force Update</h4>
          <p className="text-xs text-soft-grey">Require users to update if their version is below minimum</p>
        </div>
        <button 
          onClick={() => setConfig({...config, forceUpdate: !config.forceUpdate})}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all ${config.forceUpdate ? 'bg-primary' : 'bg-white/10'}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all ${config.forceUpdate ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-soft-grey">Update Message (shown to users)</label>
        <textarea 
          rows="2"
          value={config.updateMessage}
          onChange={(e) => setConfig({...config, updateMessage: e.target.value})}
          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white resize-none"
          placeholder="A new version is available!"
        />
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-soft-grey">Release Notes</label>
        <textarea 
          rows="4"
          value={config.releaseNotes}
          onChange={(e) => setConfig({...config, releaseNotes: e.target.value})}
          className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white resize-none"
          placeholder="New features, bug fixes..."
        />
      </div>

      <div className="pt-6 border-t border-white/10 flex justify-end">
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
        >
          {saving ? <Loader className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Save Update Settings
        </button>
      </div>
    </div>
  );
};

export default AppUpdateSettings;
