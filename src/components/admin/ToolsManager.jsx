import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Plus, Edit, Trash2, X, Save, Search, Power, GripVertical, TrendingUp, Loader, LayoutGrid, List, Heart, ExternalLink } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const ToolsManager = () => {
  const [tools, setTools] = useState([]);
  const [filteredTools, setFilteredTools] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [editingTool, setEditingTool] = useState(null);
  const [showTrendingOrder, setShowTrendingOrder] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [trendingTools, setTrendingTools] = useState([]);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    shortDescription: '',
    longDescription: '',
    url: '',
    logoUrl: '',
    pricing: 'Freemium',
    tags: '',
    isTrending: false,
    enabled: true,
    likesCount: 0
  });

  useEffect(() => {
    fetchTools();
    fetchCategories();
  }, []);

  const fetchTools = async () => {
    try {
      const q = query(collection(db, 'tools'), orderBy('name'));
      const snapshot = await getDocs(q);
      const toolsData = snapshot.docs.map(docSnapshot => {
        const data = docSnapshot.data();
        const firestoreDocId = docSnapshot.id;
        return {
          ...data,
          id: firestoreDocId,
          documentId: firestoreDocId
        };
      });
      setTools(toolsData);
      setFilteredTools(toolsData);

      // Update trending tools for reordering
      const trending = toolsData
        .filter(t => t.isTrending)
        .sort((a, b) => (a.trendingOrder || 0) - (b.trendingOrder || 0));
      setTrendingTools(trending);
    } catch (error) {
      console.error('Error fetching tools:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryId = (categoryIdOrName) => {
    if (!categoryIdOrName) return null;
    const category = categories.find(cat => cat.id === categoryIdOrName || cat.name === categoryIdOrName);
    return category ? category.id : null;
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId || cat.name === categoryId);
    return category ? category.name : categoryId;
  };

  const getLogoUrl = (tool) => {
    // if (tool.logoUrl) return tool.logoUrl;
    // if (!tool.url) return null;
    try {
      const domain = new URL(tool.url).hostname;
      return `https://manifest.im/icon/${domain}`;
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    let filtered = tools;

    if (selectedCategory) {
      filtered = filtered.filter(tool => tool.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(tool =>
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getCategoryName(tool.category)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTools(filtered);
  }, [searchTerm, selectedCategory, tools, categories]);

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
      const toolData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        likesCount: parseInt(formData.likesCount) || 0
      };

      if (editingTool) {
        const documentId = editingTool.documentId || editingTool.id;
        if (!documentId) {
          throw new Error('Document ID is missing. Cannot update tool.');
        }
        await updateDoc(doc(db, 'tools', documentId), toolData);

        const oldCategoryId = getCategoryId(editingTool.category);
        const newCategoryId = formData.category;

        if (oldCategoryId !== newCategoryId) {
          if (oldCategoryId) {
            await updateDoc(doc(db, 'categories', oldCategoryId), {
              tools: arrayRemove(documentId)
            });
          }
          if (newCategoryId) {
            await updateDoc(doc(db, 'categories', newCategoryId), {
              tools: arrayUnion(documentId)
            });
          }
        }
      } else {
        const newToolRef = await addDoc(collection(db, 'tools'), toolData);
        const newToolId = newToolRef.id;

        const categoryId = formData.category;
        if (categoryId) {
          await updateDoc(doc(db, 'categories', categoryId), {
            tools: arrayUnion(newToolId)
          });
        }
      }

      resetForm();
      fetchTools();
    } catch (error) {
      console.error('Error saving tool:', error);
      alert('Error saving tool: ' + error.message);
    }
  };

  const handleEdit = (tool) => {
    const documentId = tool.documentId || tool.id;
    setEditingTool({ ...tool, documentId, id: documentId });
    setFormData({
      ...tool,
      category: getCategoryId(tool.category) || tool.category,
      enabled: tool.enabled !== undefined ? tool.enabled : true,
      tags: Array.isArray(tool.tags) ? tool.tags.join(', ') : tool.tags || ''
    });
    setShowForm(true);
  };

  const handleToggleEnabled = async (tool) => {
    try {
      await updateDoc(doc(db, 'tools', tool.id), {
        enabled: !tool.enabled
      });
      fetchTools();
    } catch (error) {
      console.error('Error toggling tool:', error);
      alert('Error updating tool: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this tool?')) {
      try {
        const toolDoc = await getDoc(doc(db, 'tools', id));
        if (toolDoc.exists()) {
          const toolData = toolDoc.data();
          const categoryId = getCategoryId(toolData.category);

          await deleteDoc(doc(db, 'tools', id));

          if (categoryId) {
            await updateDoc(doc(db, 'categories', categoryId), {
              tools: arrayRemove(id)
            });
          }
        }
        fetchTools();
      } catch (error) {
        console.error('Error deleting tool:', error);
        alert('Error deleting tool: ' + error.message);
      }
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(trendingTools);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTrendingTools(items);
  };

  const saveTrendingOrder = async () => {
    setIsSavingOrder(true);
    try {
      const promises = trendingTools.map((tool, index) =>
        updateDoc(doc(db, 'tools', tool.id), {
          trendingOrder: index
        })
      );
      await Promise.all(promises);
      fetchTools();
      setShowTrendingOrder(false);
      alert('Trending order updated successfully!');
    } catch (error) {
      console.error('Error saving trending order:', error);
      alert('Error saving order: ' + error.message);
    } finally {
      setIsSavingOrder(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category: '',
      shortDescription: '',
      longDescription: '',
      url: '',
      logoUrl: '',
      pricing: 'Freemium',
      tags: '',
      isTrending: false,
      enabled: true,
      likesCount: 0
    });
    setEditingTool(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Tools Manager</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowTrendingOrder(true)}
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors"
          >
            <TrendingUp className="w-5 h-5" />
            Manage Trending Order
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Tool
          </button>
        </div>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-soft-grey" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tools by name, category, or description..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white placeholder-soft-grey"
          />
        </div>
        <div className="w-full md:w-64">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div className="flex bg-white/5 border border-white/10 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-md transition-all ${viewMode === 'grid' ? 'bg-primary text-white shadow-lg' : 'text-soft-grey hover:text-white'}`}
            title="Grid View"
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-primary text-white shadow-lg' : 'text-soft-grey hover:text-white'}`}
            title="List View"
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden shadow-2xl backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-soft-grey">Tool</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-soft-grey">Category</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-soft-grey">Pricing</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-soft-grey">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-soft-grey">Trending</th>
                  <th className="px-6 py-4 text-right text-sm font-semibold text-soft-grey">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredTools.map((tool) => (
                  <tr key={tool.id} className="group hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {getLogoUrl(tool) ? (
                            <img
                              src={getLogoUrl(tool)}
                              alt=""
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <span className={`text-xs font-bold text-primary ${getLogoUrl(tool) ? 'hidden' : 'flex'}`}>
                            {tool.name.substring(0, 2).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-white">{tool.name}</p>
                          <a href={tool.url} target="_blank" rel="noopener noreferrer" className="text-xs text-soft-grey hover:text-primary flex items-center gap-1">
                            Link <ExternalLink className="w-2 h-2" />
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-white/5 rounded text-xs text-soft-grey border border-white/5">
                        {getCategoryName(tool.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${tool.pricing === 'Free' ? 'bg-green-500/10 text-green-400' :
                        tool.pricing === 'Paid' ? 'bg-blue-500/10 text-blue-400' :
                          'bg-orange-500/10 text-orange-400'
                        }`}>
                        {tool.pricing}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleEnabled(tool)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all duration-300 focus:outline-none ${tool.enabled !== false ? 'bg-primary/20 border border-primary/30' : 'bg-white/5 border border-white/10'
                            }`}
                        >
                          <span
                            className={`inline-block h-3 w-3 transform rounded-full transition-all duration-300 shadow-sm ${tool.enabled !== false ? 'translate-x-5 bg-primary' : 'translate-x-1 bg-soft-grey'
                              }`}
                          />
                        </button>
                        <span className={`text-[10px] font-medium uppercase tracking-wider ${tool.enabled !== false ? 'text-primary' : 'text-soft-grey'}`}>
                          {tool.enabled !== false ? 'On' : 'Off'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {tool.isTrending ? (
                        <div className="flex items-center gap-1.5 text-accent">
                          <TrendingUp className="w-4 h-4" />
                          <span className="text-xs font-medium">#{tool.trendingOrder !== undefined ? tool.trendingOrder + 1 : 'T'}</span>
                        </div>
                      ) : (
                        <span className="text-soft-grey text-xs">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(tool)}
                          className="p-2 hover:bg-primary/10 rounded-lg transition-colors group/edit"
                        >
                          <Edit className="w-4 h-4 text-soft-grey group-hover/edit:text-primary" />
                        </button>
                        <button
                          onClick={() => handleDelete(tool.id)}
                          className="p-2 hover:bg-red-500/10 rounded-lg transition-colors group/del"
                        >
                          <Trash2 className="w-4 h-4 text-soft-grey group-hover/del:text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTools.map((tool) => (
            <div key={tool.id} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-primary/30 transition-all duration-300 group flex flex-col relative overflow-hidden">
              {/* Background Glow */}
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/5 blur-3xl rounded-full group-hover:bg-primary/10 transition-colors" />

              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex-shrink-0 shadow-inner flex items-center justify-center group-hover:border-primary/20 transition-colors">
                  {getLogoUrl(tool) ? (
                    <img
                      src={getLogoUrl(tool)}
                      alt=""
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <span className={`text-lg font-bold text-primary ${getLogoUrl(tool) ? 'hidden' : 'flex'}`}>
                    {tool.name.substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(tool)}
                    className="p-2 hover:bg-primary/10 rounded-xl transition-colors"
                  >
                    <Edit className="w-4 h-4 text-primary" />
                  </button>
                  <button
                    onClick={() => handleDelete(tool.id)}
                    className="p-2 hover:bg-red-500/10 rounded-xl transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors truncate">{tool.name}</h3>
                  {tool.isTrending && (
                    <TrendingUp className="w-4 h-4 text-accent" title="Trending Tool" />
                  )}
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-soft-grey border border-white/5 capitalize">
                    {getCategoryName(tool.category)}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${tool.pricing === 'Free' ? 'bg-green-500/10 text-green-400' :
                    tool.pricing === 'Paid' ? 'bg-blue-500/10 text-blue-400' :
                      'bg-orange-500/10 text-orange-400'
                    }`}>
                    {tool.pricing}
                  </span>
                </div>
                <p className="text-sm text-soft-grey line-clamp-2 mb-4 h-10">
                  {tool.shortDescription}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs text-soft-grey">
                    <Heart className="w-3.5 h-3.5 fill-soft-grey/20" />
                    {tool.likesCount || 0}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleEnabled(tool)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all duration-300 focus:outline-none ${tool.enabled !== false ? 'bg-primary/20 border border-primary/30' : 'bg-white/5 border border-white/10'
                        }`}
                    >
                      <span
                        className={`inline-block h-3 w-3 transform rounded-full transition-all duration-300 shadow-sm ${tool.enabled !== false ? 'translate-x-5 bg-primary' : 'translate-x-1 bg-soft-grey'
                          }`}
                      />
                    </button>
                    <span className={`text-[10px] font-bold uppercase ${tool.enabled !== false ? 'text-primary' : 'text-soft-grey'}`}>
                      {tool.enabled !== false ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/5 hover:bg-primary/20 rounded-lg text-soft-grey hover:text-primary transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {showTrendingOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark border border-white/10 rounded-xl p-6 max-w-lg w-full max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Trending Order</h2>
              <button
                onClick={() => {
                  setShowTrendingOrder(false);
                  setTrendingTools(tools.filter(t => t.isTrending).sort((a, b) => (a.trendingOrder || 0) - (b.trendingOrder || 0)));
                }}
                className="text-soft-grey hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-soft-grey mb-4 text-sm">Drag tools to change their display order on the landing page.</p>

            <div className="flex-1 overflow-y-auto mb-6 custom-scrollbar pr-2">
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="trending-tools">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                      {trendingTools.map((tool, index) => (
                        <Draggable key={tool.id} draggableId={tool.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-lg group transition-colors ${snapshot.isDragging ? 'bg-white/10 border-primary/50 shadow-lg' : 'hover:bg-white/8'
                                }`}
                            >
                              <div {...provided.dragHandleProps} className="text-white/20 group-hover:text-white/50">
                                <GripVertical className="w-5 h-5" />
                              </div>
                              <div className="w-8 h-8 rounded-md overflow-hidden bg-white/10 flex-shrink-0 flex items-center justify-center">
                                {getLogoUrl(tool) ? (
                                  <img
                                    src={getLogoUrl(tool)}
                                    alt=""
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display = 'flex';
                                    }}
                                  />
                                ) : null}
                                <div className={`w-full h-full flex items-center justify-center text-[10px] font-bold ${getLogoUrl(tool) ? 'hidden' : 'flex'}`}>
                                  {tool.name.substring(0, 2).toUpperCase()}
                                </div>
                              </div>
                              <div className="flex-1 font-medium">{tool.name}</div>
                              <div className="text-xs text-soft-grey bg-white/5 px-2 py-1 rounded">
                                #{index + 1}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>

            <div className="flex gap-4">
              <button
                onClick={saveTrendingOrder}
                disabled={isSavingOrder}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-all disabled:opacity-50"
              >
                {isSavingOrder ? (
                  <Loader className="w-5 h-5 animate-spin" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                Save New Order
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark border border-white/10 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{editingTool ? 'Edit Tool' : 'Add New Tool'}</h2>
              <button onClick={resetForm} className="text-soft-grey hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Short Description *</label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Long Description</label>
                <textarea
                  value={formData.longDescription}
                  onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
                  rows="4"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">URL *</label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Logo URL</label>
                  <input
                    type="url"
                    value={formData.logoUrl}
                    onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Pricing</label>
                  <select
                    value={formData.pricing}
                    onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
                  >
                    <option value="Free">Free</option>
                    <option value="Freemium">Freemium</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Likes Count</label>
                  <input
                    type="number"
                    value={formData.likesCount}
                    onChange={(e) => setFormData({ ...formData, likesCount: e.target.value })}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

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

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isTrending"
                    checked={formData.isTrending}
                    onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="isTrending" className="text-sm font-medium">Is Trending</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="enabled"
                    checked={formData.enabled}
                    onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <label htmlFor="enabled" className="text-sm font-medium">Enabled</label>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
                >
                  <Save className="w-5 h-5" />
                  {editingTool ? 'Update' : 'Create'}
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
    </div>
  );
};

export default ToolsManager;
