import { useState, useEffect } from 'react';
import { toolService } from '../../../api/toolService';
import { tagService } from '../../../api/tagService';
import MultiTagInput from '../MultiTagInput';
import SearchableSelect from '../SearchableSelect';
import { Save, X, PlusCircle, MinusCircle } from 'lucide-react';

const WorkflowForm = ({ initialData, onSubmit, onCancel, submitText, isEditing }) => {
  const [tools, setTools] = useState([]);
  
  const [formData, setFormData] = useState(initialData || {
    name: '',
    description: '',
    iconName: '',
    duration: '',
    steps: 0,
    tags: [],
    journey: []
  });

  useEffect(() => {
    fetchTools();
  }, []);

  const fetchTools = async () => {
    try {
      const data = await toolService.getAll({ limit: 0 });
      setTools(Array.isArray(data) ? data : data?.tools || []);
    } catch (error) {
      console.error('Error fetching tools:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      steps: formData.journey.length
    });
  };

  const addJourneyStep = () => {
    setFormData({
      ...formData,
      journey: [...formData.journey, { title: '', description: '', toolId: '', prompt: '' }]
    });
  };

  const removeJourneyStep = (index) => {
    setFormData({
      ...formData,
      journey: formData.journey.filter((_, i) => i !== index)
    });
  };

  const updateJourneyStep = (index, field, value) => {
    const updatedJourney = [...formData.journey];
    updatedJourney[index] = { ...updatedJourney[index], [field]: value };
    setFormData({ ...formData, journey: updatedJourney });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Icon Name or URL</label>
          <input
            type="text"
            value={formData.iconName}
            onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
          />
        </div>
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

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Duration</label>
          <input
            type="text"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
            placeholder="e.g., 30 minutes, 1 hour"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Tags (Type # to search)</label>
          <MultiTagInput
            value={formData.tags}
            onChange={(val) => setFormData({ ...formData, tags: val })}
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
      </div>

      <div className="border-t border-white/10 pt-4">
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-medium">Journey Steps</label>
          <button
            type="button"
            onClick={addJourneyStep}
            className="flex items-center gap-2 px-4 py-2 bg-accent/20 hover:bg-accent/30 text-accent rounded-lg transition-colors"
          >
            <PlusCircle className="w-5 h-5" />
            Add Step
          </button>
        </div>

        <div className="space-y-4">
          {formData.journey.map((step, index) => (
            <div key={index} className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-soft-grey">Step {index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeJourneyStep(index)}
                  className="text-red-400 hover:text-red-300"
                >
                  <MinusCircle className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Title *</label>
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => updateJourneyStep(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Description</label>
                  <textarea
                    value={step.description}
                    onChange={(e) => updateJourneyStep(index, 'description', e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-sm"
                    rows="2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Tool</label>
                  <SearchableSelect
                    options={[
                      { value: '', label: 'Select Tool' },
                      ...tools.map(tool => ({ value: tool.id, label: tool.name }))
                    ]}
                    value={step.toolId}
                    onChange={(value) => updateJourneyStep(index, 'toolId', value)}
                    placeholder="Select Tool"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Prompt</label>
                  <textarea
                    value={step.prompt || ''}
                    onChange={(e) => updateJourneyStep(index, 'prompt', e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-sm"
                    rows="3"
                    placeholder="Enter the prompt for this step..."
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
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

export default WorkflowForm;
