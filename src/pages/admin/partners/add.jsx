import { useNavigate } from 'react-router-dom';
import { partnerService } from '../../../api/partnerService';
import PartnerForm from '../../../components/admin/partners/PartnerForm';

const AddPartner = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await partnerService.create(formData);
      navigate('/admin/partners');
    } catch (error) {
      console.error('Error creating partner:', error);
      alert('Error creating partner: ' + error.message);
    }
  };

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto bg-dark border border-white/10 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6">Create New Partner</h2>
      <PartnerForm 
        onSubmit={handleSubmit} 
        onCancel={() => navigate('/admin/partners')}
        submitText="Create Partner"
      />
    </div>
  );
};

export default AddPartner;
