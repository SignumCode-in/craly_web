import { useNavigate } from 'react-router-dom';
import { postService } from '../../../api/postService';
import PostForm from '../../../components/admin/posts/PostForm';

const AddPost = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await postService.create(formData);
      navigate('/admin/posts');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post: ' + error.message);
    }
  };

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto bg-dark border border-white/10 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6">Create New Post</h2>
      <PostForm 
        onSubmit={handleSubmit} 
        onCancel={() => navigate('/admin/posts')}
        submitText="Create Post"
      />
    </div>
  );
};

export default AddPost;
