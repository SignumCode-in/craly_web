import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../api/authService';
import Sidebar from '../../components/admin/Sidebar';
import DashboardHome from '../../components/admin/DashboardHome';
import ToolsManager from '../../components/admin/ToolsManager';
import CategoriesManager from '../../components/admin/CategoriesManager';
import WorkflowsManager from '../../components/admin/WorkflowsManager';
import PostsManager from '../../components/admin/PostsManager';
import BannerManager from '../../components/admin/BannerManager';
import LegalNoticeManager from '../../components/admin/LegalNoticeManager';
import LandingPageManager from '../../components/admin/LandingPageManager';
import JsonUploadManager from '../../components/admin/JsonUploadManager';
import UsersManager from '../../components/admin/UsersManager';
import PartnersManager from '../../components/admin/PartnersManager';
import PromotionsManager from '../../components/admin/PromotionsManager';
import TagsManager from '../../components/admin/TagsManager';
import NotificationManager from '../../components/admin/NotificationManager';

import GlobalSearch from '../../components/admin/GlobalSearch';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      authService.logout();
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
      case 'banners':
        return <BannerManager />;
      case 'partners':
        return <PartnersManager />;
      case 'promotions':
        return <PromotionsManager />;
      case 'privacy':
        return <LegalNoticeManager />;
      case 'landing':
        return <LandingPageManager />;
      case 'json-upload':
        return <JsonUploadManager />;
      case 'users':
        return <UsersManager />;
      case 'tags':
        return <TagsManager />;
      case 'notifications':
        return <NotificationManager />;
      default:
        return <DashboardHome />;
    }
  };

  return (
    <div className="min-h-screen bg-dark flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      <main className="flex-[1] p-8 overflow-auto flex flex-col items-center">
        <div className="w-full justify-start items-start">
          <GlobalSearch onNavigate={setActiveTab} />
        </div>
        <div className="w-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

