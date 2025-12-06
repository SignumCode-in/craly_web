import { LayoutDashboard, FolderTree, Tag, Workflow, FileText, LogOut } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tools', label: 'Tools Manager', icon: FolderTree },
    { id: 'categories', label: 'Categories', icon: Tag },
    { id: 'workflows', label: 'Workflows', icon: Workflow },
    { id: 'posts', label: 'Posts', icon: FileText }
  ];

  return (
    <aside className="w-64 bg-white/5 border-r border-white/10 p-6 flex flex-col">
      <div className="mb-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Craly Admin
        </h1>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === item.id
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'text-soft-grey hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <button
        onClick={onLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-soft-grey hover:bg-red-500/10 hover:text-red-400 transition-all mt-4"
      >
        <LogOut className="w-5 h-5" />
        <span className="font-medium">Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;

