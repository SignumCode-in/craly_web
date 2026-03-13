import { useNavigate } from 'react-router-dom';
import { workflowService } from '../../../api/workflowService';
import WorkflowForm from '../../../components/admin/workflows/WorkflowForm';

const AddWorkflow = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await workflowService.create(formData);
      navigate('/admin/workflows');
    } catch (error) {
      console.error('Error creating workflow:', error);
      alert('Error creating workflow: ' + error.message);
    }
  };

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto bg-dark border border-white/10 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6">Add New Workflow</h2>
      <WorkflowForm 
        onSubmit={handleSubmit} 
        onCancel={() => navigate('/admin/workflows')}
        submitText="Create Workflow"
      />
    </div>
  );
};

export default AddWorkflow;
