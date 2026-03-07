import { useState, useRef, useEffect } from 'react';
import { adminService } from '../../api/adminService';
import { userService } from '../../api/userService';
import { Send, Users, User, Image as ImageIcon, Loader, BellRing, X, ChevronDown } from 'lucide-react';

const NotificationManager = () => {
    const [formData, setFormData] = useState({
        title: '',
        body: '',
        imageUrl: '',
        type: 'all',
        userIds: []
    });

    const [loading, setLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await userService.getAll();
                setUsers(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatusMessage({ type: '', text: '' });

        if (!formData.title || !formData.body) {
            setStatusMessage({ type: 'error', text: 'Title and body are required.' });
            setLoading(false);
            return;
        }

        let payload = {
            title: formData.title,
            body: formData.body,
            type: formData.type,
        };

        if (formData.imageUrl) {
            payload.imageUrl = formData.imageUrl;
        }

        if (formData.type === 'individual') {
            if (formData.userIds.length === 0) {
                setStatusMessage({ type: 'error', text: 'Please select at least one User.' });
                setLoading(false);
                return;
            }
            payload.userIds = formData.userIds;
        }

        try {
            const response = await adminService.sendNotification(payload);
            if (response && response.success) {
                setStatusMessage({
                    type: 'success',
                    text: `Notification sent successfully! (Success: ${response.data?.success || 0}, Failed: ${response.data?.failure || 0})`
                });
                // Reset form
                setFormData({ title: '', body: '', imageUrl: '', type: 'all', userIds: [] });
            } else {
                setStatusMessage({ type: 'error', text: response.message || 'Failed to send notification.' });
            }
        } catch (error) {
            console.error('Error sending notification:', error);
            setStatusMessage({ type: 'error', text: error.message || 'An error occurred while sending notification.' });
        } finally {
            setLoading(false);
        }
    };

    const toggleUserSelection = (userId) => {
        setFormData(prev => ({
            ...prev,
            userIds: prev.userIds.includes(userId)
                ? prev.userIds.filter(id => id !== userId)
                : [...prev.userIds, userId]
        }));
    };

    const filteredUsers = users.filter(user =>
        (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (user.displayName && user.displayName.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-primary/20 text-primary rounded-xl">
                    <BellRing className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Push Notifications</h1>
                    <p className="text-soft-grey mt-1">Send push notifications to all users or specific individuals.</p>
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 md:p-8">
                {statusMessage.text && (
                    <div className={`p-4 mb-6 rounded-lg text-sm border flex justify-between items-start ${statusMessage.type === 'error'
                        ? 'bg-red-500/10 border-red-500/20 text-red-500'
                        : 'bg-green-500/10 border-green-500/20 text-green-500'
                        }`}>
                        <span>{statusMessage.text}</span>
                        <button onClick={() => setStatusMessage({ type: '', text: '' })}>
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-white flex items-center gap-2">
                                Notification Type
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, type: 'all' }))}
                                    className={`p-3 rounded-lg flex items-center justify-center gap-2 border transition-all ${formData.type === 'all'
                                        ? 'bg-primary/20 border-primary text-primary'
                                        : 'bg-dark/50 border-white/10 text-soft-grey hover:bg-white/5'
                                        }`}
                                >
                                    <Users className="w-4 h-4" />
                                    <span>All Users</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, type: 'individual' }))}
                                    className={`p-3 rounded-lg flex items-center justify-center gap-2 border transition-all ${formData.type === 'individual'
                                        ? 'bg-primary/20 border-primary text-primary'
                                        : 'bg-dark/50 border-white/10 text-soft-grey hover:bg-white/5'
                                        }`}
                                >
                                    <User className="w-4 h-4" />
                                    <span>Individual</span>
                                </button>
                            </div>
                        </div>

                        {formData.type === 'individual' && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white">Target Users</label>
                                <div className="relative" ref={dropdownRef}>
                                    <div
                                        onClick={() => setShowDropdown(!showDropdown)}
                                        className="w-full px-4 py-3 bg-dark/50 border border-white/10 rounded-lg cursor-pointer flex items-center justify-between"
                                    >
                                        <span className="text-sm text-white">
                                            {formData.userIds.length > 0
                                                ? `${formData.userIds.length} user(s) selected`
                                                : 'Search and select users...'}
                                        </span>
                                        <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                                    </div>

                                    {showDropdown && (
                                        <div className="absolute z-10 w-full mt-1 bg-dark border border-white/10 rounded-lg shadow-lg max-h-64 overflow-hidden">
                                            <div className="p-2 border-b border-white/10">
                                                <input
                                                    type="text"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    placeholder="Search by email or name..."
                                                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded text-sm focus:outline-none focus:border-primary text-white placeholder-soft-grey"
                                                    onClick={(e) => e.stopPropagation()}
                                                />
                                            </div>
                                            <div className="max-h-48 overflow-y-auto">
                                                {filteredUsers.length > 0 ? (
                                                    filteredUsers.map(user => (
                                                        <div
                                                            key={user.id}
                                                            onClick={() => toggleUserSelection(user.id)}
                                                            className="px-4 py-2 hover:bg-white/5 cursor-pointer flex items-center gap-2"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={formData.userIds.includes(user.id)}
                                                                readOnly
                                                                className="w-4 h-4"
                                                            />
                                                            <span className="text-sm text-white">{user.email || user.id} {user.displayName ? `(${user.displayName})` : ''}</span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="px-4 py-2 text-sm text-soft-grey">No users found</div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                                {formData.userIds.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {formData.userIds.map(userId => {
                                            const user = users.find(u => u.id === userId);
                                            return (
                                                <span
                                                    key={userId}
                                                    className="px-2 py-1 bg-primary/20 text-primary rounded text-xs flex items-center gap-1"
                                                >
                                                    {user ? (user.email || user.displayName || userId) : userId}
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleUserSelection(userId)}
                                                        className="hover:text-white"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </span>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white">Title *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="E.g. New Tool Alert!"
                            className="w-full px-4 py-3 bg-dark/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white placeholder-soft-grey"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white">Message Body *</label>
                        <textarea
                            value={formData.body}
                            onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
                            placeholder="What do you want to tell your users?"
                            rows="4"
                            className="w-full px-4 py-3 bg-dark/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white placeholder-soft-grey resize-none"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white flex items-center gap-2">
                            <ImageIcon className="w-4 h-4 text-soft-grey" />
                            Image URL (Optional)
                        </label>
                        <input
                            type="url"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                            placeholder="https://example.com/image.png"
                            className="w-full px-4 py-3 bg-dark/50 border border-white/10 rounded-lg focus:outline-none focus:border-primary text-white placeholder-soft-grey"
                        />
                    </div>

                    <div className="pt-4 border-t border-white/10">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center justify-center w-full md:w-auto gap-2 px-8 py-3 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <Loader className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    <span>Send Notification</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NotificationManager;
