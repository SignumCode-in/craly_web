import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  // If we are exactly at /admin or /admin/dashboard, we might just show "Admin Dashboard"
  // For other paths, we generate breadcrumbs dynamically
  if (pathnames.length <= 1) return null; // /admin or just generic route

  return (
    <nav className="flex items-center text-sm font-medium text-soft-grey mt-2 mb-4">
      <Link to="/admin/dashboard" className="flex items-center hover:text-white transition-colors">
        <Home className="w-4 h-4 mr-1" />
        Admin
      </Link>
      
      {pathnames.map((value, index) => {
        if (value === 'admin') return null; // Skip first 'admin' breadcrumb

        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        
        let label = value.charAt(0).toUpperCase() + value.slice(1);
        
        // Handle ID params if it's the last part and looks like an ID
        // (usually 24 chars mongoid) - we can just label it "Details" or similar, 
        // but for now, we'll try to display it cleanly or let it be.
        if (value.length > 20 && index === pathnames.length - 1) {
          label = "Details";
        }

        return (
          <div key={to} className="flex items-center">
            <ChevronRight className="w-4 h-4 mx-2" />
            {isLast ? (
              <span className="text-white bg-white/10 px-2 py-1 rounded">
                {label}
              </span>
            ) : (
              <Link to={to} className="hover:text-white transition-colors">
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
