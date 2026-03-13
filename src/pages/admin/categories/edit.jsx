import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { categoryService } from '../../../api/categoryService';
import CategoryForm from '../../../components/admin/categories/CategoryForm';
import { Loader } from 'lucide-react';

const EditCategory = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategory();
  }, [id]);

  const fetchCategory = async () => {
    try {
      const response = await categoryService.getAll({ limit: 0 });
      const allCats = response.data?.categories || Array.isArray(response.data) ? response.data : (response.categories || response);
      const catList = Array.isArray(allCats) ? allCats.map(item => ({ ...item, id: item._id })) : [];
      
      const foundCategory = catList.find(c => c.id === id || c._id === id);
      
      if (foundCategory) {
        setCategory({
          ...foundCategory,
          tools: foundCategory.tools ? foundCategory.tools.map(t => typeof t === 'object' ? (t.id || t._id) : t) : [],
          tags: foundCategory.tags || []
        });
      } else {
        alert("Category not found");
        navigate('/admin/categories');
      }
    } catch (error) {
      console.error('Error fetching category:', error);
      alert('Error fetching category');
      navigate('/admin/categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      await categoryService.update(id, formData);
      navigate('/admin/categories');
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Error updating category: ' + error.message);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader className="w-8 h-8 text-primary animate-spin" /></div>;
  }

  return (
    <div className="max-w-3xl border border-white/10 rounded-2xl p-6 bg-white/5">
      <h2 className="text-2xl font-bold mb-6">Edit Category</h2>
      {category && (
        <CategoryForm 
          initialData={category}
          onSubmit={handleSubmit} 
          onCancel={() => navigate('/admin/categories')}
          submitText="Update Category"
          isEditing={true}
        />
      )}
    </div>
  );
};

export default EditCategory;
