import { useNavigate } from 'react-router-dom';
import { bannerService } from '../../../api/bannerService';
import BannerForm from '../../../components/admin/banners/BannerForm';

const AddBanner = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await bannerService.create(formData);
      navigate('/admin/banners');
    } catch (error) {
      console.error('Error creating banner:', error);
      alert('Error creating banner: ' + error.message);
    }
  };

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto bg-dark border border-white/10 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6">Create New Banner</h2>
      <BannerForm 
        onSubmit={handleSubmit} 
        onCancel={() => navigate('/admin/banners')}
        submitText="Create Banner"
      />
    </div>
  );
};

export default AddBanner;
