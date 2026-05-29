import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';
import { getDoctors, addDoctor, deleteDoctor, updateDoctor } from '../../services/firebaseServices';

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Quick Mock State for Adding a new Doctor inline.
  // In a real prod app, use a Modal with a structured form
  const [newDoctorName, setNewDoctorName] = useState('');

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const data = await getDoctors();
        setDoctors(data);
      } catch (error) {
        console.error("Fetch doctors failed", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocs();
  }, []);

  const handleCreate = async () => {
    if (!newDoctorName) return;
    try {
      const data = {
        name: newDoctorName,
        specialty: 'General Practitioner',
        experience: '1 year',
        rating: 5.0,
        reviews: 0,
        image: 'https://images.unsplash.com/photo-1612349317150-e410f624c427?auto=format&fit=crop&q=80&w=300&h=300',
        availability: ['Mon', 'Wed']
      };
      const created = await addDoctor(data);
      setDoctors([...doctors, created]);
      setNewDoctorName('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await deleteDoctor(id);
        setDoctors(doctors.filter(d => d.id !== id));
      } catch (error) {
        console.error("Delete failed", error);
      }
    }
  };

  const filteredDoctors = doctors.filter(doctor => 
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Doctors</h1>
          <p className="text-gray-600 mt-1">Add, edit, or remove doctors from the directory</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between gap-4">
          <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto">
             <input
              type="text"
              placeholder="New Doctor Name"
              className="border border-gray-200 rounded-lg bg-gray-50 px-3 py-2 outline-none w-full md:w-auto"
              value={newDoctorName}
              onChange={e => setNewDoctorName(e.target.value)}
             />
             <button onClick={handleCreate} className="flex items-center justify-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors whitespace-nowrap">
               <Plus className="w-5 h-5 mr-2" />
               Add
             </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading Doctors...</div>
          ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 border-b border-gray-200 text-sm uppercase tracking-wider">
                <th className="p-4 font-medium">Doctor</th>
                <th className="p-4 font-medium">Specialty</th>
                <th className="p-4 font-medium">Experience</th>
                <th className="p-4 font-medium">Rating</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDoctors.map((doctor) => (
                <tr key={doctor.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 flex items-center">
                    <img src={doctor.image} alt={doctor.name} className="w-10 h-10 rounded-full object-cover mr-4" />
                    <div>
                      <div className="font-semibold text-gray-900">{doctor.name}</div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{doctor.specialty}</td>
                  <td className="p-4 text-gray-600">{doctor.experience}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md text-xs font-bold w-max">
                      ★ {doctor.rating}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 text-gray-400">
                      <button className="hover:text-primary transition-colors p-1" title="Edit">
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(doctor.id)} className="hover:text-red-500 transition-colors p-1" title="Delete">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageDoctors;
