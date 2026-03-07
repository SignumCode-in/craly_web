import { useState, useEffect, useCallback } from 'react';
import { workflowService } from '../../api/workflowService';
import { toolService } from '../../api/toolService';
import { Plus, Edit, Trash2, X, Save, PlusCircle, MinusCircle, Search, LayoutGrid, List } from 'lucide-react';
import SearchableSelect from './SearchableSelect';
import MultiTagInput from './MultiTagInput';
import { tagService } from '../../api/tagService';

const WorkflowsManager = () => {
  const [workflows, setWorkflows] = useState([]);
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingWorkflow, setEditingWorkflow] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    iconName: '',
    duration: '',
    steps: 0,
    tags: [],
    journey: []
  });

  // State for search and pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [viewType, setViewType] = useState('list'); // 'list' or 'grid'

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchWorkflows();
    fetchTools();
  }, [page, limit, debouncedSearch]);

  const fetchWorkflows = async () => {
    setLoading(true);
    try {
      const params = { page, limit, search: debouncedSearch };
      const data = await workflowService.getAll(params);

      setWorkflows(data.items || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.totalCount || 0);
    } catch (error) {
      console.error('Error fetching workflows:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTools = async () => {
    try {
      const data = await toolService.getAll({ limit: 0 });
      setTools(data);
    } catch (error) {
      console.error('Error fetching tools:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const workflowData = {
        ...formData,
        steps: formData.journey.length
      };

      if (editingWorkflow) {
        await workflowService.update(editingWorkflow.id, workflowData);
      } else {
        await workflowService.create(workflowData);
      }

      resetForm();
      fetchWorkflows();
    } catch (error) {
      console.error('Error saving workflow:', error);
      alert('Error saving workflow: ' + error.message);
    }
  };

  const handleEdit = async (workflow) => {
    setLoading(true);
    try {
      // Get full workflow details with populated data
      const fullWorkflow = await workflowService.getById(workflow.id);
      setEditingWorkflow(fullWorkflow);

      // Ensure populated toolId gets transformed back to just the ID string for the select field
      const processedJourney = (fullWorkflow.journey || []).map(step => ({
        ...step,
        toolId: step.toolId ? (step.toolId._id || step.toolId.id || step.toolId) : ''
      }));

      setFormData({
        ...fullWorkflow,
        tags: fullWorkflow.tags || [],
        journey: processedJourney
      });
      setShowForm(true);
    } catch (error) {
      console.error('Error fetching full workflow details for edit:', error);
      alert('Error fetching workflow details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this workflow?')) {
      try {
        await workflowService.delete(id);
        fetchWorkflows();
      } catch (error) {
        console.error('Error deleting workflow:', error);
        alert('Error deleting workflow: ' + error.message);
      }
    }
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

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      iconName: '',
      duration: '',
      steps: 0,
      tags: [],
      journey: []
    });
    setEditingWorkflow(null);
    setShowForm(false);
  };

  // If loading and we are attempting to open full form edit, just show general loading
  if (loading && showForm) {
    return <div className="text-white p-6">Loading workflow details...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Workflows Manager</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Workflow
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-soft-grey w-5 h-5" />
          <input
            type="text"
            placeholder="Search workflows by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white"
          />
        </div>

        <div className="flex items-center gap-4">
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white"
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
          </select>

          <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
            <button
              onClick={() => setViewType('list')}
              className={`p-1.5 rounded ${viewType === 'list' ? 'bg-primary text-white' : 'text-soft-grey hover:text-white'}`}
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewType('grid')}
              className={`p-1.5 rounded ${viewType === 'grid' ? 'bg-primary text-white' : 'text-soft-grey hover:text-white'}`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {showForm ? (
        <div className="bg-dark border border-white/10 rounded-xl p-6 w-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">{editingWorkflow ? 'Edit Workflow' : 'Add New Workflow'}</h2>
            <button onClick={resetForm} className="text-soft-grey hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

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
                <label className="block text-sm font-medium mb-2">Icon Name</label>
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
                {editingWorkflow ? 'Update' : 'Create'}
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
      ) : (
        <>
          {viewType === 'list' ? (
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Steps</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Duration</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Description</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workflows.map((workflow) => (
                      <tr key={workflow.id} className="border-t border-white/10 hover:bg-white/5">
                        <td className="px-6 py-4 font-medium">{workflow.name}</td>
                        <td className="px-6 py-4">{workflow.steps || (workflow.journey?.length || 0)}</td>
                        <td className="px-6 py-4">{workflow.duration || '-'}</td>
                        <td className="px-6 py-4 text-soft-grey max-w-md truncate">{workflow.description || '-'}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(workflow)}
                              className="p-2 hover:bg-white/10 rounded transition-colors"
                            >
                              <Edit className="w-4 h-4 text-primary" />
                            </button>
                            <button
                              onClick={() => handleDelete(workflow.id)}
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
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {workflows.map((workflow) => (
                <div key={workflow.id} className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      {workflow.iconName ? (
                        <img src={workflow.iconName} alt={workflow.name} className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                          <LayoutGrid className="w-5 h-5 text-soft-grey" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-lg">{workflow.name}</h3>
                        <p className="text-sm text-soft-grey">{workflow.duration || '-'} • {workflow.steps || (workflow.journey?.length || 0)} steps</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-soft-grey text-sm mb-4 line-clamp-2">{workflow.description || 'No description available.'}</p>

                  <div className="flex gap-2 justify-end mt-4 pt-4 border-t border-white/10">
                    <button
                      onClick={() => handleEdit(workflow)}
                      className="p-2 hover:bg-white/10 rounded transition-colors"
                    >
                      <Edit className="w-4 h-4 text-primary" />
                    </button>
                    <button
                      onClick={() => handleDelete(workflow.id)}
                      className="p-2 hover:bg-white/10 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-soft-grey">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WorkflowsManager;

