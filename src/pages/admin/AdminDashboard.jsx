import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase/config';
import Sidebar from '../../components/admin/Sidebar';
import DashboardHome from '../../components/admin/DashboardHome';
import ToolsManager from '../../components/admin/ToolsManager';
import CategoriesManager from '../../components/admin/CategoriesManager';
import WorkflowsManager from '../../components/admin/WorkflowsManager';
import PostsManager from '../../components/admin/PostsManager';
import PrivacyPolicyManager from '../../components/admin/PrivacyPolicyManager';
import LandingPageManager from '../../components/admin/LandingPageManager';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardHome />;
      case 'tools':
        return <ToolsManager />;
      case 'categories':
        return <CategoriesManager />;
      case 'workflows':
        return <WorkflowsManager />;
      case 'posts':
        return <PostsManager />;
      case 'privacy':
        return <PrivacyPolicyManager />;
      case 'landing':
        return <LandingPageManager />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="min-h-screen bg-dark flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      <main className="flex-1 p-8 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;

