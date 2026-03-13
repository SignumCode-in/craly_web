import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { workflowService } from '../../../api/workflowService';
import { Plus, Edit, Trash2, Search, LayoutGrid, List, Loader } from 'lucide-react';

const WorkflowsIndex = () => {
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [viewType, setViewType] = useState('list');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchWorkflows();
  }, [page, limit, debouncedSearch]);

  const fetchWorkflows = async () => {
    setLoading(true);
    try {
      const params = { page, limit, search: debouncedSearch };
      const data = await workflowService.getAll(params);
      setWorkflows(data.items || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.totalCount || 0);
    } catch (error) {
      console.error('Error fetching workflows:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this workflow?')) {
      try {
        await workflowService.delete(id);
        fetchWorkflows();
      } catch (error) {
        console.error('Error deleting workflow:', error);
        alert('Error deleting workflow: ' + error.message);
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Workflows Manager</h1>
          <p className="text-soft-grey mt-1">Total Workflows: {totalCount}</p>
        </div>
        <Link
          to="/admin/workflows/add"
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Workflow
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-soft-grey w-5 h-5" />
          <input
            type="text"
            placeholder="Search workflows by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white"
          />
        </div>

        <div className="flex items-center gap-4">
          <select
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1);
            }}
            className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white"
          >
            <option value={10}>10 per page</option>
            <option value={20}>20 per page</option>
            <option value={50}>50 per page</option>
          </select>

          <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
            <button
              onClick={() => setViewType('list')}
              className={`p-1.5 rounded ${viewType === 'list' ? 'bg-primary text-white' : 'text-soft-grey hover:text-white'}`}
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewType('grid')}
              className={`p-1.5 rounded ${viewType === 'grid' ? 'bg-primary text-white' : 'text-soft-grey hover:text-white'}`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><Loader className="w-8 h-8 text-primary animate-spin" /></div>
      ) : (
        <>
          {viewType === 'list' ? (
            <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden mb-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/5">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Steps</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Duration</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Description</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workflows.map((workflow) => (
                      <tr key={workflow.id} className="border-t border-white/10 hover:bg-white/5">
                        <td className="px-6 py-4 font-medium">{workflow.name}</td>
                        <td className="px-6 py-4">{workflow.steps || (workflow.journey?.length || 0)}</td>
                        <td className="px-6 py-4">{workflow.duration || '-'}</td>
                        <td className="px-6 py-4 text-soft-grey max-w-md truncate">{workflow.description || '-'}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => navigate(`/admin/workflows/edit/${workflow.id}`)}
                              className="p-2 hover:bg-white/10 rounded transition-colors"
                            >
                              <Edit className="w-4 h-4 text-primary" />
                            </button>
                            <button
                              onClick={() => handleDelete(workflow.id)}
                              className="p-2 hover:bg-white/10 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {workflows.length === 0 && <tr><td colSpan="5" className="text-center py-8 text-soft-grey">No workflows found.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {workflows.map((workflow) => (
                <div key={workflow.id} className="bg-white/5 border border-white/10 rounded-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      {workflow.iconName ? (
                         workflow.iconName.startsWith('http') ? (
                           <img src={workflow.iconName} alt={workflow.name} className="w-10 h-10 rounded-lg object-cover" />
                         ) : (
                           <span className="text-2xl">{workflow.iconName}</span>
                         )
                      ) : (
                        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                          <LayoutGrid className="w-5 h-5 text-soft-grey" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-lg">{workflow.name}</h3>
                        <p className="text-sm text-soft-grey">{workflow.duration || '-'} • {workflow.steps || (workflow.journey?.length || 0)} steps</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-soft-grey text-sm mb-4 line-clamp-2">{workflow.description || 'No description available.'}</p>

                  <div className="flex gap-2 justify-end mt-4 pt-4 border-t border-white/10">
                    <button
                      onClick={() => navigate(`/admin/workflows/edit/${workflow.id}`)}
                      className="p-2 hover:bg-white/10 rounded transition-colors"
                    >
                      <Edit className="w-4 h-4 text-primary" />
                    </button>
                    <button
                      onClick={() => handleDelete(workflow.id)}
                      className="p-2 hover:bg-white/10 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg disabled:opacity-50 transition-colors"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-soft-grey">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg disabled:opacity-50 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WorkflowsIndex;
