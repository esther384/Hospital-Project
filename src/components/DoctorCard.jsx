import React, { useState } from 'react';
import { Calendar, Clock, Award, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const DOC_IMAGES = {
  'doc1': 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=500&q=80',
  'doc2': 'https://images.unsplash.com/photo-1612349317150-e410f624c427?auto=format&fit=crop&w=500&q=80',
  'doc3': 'https://images.unsplash.com/photo-1594824436998-d8ac6134b223?auto=format&fit=crop&w=500&q=80',
  'doc4': 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=500&q=80'
};

const DoctorCard = ({ doctor }) => {
  const reliableImage = DOC_IMAGES[doctor.id] || doctor.image || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=500&q=80';
  const [imgSrc, setImgSrc] = useState(reliableImage);

  return (
    <div className="bg-white rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden group border border-slate-100 flex flex-col h-full transform hover:-translate-y-2 relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-bl-[100px] pointer-events-none transition-all duration-500 group-hover:scale-110"></div>
      
      <div className="relative h-72 overflow-hidden bg-slate-50 flex items-center justify-center p-2 rounded-t-[2rem]">
        <img 
          src={imgSrc} 
          alt={doctor.name || 'Doctor'} 
          onError={() => {
            setImgSrc(`https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name || 'Doctor')}&background=0f172a&color=06b6d4&size=512`);
          }}
          className="w-full h-full object-cover object-top rounded-[1.5rem] transition-transform duration-700 group-hover:scale-105"
        />

        <div className="absolute top-6 right-6 glass px-4 py-1.5 rounded-full text-xs font-bold text-primary shadow-sm z-10 flex items-center">
          <span className="w-1.5 h-1.5 rounded-full bg-secondary mr-2"></span>
          {doctor.specialty}
        </div>
      </div>
      
      <div className="p-8 flex flex-col flex-grow relative z-10">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-2xl font-bold text-primary group-hover:text-secondary-dark transition-colors">{doctor.name || 'Dr. Unknown Specialist'}</h3>
          <div className="flex items-center text-amber-400 bg-amber-50 px-2 py-1 rounded-lg">
            <Star className="w-3.5 h-3.5 fill-current mr-1" />
            <span className="text-xs font-bold text-slate-700">4.9</span>
          </div>
        </div>
        
        <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed font-medium">{doctor.bio || 'Experienced medical professional dedicated to providing the best care for patients.'}</p>
        
        <div className="space-y-3 mt-auto pt-5 border-t border-slate-100">
          <div className="flex items-center text-sm text-slate-600 font-medium">
            <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center mr-3">
              <Award className="w-4 h-4 text-secondary" />
            </div>
            <span>{doctor.experience} Experience</span>
          </div>
          <div className="flex items-center text-sm text-slate-600 font-medium">
            <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center mr-3">
              <Calendar className="w-4 h-4 text-secondary" />
            </div>
            <span>{doctor.availability}</span>
          </div>
        </div>
        
        <Link 
          to={`/doctors/${doctor.id}`}
          className="mt-8 flex items-center justify-center w-full bg-slate-50 border border-slate-200 group-hover:bg-primary group-hover:border-primary text-primary group-hover:text-white font-bold py-3.5 rounded-xl transition-all duration-300 group/btn"
        >
          View Profile
          <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

export default DoctorCard;
