import { useNavigate } from 'react-router-dom';
import { promotionService } from '../../../api/promotionService';
import PromotionForm from '../../../components/admin/promotions/PromotionForm';

const AddPromotion = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await promotionService.create(formData);
      navigate('/admin/promotions');
    } catch (error) {
      console.error('Error creating promotion:', error);
      alert('Error creating promotion: ' + error.message);
    }
  };

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto bg-dark border border-white/10 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6">Create New Promotion</h2>
      <PromotionForm 
        onSubmit={handleSubmit} 
        onCancel={() => navigate('/admin/promotions')}
        submitText="Create Promotion"
      />
    </div>
  );
};

export default AddPromotion;
