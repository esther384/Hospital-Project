import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Award, Clock, Star } from 'lucide-react';
import { getDoctorById } from '../../services/firebaseServices';
import { useAuth } from '../../context/AuthContext';

const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const data = await getDoctorById(id);
        setDoctor(data);
      } catch (error) {
        console.error("Error fetching doctor", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDoc();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading profile...</div>;
  }

  if (!doctor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Doctor Not Found</h2>
        <Link to="/doctors" className="flex items-center text-primary font-medium hover:text-primary-dark transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Doctor Directory
        </Link>
      </div>
    );
  }

  const handleBooking = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/dashboard/book', { state: { doctorId: doctor.id } });
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link to="/doctors" className="inline-flex items-center text-gray-500 hover:text-primary mb-8 font-medium transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Directory
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid md:grid-cols-3 gap-0">
            <div className="h-64 md:h-auto relative bg-blue-50">
              <img 
                src={doctor.image} 
                alt={doctor.name} 
                className="w-full h-full object-cover object-top"
              />
            </div>
            
            <div className="p-8 md:col-span-2 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{doctor.name}</h1>
                  <p className="text-primary font-medium mt-1">{doctor.specialty}</p>
                </div>
                <div className="flex items-center bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
                  <Star className="w-4 h-4 mr-1 fill-current" />
                  4.9
                </div>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center text-gray-600">
                  <Award className="w-5 h-5 mr-3 text-primary/70" />
                  <span>{doctor.experience} of Clinical Experience</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-5 h-5 mr-3 text-primary/70" />
                  <span>{doctor.availability}</span>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">About Doctor</h3>
                <p className="text-gray-600 leading-relaxed">
                  {doctor.bio}
                  <br /><br />
                  Highly regarded as a leader in {doctor.specialty.toLowerCase()}, offering patients personalized care.
                </p>
              </div>
              
              <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleBooking}
                  className="flex-1 bg-primary text-white hover:bg-primary-dark font-medium py-3 rounded-xl flex items-center justify-center transition-colors shadow-md shadow-primary/20"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DoctorDetails;
