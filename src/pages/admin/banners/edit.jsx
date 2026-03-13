import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { bannerService } from '../../../api/bannerService';
import BannerForm from '../../../components/admin/banners/BannerForm';
import { Loader } from 'lucide-react';

const EditBanner = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanner();
  }, [id]);

  const fetchBanner = async () => {
    try {
      const allBanners = await bannerService.getAll();
      const foundBanner = allBanners.find(b => b.id === id || b.documentId === id);
      
      if (foundBanner) {
        setBanner({
          ...foundBanner,
          title: foundBanner.title || '',
          description: foundBanner.description || '',
          imageUrl: foundBanner.imageUrl || '',
          link: foundBanner.link || '',
          linkText: foundBanner.linkText || '',
          position: foundBanner.position || 'top',
          enabled: foundBanner.enabled !== undefined ? foundBanner.enabled : true,
          order: foundBanner.order || 0
        });
      } else {
        alert("Banner not found");
        navigate('/admin/banners');
      }
    } catch (error) {
      console.error('Error fetching banner:', error);
      alert('Error fetching banner details');
      navigate('/admin/banners');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      await bannerService.update(id, formData);
      navigate('/admin/banners');
    } catch (error) {
      console.error('Error updating banner:', error);
      alert('Error updating banner: ' + error.message);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader className="w-8 h-8 text-primary animate-spin" /></div>;
  }

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto bg-dark border border-white/10 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6">Edit Banner</h2>
      {banner && (
        <BannerForm 
          initialData={banner}
          onSubmit={handleSubmit} 
          onCancel={() => navigate('/admin/banners')}
          submitText="Update Banner"
          isEditing={true}
        />
      )}
    </div>
  );
};

export default EditBanner;
