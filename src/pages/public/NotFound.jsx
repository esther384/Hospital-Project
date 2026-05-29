import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 relative overflow-hidden bg-slate-50">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="text-center relative z-10">
        <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl flex items-center justify-center mx-auto mb-8 border border-slate-100">
          <HeartPulse className="h-12 w-12 text-secondary animate-pulse" />
        </div>
        
        <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary-light to-slate-200 tracking-tighter mb-4">
          404
        </h1>
        
        <h2 className="text-3xl font-extrabold text-primary mb-4 tracking-tight">
          Page Not Found
        </h2>
        
        <p className="text-slate-500 font-medium mb-10 max-w-md mx-auto leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable. Let's get you back on track.
        </p>
        
        <Link 
          to="/" 
          className="bg-primary hover:bg-primary-light text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 inline-flex items-center group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
