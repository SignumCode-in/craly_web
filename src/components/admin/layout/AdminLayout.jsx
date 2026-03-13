import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { authService } from '../../../api/authService';
import Sidebar from '../Sidebar';
import GlobalSearch from '../GlobalSearch';
import Breadcrumbs from './Breadcrumbs';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      authService.logout();
      navigate('/admin/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-dark flex">
      {/* Sidebar handles its own active state via pathname in the new architecture */}
      <Sidebar onLogout={handleLogout} />
      <main className="flex-[1] p-8 overflow-auto flex flex-col items-center">
        <div className="w-full justify-start items-start">
          <GlobalSearch />
          <Breadcrumbs />
        </div>
        <div className="w-full mt-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
