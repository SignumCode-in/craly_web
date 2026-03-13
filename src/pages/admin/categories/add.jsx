import { useNavigate } from 'react-router-dom';
import { categoryService } from '../../../api/categoryService';
import CategoryForm from '../../../components/admin/categories/CategoryForm';

const AddCategory = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await categoryService.create(formData);
      navigate('/admin/categories');
    } catch (error) {
      console.error('Error creating category:', error);
      alert('Error creating category: ' + error.message);
    }
  };

  return (
    <div className="max-w-3xl border border-white/10 rounded-2xl p-6 bg-white/5">
      <h2 className="text-2xl font-bold mb-6">Add New Category</h2>
      <CategoryForm 
        onSubmit={handleSubmit} 
        onCancel={() => navigate('/admin/categories')}
        submitText="Create Category"
        isEditing={false}
      />
    </div>
  );
};

export default AddCategory;
