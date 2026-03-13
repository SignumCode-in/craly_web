import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toolService } from '../../../api/toolService';
import ToolForm from '../../../components/admin/tools/ToolForm';
import { Loader } from 'lucide-react';

const EditTool = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [tool, setTool] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTool();
  }, [id]);

  const fetchTool = async () => {
    try {
      // In Craly, they usually get all tools and filter, but a direct fetch is better if available.
      // E.g., const data = await toolService.getById(id);
      // Wait, there's `toolService.getAll({ limit: 1000 })` or similar, I'll try to find the tool.
      const data = await toolService.getAll({ limit: 1000 });
      const items = data.tools || data;
      const foundTool = items.find(t => (t.documentId === id || t.id === id || t._id === id));
      
      if (foundTool) {
        setTool({
          ...foundTool,
          tags: Array.isArray(foundTool.tags) ? foundTool.tags : (foundTool.tags ? foundTool.tags.split(',').map(t => t.trim()) : [])
        });
      } else {
        alert("Tool not found");
        navigate('/admin/tools');
      }
    } catch (error) {
      console.error('Error fetching tool:', error);
      alert('Error fetching tool');
      navigate('/admin/tools');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      await toolService.update(id, formData);
      navigate('/admin/tools');
    } catch (error) {
      console.error('Error updating tool:', error);
      alert('Error updating tool: ' + error.message);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader className="w-8 h-8 text-primary animate-spin" /></div>;
  }

  return (
    <div className="max-w-3xl border border-white/10 rounded-2xl p-6 bg-white/5">
      <h2 className="text-2xl font-bold mb-6">Edit Tool</h2>
      {tool && (
        <ToolForm 
          initialData={tool}
          onSubmit={handleSubmit} 
          onCancel={() => navigate('/admin/tools')}
          submitText="Update Tool"
        />
      )}
    </div>
  );
};

export default EditTool;
