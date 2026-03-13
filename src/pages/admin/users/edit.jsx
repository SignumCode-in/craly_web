import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { userService } from '../../../api/userService';
import UserForm from '../../../components/admin/users/UserForm';
import { Loader } from 'lucide-react';

const EditUser = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const allUsers = await userService.getAll();
      const foundUser = allUsers.find(u => u._id === id || u.id === id);
      
      if (foundUser) {
        setUser({
          ...foundUser,
          displayName: foundUser.displayName || '',
          email: foundUser.email || '',
          photoUrl: foundUser.photoUrl || '',
          heardFrom: foundUser.heardFrom || 'organic',
          interests: foundUser.interests || []
        });
      } else {
        alert("User not found");
        navigate('/admin/users');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      alert('Error fetching user details');
      navigate('/admin/users');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      await userService.update(id, formData);
      navigate('/admin/users');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user: ' + error.message);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8"><Loader className="w-8 h-8 text-primary animate-spin" /></div>;
  }

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto bg-dark border border-white/10 rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6">Edit User</h2>
      {user && (
        <UserForm 
          initialData={user}
          onSubmit={handleSubmit} 
          onCancel={() => navigate('/admin/users')}
          submitText="Update User"
          isEditing={true}
        />
      )}
    </div>
  );
};

export default EditUser;
