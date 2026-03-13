import { useNavigate } from 'react-router-dom';
import { toolService } from '../../../api/toolService';
import ToolForm from '../../../components/admin/tools/ToolForm';

const AddTool = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await toolService.create(formData);
      navigate('/admin/tools');
    } catch (error) {
      console.error('Error creating tool:', error);
      alert('Error creating tool: ' + error.message);
    }
  };

  return (
    <div className="max-w-3xl border border-white/10 rounded-2xl p-6 bg-white/5">
      <h2 className="text-2xl font-bold mb-6">Add New Tool</h2>
      <ToolForm 
        onSubmit={handleSubmit} 
        onCancel={() => navigate('/admin/tools')}
        submitText="Create Tool"
      />
    </div>
  );
};

export default AddTool;
