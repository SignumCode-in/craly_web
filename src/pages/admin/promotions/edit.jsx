import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { promotionService } from '../../../api/promotionService';
import PromotionForm from '../../../components/admin/promotions/PromotionForm';
import { Loader } from 'lucide-react';

const EditPromotion = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [promotion, setPromotion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPromotion();
  }, [id]);

  const fetchPromotion = async () => {
    try {
      const allPromos = await promotionService.getAll();
      const foundPromo = allPromos.find(p => p._id === id || p.id === id);
      
      if (foundPromo) {
        setPromotion({
          ...foundPromo,
          partnerId: foundPromo.partnerId?._id || '',
          toolId: foundPromo.toolId?._id || foundPromo.toolId?.id || '',
          placementType: foundPromo.placementType || 'homepage',
          startDate: foundPromo.startDate ? new Date(foundPromo.startDate).toISOString().split('T')[0] : '',
          endDate: foundPromo.endDate ? new Date(foundPromo.endDate).toISOString().split('T')[0] : '',
          priority: foundPromo.priority || 0,
          isActive: foundPromo.isActive !== undefined ? foundPromo.isActive : true,
          targetCategories: foundPromo.targetCategories || [],
          targetTags: foundPromo.targetTags || [],
          targetCountries: foundPromo.targetCountries || [],
          impressions: foundPromo.impressions || 0,
          clicks: foundPromo.clicks || 0,
          amountPaid: foundPromo.amountPaid || 0,
          currency: foundPromo.currency || 'INR',
          media: {
            type: foundPromo.media?.type || 'image',
            url: foundPromo.media?.url || ''
          },
          customHeadline: foundPromo.customHeadline || '',
          showSponsoredLabel: foundPromo.showSponsoredLabel !== undefined ? foundPromo.showSponsoredLabel : true
        });
      } else {
        alert("Promotion not found");
        navigate('/admin/promotions');
      }
    } catch (error) {
      console.error('Error fetching promotion:', error);
      alert('Error fetching promotion details');
      navigate('/admin/promotions');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      await promotionService.update(id, formData);
      navigate('/admin/promotions');
    } catch (error) {
      console.error('Error updating promotion:', error);
      alert('Error updating promotion: ' + error.message);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader className="w-8 h-8 text-primary animate-spin" /></div>;
  }

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto bg-dark border border-white/10 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6">Edit Promotion</h2>
      {promotion && (
        <PromotionForm 
          initialData={promotion}
          onSubmit={handleSubmit} 
          onCancel={() => navigate('/admin/promotions')}
          submitText="Update Promotion"
          isEditing={true}
        />
      )}
    </div>
  );
};

export default EditPromotion;
