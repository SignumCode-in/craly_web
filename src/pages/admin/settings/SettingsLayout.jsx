import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { User, Cpu, RefreshCw } from 'lucide-react';

const SettingsLayout = () => {
  const location = useLocation();
  
  const tabs = [
    { id: 'avatar', label: 'Avatars', icon: User, path: '/admin/settings/avatar' },
    { id: 'model', label: 'AI Models', icon: Cpu, path: '/admin/settings/model' },
    { id: 'app-update', label: 'App Updates', icon: RefreshCw, path: '/admin/settings/app-update' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <div className="flex border-b border-white/10 mb-6 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;
          return (
            <NavLink
              key={tab.id}
              to={tab.path}
              className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-transparent text-soft-grey hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </NavLink>
          );
        })}
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
        <Outlet />
      </div>
    </div>
  );
};

export default SettingsLayout;
