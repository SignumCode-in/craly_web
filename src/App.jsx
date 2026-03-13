import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LegalNotice from './pages/LegalNotice';
import AdminAuth from './pages/admin/AdminAuth';
import AdminLayout from './components/admin/layout/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Import Admin Dashboard Modules
import DashboardHome from './components/admin/DashboardHome';
import ToolsIndex from './pages/admin/tools/index';
import AddTool from './pages/admin/tools/add';
import EditTool from './pages/admin/tools/edit';
import CategoriesIndex from './pages/admin/categories/index';
import AddCategory from './pages/admin/categories/add';
import EditCategory from './pages/admin/categories/edit';
import WorkflowsIndex from './pages/admin/workflows/index';
import AddWorkflow from './pages/admin/workflows/add';
import EditWorkflow from './pages/admin/workflows/edit';
import PostsIndex from './pages/admin/posts/index';
import AddPost from './pages/admin/posts/add';
import EditPost from './pages/admin/posts/edit';
import BannersIndex from './pages/admin/banners/index';
import AddBanner from './pages/admin/banners/add';
import EditBanner from './pages/admin/banners/edit';
import PartnersIndex from './pages/admin/partners/index';
import AddPartner from './pages/admin/partners/add';
import EditPartner from './pages/admin/partners/edit';
import PromotionsIndex from './pages/admin/promotions/index';
import AddPromotion from './pages/admin/promotions/add';
import EditPromotion from './pages/admin/promotions/edit';
import UsersIndex from './pages/admin/users/index';
import AddUser from './pages/admin/users/add';
import EditUser from './pages/admin/users/edit';
import LegalNoticeManager from './components/admin/LegalNoticeManager';
import LandingPageManager from './components/admin/LandingPageManager';
import JsonUploadManager from './components/admin/JsonUploadManager';
import TagsManager from './components/admin/TagsManager';
import NotificationManager from './components/admin/NotificationManager';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/privacy" element={<LegalNotice />} />
        <Route path="/admin/auth" element={<AdminAuth />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardHome />} />
          
          <Route path="tools" element={<ToolsIndex />} />
          <Route path="tools/add" element={<AddTool />} />
          <Route path="tools/edit/:id" element={<EditTool />} />

          <Route path="categories" element={<CategoriesIndex />} />
          <Route path="categories/add" element={<AddCategory />} />
          <Route path="categories/edit/:id" element={<EditCategory />} />

          <Route path="workflows" element={<WorkflowsIndex />} />
          <Route path="workflows/add" element={<AddWorkflow />} />
          <Route path="workflows/edit/:id" element={<EditWorkflow />} />

          <Route path="posts" element={<PostsIndex />} />
          <Route path="posts/add" element={<AddPost />} />
          <Route path="posts/edit/:id" element={<EditPost />} />

          <Route path="banners" element={<BannersIndex />} />
          <Route path="banners/add" element={<AddBanner />} />
          <Route path="banners/edit/:id" element={<EditBanner />} />

          <Route path="partners" element={<PartnersIndex />} />
          <Route path="partners/add" element={<AddPartner />} />
          <Route path="partners/edit/:id" element={<EditPartner />} />

          <Route path="promotions" element={<PromotionsIndex />} />
          <Route path="promotions/add" element={<AddPromotion />} />
          <Route path="promotions/edit/:id" element={<EditPromotion />} />

          <Route path="users" element={<UsersIndex />} />
          <Route path="users/add" element={<AddUser />} />
          <Route path="users/edit/:id" element={<EditUser />} />

          {/* Legacy Components mapped to paths temporarily, until their index/add/edit pages are built */}
          <Route path="privacy/*" element={<LegalNoticeManager />} />
          <Route path="landing/*" element={<LandingPageManager />} />
          <Route path="json-upload/*" element={<JsonUploadManager />} />
          <Route path="tags/*" element={<TagsManager />} />
          <Route path="notifications/*" element={<NotificationManager />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
