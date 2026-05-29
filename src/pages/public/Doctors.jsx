import React, { useState, useEffect } from 'react';
import { Search, Filter, Stethoscope } from 'lucide-react';
import { getDoctors } from '../../services/firebaseServices';
import DoctorCard from '../../components/DoctorCard';

const Doctors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [doctorsData, setDoctorsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getDoctors();
        setDoctorsData(data);
      } catch (error) {
        console.error("Failed to fetch doctors", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // Extract unique specialties
  const specialties = ['All', ...new Set(doctorsData.map(doc => doc.specialty))];

  // Filter logic
  const filteredDoctors = doctorsData.filter(doctor => {
    const name = doctor?.name || '';
    const bio = doctor?.bio || '';
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          bio.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' || doctor?.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Find Your Specialist</h1>
          <p className="text-lg text-gray-600">
            Browse through our directory of experienced medical professionals to find the perfect specialist for your healthcare needs.
          </p>
        </div>

        {/* Search & Filter Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-12 border border-gray-100 flex flex-col md:flex-row gap-6 items-center">
          
          <div className="relative flex-grow w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-11 pr-4 py-3 border-gray-200 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-gray-800 outline-none"
              placeholder="Search doctors by name or expertise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="block w-full pl-11 pr-10 py-3 border-gray-200 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-colors appearance-none outline-none text-gray-800"
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
            >
              {specialties.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : filteredDoctors.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDoctors.map(doctor => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="mx-auto w-20 h-20 bg-slate-50 text-primary rounded-full flex items-center justify-center mb-6">
              <Stethoscope className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-500">We couldn't find any specialists matching your current search criteria.</p>
            <button 
              onClick={() => {setSearchTerm(''); setSelectedSpecialty('All');}}
              className="mt-6 text-primary font-medium hover:text-primary-dark transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default Doctors;
