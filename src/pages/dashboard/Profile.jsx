import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Phone, MapPin, Shield } from 'lucide-react';
import Modal from '../../components/Modal';

const Profile = () => {
  const { user, updateUserProfileDocs } = useAuth();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || 'patient@example.com',
    phone: '+234 801 234 5678',
    address: '12 Adeola Odeku St, Victoria Island, Lagos 101241',
    dateOfBirth: '1990-05-15',
    bloodGroup: 'O+',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [modal, setModal] = useState({ open: false, type: 'info', title: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUserProfileDocs({
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        dateOfBirth: formData.dateOfBirth,
        bloodGroup: formData.bloodGroup
      });
      setIsEditing(false);
      setModal({ open: true, type: 'success', title: 'Profile Updated', message: 'Your profile has been updated successfully.' });
    } catch (error) {
      setModal({ open: true, type: 'error', title: 'Update Failed', message: 'Failed to update profile: ' + error.message });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Modal
        open={modal.open}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={() => setModal({ open: false, type: 'info', title: '', message: '' })}
      />
      <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-1">Manage your personal information and preferences</p>
        </div>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className="self-start sm:self-auto bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Header Cover */}
        <div className="h-32 bg-gradient-to-r from-primary to-blue-600 relative">
          <div className="absolute -bottom-16 left-8">
            <div className="w-32 h-32 bg-white rounded-full p-2 shadow-lg">
              <div className="w-full h-full bg-blue-100 rounded-full flex items-center justify-center text-primary border-4 border-white">
                <User className="w-12 h-12" />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-20 px-4 sm:px-8 pb-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8">
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Personal Information</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          disabled={!isEditing}
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        disabled={!isEditing}
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
                      <select
                        name="bloodGroup"
                        disabled={!isEditing}
                        value={formData.bloodGroup}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500 appearance-none"
                      >
                        {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 border-b pb-2 mb-4">Contact Details</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          disabled={!isEditing}
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="phone"
                          disabled={!isEditing}
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="address"
                          disabled={!isEditing}
                          value={formData.address}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {isEditing && (
              <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-8 rounded-lg shadow-md transition-colors flex items-center justify-center"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>

      </div>
    </div>
  );
};

export default Profile;
