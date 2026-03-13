import { useNavigate } from 'react-router-dom';
import { userService } from '../../../api/userService';
import UserForm from '../../../components/admin/users/UserForm';

const AddUser = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      await userService.create(formData);
      navigate('/admin/users');
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Error creating user: ' + error.message);
    }
  };

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto bg-dark border border-white/10 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6">Create New User</h2>
      <UserForm 
        onSubmit={handleSubmit} 
        onCancel={() => navigate('/admin/users')}
        submitText="Create User"
      />
    </div>
  );
};

export default AddUser;
