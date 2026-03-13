import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { workflowService } from '../../../api/workflowService';
import WorkflowForm from '../../../components/admin/workflows/WorkflowForm';
import { Loader } from 'lucide-react';

const EditWorkflow = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [workflow, setWorkflow] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkflow();
  }, [id]);

  const fetchWorkflow = async () => {
    try {
      const fullWorkflow = await workflowService.getById(id);
      
      const processedJourney = (fullWorkflow.journey || []).map(step => ({
        ...step,
        toolId: step.toolId ? (step.toolId._id || step.toolId.id || step.toolId) : ''
      }));

      setWorkflow({
        ...fullWorkflow,
        tags: fullWorkflow.tags || [],
        journey: processedJourney
      });
    } catch (error) {
      console.error('Error fetching workflow:', error);
      alert('Error fetching workflow details');
      navigate('/admin/workflows');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      await workflowService.update(id, formData);
      navigate('/admin/workflows');
    } catch (error) {
      console.error('Error updating workflow:', error);
      alert('Error updating workflow: ' + error.message);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader className="w-8 h-8 text-primary animate-spin" /></div>;
  }

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto bg-dark border border-white/10 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6">Edit Workflow</h2>
      {workflow && (
        <WorkflowForm 
          initialData={workflow}
          onSubmit={handleSubmit} 
          onCancel={() => navigate('/admin/workflows')}
          submitText="Update Workflow"
          isEditing={true}
        />
      )}
    </div>
  );
};

export default EditWorkflow;
