import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Check, X, Cpu, Loader, Power, Save } from 'lucide-react';
import { settingsService } from '../../../api/settingsService';

const ModelSettings = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newModel, setNewModel] = useState({ 
    name: '', 
    provider: '', 
    modelName: '', 
    apiKey: '', 
    systemInstruction: '', 
    maxTokens: 4096, 
    enabled: true, 
    isDefault: false 
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      setLoading(true);
      const response = await settingsService.getModels();
      setModels(response || []);
    } catch (error) {
      console.error('Error fetching models:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async (updatedList) => {
    try {
      setSaving(true);
      // Ensure only one model is default if updatedList contains a default
      const res = await settingsService.updateModels(updatedList);
      setModels(res || updatedList);
    } catch (error) {
      console.error('Error saving models:', error);
      alert('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const handleAdd = async () => {
    if (!newModel.name || !newModel.provider || !newModel.modelName) {
      alert('Please provide Name, Provider, and Model ID');
      return;
    }
    
    let updatedList = [...models];
    if (newModel.isDefault) {
      updatedList = updatedList.map(m => ({ ...m, isDefault: false }));
    }
    updatedList.push({ ...newModel, id: Date.now().toString() });
    
    await handleSaveAll(updatedList);
    setIsAdding(false);
    setNewModel({ 
      name: '', provider: '', modelName: '', apiKey: '', 
      systemInstruction: '', maxTokens: 4096, enabled: true, isDefault: false 
    });
  };

  const handleToggle = async (id) => {
    const updatedList = models.map(m => 
      m.id === id ? { ...m, enabled: !m.enabled } : m
    );
    await handleSaveAll(updatedList);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this model configuration?')) {
      const updatedList = models.filter(m => m.id !== id);
      await handleSaveAll(updatedList);
    }
  };

  const handleSetDefault = async (id) => {
    const updatedList = models.map(m => ({
      ...m,
      isDefault: m.id === id
    }));
    await handleSaveAll(updatedList);
  };

  if (loading) return <div className="flex justify-center p-8"><Loader className="animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">AI Model Configuration</h2>
          <p className="text-sm text-soft-grey">Configure and manage AI models used by the application</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Model
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white/5 border border-primary/30 rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-soft-grey">Display Name</label>
              <input 
                type="text" 
                value={newModel.name}
                onChange={(e) => setNewModel({...newModel, name: e.target.value})}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white"
                placeholder="e.g. Gemini Pro"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-soft-grey">Provider</label>
              <input 
                type="text" 
                value={newModel.provider}
                onChange={(e) => setNewModel({...newModel, provider: e.target.value})}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white"
                placeholder="e.g. google"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-soft-grey">Model ID</label>
              <input 
                type="text" 
                value={newModel.modelName}
                onChange={(e) => setNewModel({...newModel, modelName: e.target.value})}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white"
                placeholder="e.g. gemini-1.5-pro"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-soft-grey">API Key</label>
              <input 
                type="password" 
                value={newModel.apiKey}
                onChange={(e) => setNewModel({...newModel, apiKey: e.target.value})}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white"
                placeholder="API Key..."
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-soft-grey">System Instruction</label>
            <textarea 
              value={newModel.systemInstruction}
              onChange={(e) => setNewModel({...newModel, systemInstruction: e.target.value})}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white h-24 resize-none"
              placeholder="System prompt..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-soft-grey">Max Tokens</label>
              <input 
                type="number" 
                value={newModel.maxTokens}
                onChange={(e) => setNewModel({...newModel, maxTokens: parseInt(e.target.value)})}
                className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white"
              />
            </div>
            <div className="flex items-center gap-3 pt-8">
              <input 
                type="checkbox" 
                id="isDefault" 
                checked={newModel.isDefault}
                onChange={(e) => setNewModel({...newModel, isDefault: e.target.checked})}
                className="w-4 h-4 rounded border-white/10 bg-black/20 text-primary"
              />
              <label htmlFor="isDefault" className="text-sm text-white">Set as Default</label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-soft-grey hover:text-white transition-colors">Cancel</button>
            <button 
              onClick={handleAdd} 
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? <Loader className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              Save Model
            </button>
          </div>
        </div>
      )}

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-soft-grey">Model Info</th>
              <th className="px-6 py-4 text-sm font-semibold text-soft-grey">Provider/ID</th>
              <th className="px-6 py-4 text-sm font-semibold text-soft-grey">Default</th>
              <th className="px-6 py-4 text-sm font-semibold text-soft-grey">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-soft-grey text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {models.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-soft-grey">No models configured yet.</td>
              </tr>
            ) : (
              models.map((model) => (
                <tr key={model.id || model._id} className="group hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Cpu className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-white">{model.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="text-white">{model.provider}</div>
                      <div className="text-soft-grey text-xs">{model.modelName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {model.isDefault ? (
                      <span className="flex items-center gap-1 text-primary text-xs font-bold">
                        <Check className="w-3 h-3" /> DEFAULT
                      </span>
                    ) : (
                      <button 
                        onClick={() => handleSetDefault(model.id || model._id)}
                        className="text-xs text-soft-grey hover:text-white transition-colors"
                      >
                        Set Default
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${model.enabled ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                      {model.enabled ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleToggle(model.id || model._id)} className={`p-2 rounded-lg transition-colors ${model.enabled ? 'hover:bg-red-500/10 text-soft-grey hover:text-red-400' : 'hover:bg-green-500/10 text-soft-grey hover:text-green-400'}`} title={model.enabled ? 'Disable' : 'Enable'}>
                        <Power className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-red-500/10 rounded-lg text-soft-grey hover:text-red-400 transition-colors" onClick={() => handleDelete(model.id || model._id)} title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ModelSettings;
