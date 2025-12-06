import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Plus, Edit, Trash2, X, Save } from 'lucide-react';

const PostsManager = () => {
  const [posts, setPosts] = useState([]);
  const [tools, setTools] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    tool: {
      toolId: '',
      categoryId: ''
    },
    imageUrl: '',
    tags: '',
    likes: 0,
    timestamp: Date.now()
  });

  useEffect(() => {
    fetchPosts();
    fetchTools();
    fetchCategories();
  }, []);

  const fetchPosts = async () => {
    try {
      const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
      const snapshot = await getDocs(q);
      setPosts(snapshot.docs.map(doc => ({ postId: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching posts:', error);
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

  const fetchCategories = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'categories'));
      setCategories(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const postData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        likes: parseInt(formData.likes) || 0,
        timestamp: editingPost ? formData.timestamp : Date.now()
      };

      if (editingPost) {
        await updateDoc(doc(db, 'posts', editingPost.postId), postData);
      } else {
        await addDoc(collection(db, 'posts'), postData);
      }

      resetForm();
      fetchPosts();
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Error saving post: ' + error.message);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      ...post,
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : post.tags || '',
      tool: post.tool || { toolId: '', categoryId: '' }
    });
    setShowForm(true);
  };

  const handleDelete = async (postId) => {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        await deleteDoc(doc(db, 'posts', postId));
        fetchPosts();
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Error deleting post: ' + error.message);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      body: '',
      tool: {
        toolId: '',
        categoryId: ''
      },
      imageUrl: '',
      tags: '',
      likes: 0,
      timestamp: Date.now()
    });
    setEditingPost(null);
    setShowForm(false);
  };

  const getToolName = (toolId) => {
    const tool = tools.find(t => t.id === toolId);
    return tool ? tool.name : '-';
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : '-';
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Posts Manager</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Post
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark border border-white/10 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{editingPost ? 'Edit Post' : 'Create New Post'}</h2>
              <button onClick={resetForm} className="text-soft-grey hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Body *</label>
                <textarea
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
                  rows="6"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tool</label>
                  <select
                    value={formData.tool.toolId}
                    onChange={(e) => setFormData({
                      ...formData,
                      tool: { ...formData.tool, toolId: e.target.value }
                    })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
                  >
                    <option value="">Select Tool</option>
                    {tools.map(tool => (
                      <option key={tool.id} value={tool.id}>{tool.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={formData.tool.categoryId}
                    onChange={(e) => setFormData({
                      ...formData,
                      tool: { ...formData.tool, categoryId: e.target.value }
                    })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
                    placeholder="AI, Productivity, Writing"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Likes</label>
                  <input
                    type="number"
                    value={formData.likes}
                    onChange={(e) => setFormData({ ...formData, likes: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
                >
                  <Save className="w-5 h-5" />
                  {editingPost ? 'Update' : 'Create'}
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
                <th className="px-6 py-4 text-left text-sm font-semibold">Title</th>
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
                  <td className="px-6 py-4">{getToolName(post.tool?.toolId)}</td>
                  <td className="px-6 py-4">{getCategoryName(post.tool?.categoryId)}</td>
                  <td className="px-6 py-4">{post.likes || 0}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(post)}
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PostsManager;

