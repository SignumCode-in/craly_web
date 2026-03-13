import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postService } from '../../../api/postService';
import PostForm from '../../../components/admin/posts/PostForm';
import { Loader } from 'lucide-react';

const EditPost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const allPosts = await postService.getAll();
      const foundPost = allPosts.find(p => p.postId === id || p._id === id);
      
      if (foundPost) {
        setPost({
          ...foundPost,
          tags: Array.isArray(foundPost.tags) ? foundPost.tags : (foundPost.tags ? foundPost.tags.split(',').map(t => t.trim()) : []),
          tool: foundPost.tool?._id || foundPost.tool?.id || foundPost.tool || '',
          category: foundPost.category?._id || foundPost.category?.id || foundPost.category || '',
          media: foundPost.media || { type: 'image', url: '', thumbnailUrl: '' },
          prompt: foundPost.prompt || { content: '', toolId: '', copyEnabled: true, difficulty: 'beginner', estimatedTime: '', usedCount: 0 },
          postType: foundPost.postType || 'post',
          status: foundPost.status || 'draft',
          isTrending: foundPost.isTrending || false,
          isFeatured: foundPost.isFeatured || false,
          isSponsored: foundPost.isSponsored || false,
          sharesCount: foundPost.sharesCount || 0
        });
      } else {
        alert("Post not found");
        navigate('/admin/posts');
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      alert('Error fetching post details');
      navigate('/admin/posts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      await postService.update(id, formData);
      navigate('/admin/posts');
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Error updating post: ' + error.message);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader className="w-8 h-8 text-primary animate-spin" /></div>;
  }

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto bg-dark border border-white/10 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6">Edit Post</h2>
      {post && (
        <PostForm 
          initialData={post}
          onSubmit={handleSubmit} 
          onCancel={() => navigate('/admin/posts')}
          submitText="Update Post"
          isEditing={true}
        />
      )}
    </div>
  );
};

export default EditPost;
