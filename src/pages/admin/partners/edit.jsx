import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { partnerService } from '../../../api/partnerService';
import PartnerForm from '../../../components/admin/partners/PartnerForm';
import { Loader } from 'lucide-react';

const EditPartner = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPartner();
  }, [id]);

  const fetchPartner = async () => {
    try {
      const allPartners = await partnerService.getAll();
      const foundPartner = allPartners.find(p => p._id === id || p.id === id);
      
      if (foundPartner) {
        setPartner({
          ...foundPartner,
          name: foundPartner.name || '',
          contactPerson: foundPartner.contactPerson || '',
          email: foundPartner.email || '',
          phone: foundPartner.phone || '',
          status: foundPartner.status || 'active'
        });
      } else {
        alert("Partner not found");
        navigate('/admin/partners');
      }
    } catch (error) {
      console.error('Error fetching partner:', error);
      alert('Error fetching partner details');
      navigate('/admin/partners');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      await partnerService.update(id, formData);
      navigate('/admin/partners');
    } catch (error) {
      console.error('Error updating partner:', error);
      alert('Error updating partner: ' + error.message);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader className="w-8 h-8 text-primary animate-spin" /></div>;
  }

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto bg-dark border border-white/10 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6">Edit Partner</h2>
      {partner && (
        <PartnerForm 
          initialData={partner}
          onSubmit={handleSubmit} 
          onCancel={() => navigate('/admin/partners')}
          submitText="Update Partner"
          isEditing={true}
        />
      )}
    </div>
  );
};

export default EditPartner;
