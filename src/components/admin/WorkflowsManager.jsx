import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Plus, Edit, Trash2, X, Save, PlusCircle, MinusCircle } from 'lucide-react';

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
    journey: []
  });

  useEffect(() => {
    fetchWorkflows();
    fetchTools();
  }, []);

  const fetchWorkflows = async () => {
    try {
      const q = query(collection(db, 'workflows'), orderBy('name'));
      const snapshot = await getDocs(q);
      setWorkflows(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching workflows:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTools = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'tools'));
      setTools(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
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
        await updateDoc(doc(db, 'workflows', editingWorkflow.id), workflowData);
      } else {
        await addDoc(collection(db, 'workflows'), workflowData);
      }

      resetForm();
      fetchWorkflows();
    } catch (error) {
      console.error('Error saving workflow:', error);
      alert('Error saving workflow: ' + error.message);
    }
  };

  const handleEdit = (workflow) => {
    setEditingWorkflow(workflow);
    setFormData({
      ...workflow,
      journey: workflow.journey || []
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this workflow?')) {
      try {
        await deleteDoc(doc(db, 'workflows', id));
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
      journey: []
    });
    setEditingWorkflow(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Workflows Manager</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Workflow
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark border border-white/10 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{editingWorkflow ? 'Edit Workflow' : 'Add New Workflow'}</h2>
              <button onClick={resetForm} className="text-soft-grey hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                          <select
                            value={step.toolId}
                            onChange={(e) => updateJourneyStep(index, 'toolId', e.target.value)}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-sm"
                          >
                            <option value="">Select Tool</option>
                            {tools.map(tool => (
                              <option key={tool.id} value={tool.id}>{tool.name}</option>
                            ))}
                          </select>
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
        </div>
      )}

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
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
    </div>
  );
};

export default WorkflowsManager;

