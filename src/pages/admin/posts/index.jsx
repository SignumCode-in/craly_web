import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { postService } from '../../../api/postService';
import { toolService } from '../../../api/toolService';
import { categoryService } from '../../../api/categoryService';
import { Plus, Edit, Trash2, Loader } from 'lucide-react';

const PostsIndex = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [tools, setTools] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
    fetchTools();
    fetchCategories();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await postService.getAll();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTools = async () => {
    try {
      const response = await toolService.getAll({ limit: 0 });
      const toolsData = response.tools || (Array.isArray(response) ? response : []);
      setTools(toolsData);
    } catch (error) {
      console.error('Error fetching tools:', error);
      setTools([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryService.getAll({ limit: 0 });
      const cats = response.categories || (response.data && response.data.categories) || (Array.isArray(response) ? response : []);
      setCategories(cats.map(item => ({ ...item, id: item._id || item.id })));
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postService.delete(postId);
        fetchPosts();
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Error deleting post: ' + error.message);
      }
    }
  };

  const getToolName = (toolId) => {
    const tool = tools.find(t => t.id === toolId || t._id === toolId);
    return tool ? tool.name : '-';
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId || c._id === categoryId);
    return category ? category.name : '-';
  };

  if (loading) {
    return <div className="flex justify-center p-12"><Loader className="w-8 h-8 text-primary animate-spin" /></div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Posts Manager</h1>
        <Link
          to="/admin/posts/add"
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Post
        </Link>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Title</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Tool</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Likes</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.postId} className="border-t border-white/10 hover:bg-white/5">
                  <td className="px-6 py-4 font-medium max-w-md truncate">{post.title}</td>
                  <td className="px-6 py-4 capitalize">{post.postType || 'post'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs capitalize ${post.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {post.status || 'draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4">{getToolName(post.tool?._id || post.tool?.id || post.tool)}</td>
                  <td className="px-6 py-4">{getCategoryName(post.category?._id || post.category?.id || post.category)}</td>
                  <td className="px-6 py-4">{post.likes || 0}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/admin/posts/edit/${post.postId}`)}
                        className="p-2 hover:bg-white/10 rounded transition-colors"
                      >
                        <Edit className="w-4 h-4 text-primary" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.postId)}
                        className="p-2 hover:bg-white/10 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-soft-grey">No posts found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PostsIndex;
