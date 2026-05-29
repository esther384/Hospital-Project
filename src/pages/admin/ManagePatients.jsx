import React, { useState, useEffect } from 'react';
import { Search, User, Filter } from 'lucide-react';
import { getPatients } from '../../services/firebaseServices';

const ManagePatients = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPts = async () => {
      try {
        const data = await getPatients();
        setPatients(data);
      } catch (error) {
        console.error("Fetch patients failed", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPts();
  }, []);

  const filteredPatients = patients.filter(patient => 
    (patient.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (patient.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Patients</h1>
          <p className="text-gray-600 mt-1">View and manage registered patients</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4">
          <div className="relative max-w-md flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              placeholder="Search by patient name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading patients...</div>
          ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 border-b border-gray-200 text-sm uppercase tracking-wider">
                <th className="p-4 font-medium">Patient Info</th>
                <th className="p-4 font-medium">Contact</th>
                <th className="p-4 font-medium">Joined Date</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-blue-100 text-primary flex items-center justify-center font-bold uppercase">
                        {(patient.name || 'P').charAt(0)}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{patient.name || 'Unnamed Patient'}</div>
                        <div className="text-sm text-gray-500">ID: ...{patient.id.slice(-4)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="text-sm text-gray-900">{patient.email}</div>
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {patient.createdAt ? new Date(patient.createdAt).toLocaleDateString() : 'Unknown'}
                  </td>
                  <td className="p-4 text-right text-sm font-medium gap-2 flex justify-end">
                    <button className="text-primary hover:text-primary-dark mr-3 text-sm flex items-center">
                      <User className="w-4 h-4 mr-1" /> View Profile
                    </button>
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

export default ManagePatients;
