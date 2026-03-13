import { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userService } from '../../../api/userService';
import { Trash2, User, Mail, Calendar, Search, Filter, ArrowUpDown, Plus, Edit } from 'lucide-react';

const UsersIndex = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('recent'); // 'recent', 'oldest', 'name'
    const [filterSource, setFilterSource] = useState('all');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await userService.getAll();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await userService.delete(id);
                setUsers(users.filter(user => user.id !== id && user._id !== id));
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const sources = useMemo(() => {
        const uniqueSources = new Set(users.map(u => u.heardFrom).filter(Boolean));
        return ['all', ...Array.from(uniqueSources)];
    }, [users]);

    const filteredAndSortedUsers = useMemo(() => {
        let result = [...users];

        // Search Filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(user =>
                (user.displayName?.toLowerCase().includes(term)) ||
                (user.email?.toLowerCase().includes(term))
            );
        }

        // Source Filter
        if (filterSource !== 'all') {
            result = result.filter(user => user.heardFrom === filterSource);
        }

        // Sorting
        result.sort((a, b) => {
            if (sortBy === 'recent') {
                return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
            } else if (sortBy === 'oldest') {
                return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
            } else if (sortBy === 'name') {
                return (a.displayName || '').localeCompare(b.displayName || '');
            }
            return 0;
        });

        return result;
    }, [users, searchTerm, sortBy, filterSource]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">User Management</h2>
                    <p className="text-soft-grey text-sm">Manage and track users</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">
                        {filteredAndSortedUsers.length} Users
                    </div>
                    <Link
                        to="/admin/users/add"
                        className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Add User
                    </Link>
                </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-soft-grey w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder:text-soft-grey focus:outline-none focus:border-primary/50 transition-colors"
                    />
                </div>

                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-soft-grey w-4 h-4" />
                        <select
                            value={filterSource}
                            onChange={(e) => setFilterSource(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                        >
                            <option value="all">All Sources</option>
                            {sources.filter(s => s !== 'all').map(source => (
                                <option key={source} value={source}>{source}</option>
                            ))}
                        </select>
                    </div>
                    <div className="relative flex-1">
                        <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-soft-grey w-4 h-4" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-primary/50 transition-colors appearance-none"
                        >
                            <option value="recent">Recent Joined</option>
                            <option value="oldest">Oldest First</option>
                            <option value="name">Name (A-Z)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* User List */}
            <div className="grid grid-cols-1 gap-4">
                {filteredAndSortedUsers.length > 0 ? (
                    filteredAndSortedUsers.map((user) => (
                        <div key={user.id || user._id} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between hover:bg-white/10 transition-colors">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-white/10 flex items-center justify-center border border-white/10 shadow-inner">
                                    {user.photoUrl ? (
                                        <img src={user.photoUrl} alt={user.displayName} className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="text-soft-grey" />
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-white font-medium">{user.displayName || 'Anonymous User'}</h3>
                                        {new Date(user.createdAt || 0) > new Date(Date.now() - 24 * 60 * 60 * 1000) && (
                                            <span className="px-1.5 py-0.5 bg-green-500/20 text-green-400 text-[10px] rounded uppercase font-bold tracking-wider">New</span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-soft-grey mt-0.5">
                                        <span className="flex items-center gap-1"><Mail size={14} /> {user.email}</span>
                                        {user.createdAt && (
                                            <span className="flex items-center gap-1">
                                                <Calendar size={14} />
                                                {typeof user.createdAt === 'string' ? new Date(user.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 mt-2">
                                        {user.heardFrom && (
                                            <span className="text-[11px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-md">
                                                via {user.heardFrom}
                                            </span>
                                        )}
                                        {user.interests && user.interests.length > 0 && (
                                            <div className="flex flex-wrap gap-1">
                                                {user.interests.slice(0, 3).map((interest, i) => (
                                                    <span key={i} className="px-2 py-0.5 bg-white/5 text-soft-grey border border-white/10 rounded-full text-[10px]">
                                                        {interest}
                                                    </span>
                                                ))}
                                                {user.interests.length > 3 && (
                                                    <span className="text-[10px] text-soft-grey">+{user.interests.length - 3} more</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => navigate(`/admin/users/edit/${user.id || user._id}`)}
                                    className="p-2 hover:bg-white/10 text-soft-grey hover:text-white rounded-lg transition-all"
                                    title="Edit User"
                                >
                                    <Edit size={20} />
                                </button>
                                <button
                                    onClick={() => handleDeleteUser(user.id || user._id)}
                                    className="p-2 hover:bg-red-500/20 text-soft-grey hover:text-red-500 rounded-lg transition-all"
                                    title="Delete User"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-white/5 border border-dashed border-white/10 rounded-2xl">
                        <Search className="w-12 h-12 text-white/10 mx-auto mb-4" />
                        <h3 className="text-white font-medium">No users found</h3>
                        <p className="text-soft-grey text-sm">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UsersIndex;
