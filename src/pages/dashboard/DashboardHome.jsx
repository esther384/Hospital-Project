import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, Activity, FileText, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardHome = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10 animate-fade-in-up">
        <h1 className="text-3xl font-extrabold text-primary tracking-tight mb-2">Patient Dashboard</h1>
        <p className="text-slate-500 font-medium">Welcome back, <span className="text-secondary font-bold">{user?.name || 'Guest'}</span>! Here is your health overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="bg-white p-6 rounded-[1.5rem] shadow-sm hover:shadow-lg transition-shadow border border-slate-100 flex items-center space-x-5 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/5 rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-500"></div>
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 mb-1">Upcoming Appointments</p>
            <p className="text-3xl font-extrabold text-primary">0</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-[1.5rem] shadow-sm hover:shadow-lg transition-shadow border border-slate-100 flex items-center space-x-5 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-secondary/5 rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-500"></div>
          <div className="w-14 h-14 rounded-2xl bg-secondary/10 text-secondary-dark flex items-center justify-center shrink-0">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 mb-1">Past Visits</p>
            <p className="text-3xl font-extrabold text-primary">3</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-[1.5rem] shadow-sm hover:shadow-lg transition-shadow border border-slate-100 flex items-center space-x-5 relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-accent/5 rounded-full pointer-events-none group-hover:scale-150 transition-transform duration-500"></div>
          <div className="w-14 h-14 rounded-2xl bg-accent/10 text-accent flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 mb-1">Medical Reports</p>
            <p className="text-3xl font-extrabold text-primary">12</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        {/* Next Appointment */}
        <div className="bg-white rounded-[1.5rem] shadow-sm hover:shadow-md transition-shadow border border-slate-100 flex flex-col">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h2 className="text-xl font-bold text-primary flex items-center">
              <span className="w-2 h-2 bg-secondary rounded-full mr-2"></span>
              Next Appointment
            </h2>
          </div>
          <div className="p-8 flex-grow flex flex-col items-center justify-center text-center bg-slate-50/50 rounded-b-[1.5rem]">
            <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-slate-300">
              <Clock className="w-8 h-8" />
            </div>
            <p className="text-slate-500 font-medium mb-6">You don't have any upcoming appointments scheduled at the moment.</p>
            <Link 
              to="/dashboard/book" 
              className="inline-flex items-center bg-primary hover:bg-primary-light text-white font-bold px-8 py-3 rounded-xl transition-all shadow-md hover:-translate-y-0.5 group"
            >
              Book Appointment
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-[1.5rem] shadow-sm hover:shadow-md transition-shadow border border-slate-100">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h2 className="text-xl font-bold text-primary flex items-center">
              <span className="w-2 h-2 bg-secondary rounded-full mr-2"></span>
              Recent Activity
            </h2>
          </div>
          <div className="p-6 space-y-6">
            {[
              { title: 'Blood Test Results Available', date: '2 days ago', icon: <FileText className="w-5 h-5" />, color: 'text-secondary bg-secondary/10' },
              { title: 'Routine Checkup Completed', date: '1 month ago', icon: <Activity className="w-5 h-5" />, color: 'text-primary bg-primary/10' },
              { title: 'Prescription Renewed', date: '2 months ago', icon: <FileText className="w-5 h-5" />, color: 'text-accent bg-accent/10' }
            ].map((activity, idx) => (
              <div key={idx} className="flex items-start space-x-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${activity.color}`}>
                  {activity.icon}
                </div>
                <div>
                  <p className="font-bold text-primary mb-0.5">{activity.title}</p>
                  <p className="text-xs font-medium text-slate-400">{activity.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
