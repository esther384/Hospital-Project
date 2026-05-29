import React, { useState, useEffect } from 'react';
import { Users, Activity, Calendar, DollarSign, TrendingUp, MoreVertical, HeartPulse } from 'lucide-react';
import { getDoctors, getAppointments, getPatients } from '../../services/firebaseServices';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    doctors: 0,
    appointments: 0,
    patients: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [docs, apps, pts] = await Promise.all([
          getDoctors(),
          getAppointments(),
          getPatients()
        ]);
        setStats({
          doctors: docs.length,
          appointments: apps.length,
          patients: pts.length
        });
      } catch (error) {
        console.error("Failed to load admin stats", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto pb-10">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-extrabold text-primary tracking-tight mb-2 flex items-center">
            <HeartPulse className="w-8 h-8 mr-3 text-secondary" />
            Admin Operations
          </h1>
          <p className="text-slate-500 font-medium">Overview of hospital operations and statistics</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-white border border-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">Export Report</button>
          <button className="bg-primary hover:bg-primary-light text-white font-bold px-4 py-2 rounded-xl transition-colors shadow-md">New Doctor</button>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-10 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        {[
          { title: 'Total Patients', value: stats.patients, icon: <Users className="w-6 h-6" />, color: 'text-primary bg-primary/10', trend: '+12%' },
          { title: 'Total Doctors', value: stats.doctors, icon: <Activity className="w-6 h-6" />, color: 'text-secondary bg-secondary/10', trend: '+2' },
          { title: 'Appointments', value: stats.appointments, icon: <Calendar className="w-6 h-6" />, color: 'text-accent bg-accent/10', trend: '+5%' },
          { title: 'Revenue', value: '$45.2k', icon: <DollarSign className="w-6 h-6" />, color: 'text-emerald-500 bg-emerald-50', trend: '+18%' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[1.5rem] shadow-sm hover:shadow-lg transition-shadow border border-slate-100 group">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-sm font-bold text-slate-400 mb-1">{stat.title}</p>
                <h3 className="text-3xl font-extrabold text-primary">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-2xl ${stat.color} group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
            </div>
            <div className="flex items-center text-sm font-medium">
              <TrendingUp className="w-4 h-4 text-emerald-500 mr-1" />
              <span className="text-emerald-500">{stat.trend}</span>
              <span className="text-slate-400 ml-2">from last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        {/* Recent Appointments */}
        <div className="lg:col-span-2 bg-white rounded-[1.5rem] shadow-sm border border-slate-100 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <h2 className="text-xl font-bold text-primary">Recent Appointments</h2>
            <button className="text-secondary font-bold text-sm hover:text-secondary-dark">View All</button>
          </div>
          <div className="overflow-x-auto p-2">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100">
                  <th className="px-6 py-4 font-bold">Patient</th>
                  <th className="px-6 py-4 font-bold">Doctor</th>
                  <th className="px-6 py-4 font-bold">Date & Time</th>
                  <th className="px-6 py-4 font-bold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium">
                {[
                  { p: 'Alice Smith', d: 'Dr. Sarah Jenkins', time: 'Today, 10:00 AM', status: 'Pending' },
                  { p: 'Bob Johnson', d: 'Dr. Mark Thorne', time: 'Today, 11:30 AM', status: 'Completed' },
                  { p: 'Charlie Brown', d: 'Dr. Emily Chen', time: 'Tomorrow, 09:00 AM', status: 'Cancelled' },
                  { p: 'Diana Prince', d: 'Dr. Rajesh Gupta', time: 'Tomorrow, 02:00 PM', status: 'Pending' },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 text-primary font-bold">{row.p}</td>
                    <td className="px-6 py-4 text-slate-500">{row.d}</td>
                    <td className="px-6 py-4 text-slate-500">{row.time}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center justify-center px-3 py-1 rounded-lg text-xs font-bold ${
                        row.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' :
                        row.status === 'Cancelled' ? 'bg-rose-50 text-rose-600' :
                        'bg-amber-50 text-amber-600'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Hospital Staff summary */}
        <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 flex flex-col">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <h2 className="text-xl font-bold text-primary">Top Doctors</h2>
            <button className="text-slate-400 hover:text-primary"><MoreVertical className="w-5 h-5" /></button>
          </div>
          <div className="p-6 space-y-6">
            {[
              { name: 'Dr. Sarah Jenkins', spec: 'Cardiology', img: 'https://i.pravatar.cc/150?img=5' },
              { name: 'Dr. Michael Chen', spec: 'Neurology', img: 'https://i.pravatar.cc/150?img=11' },
              { name: 'Dr. Emily Carter', spec: 'Pediatrics', img: 'https://i.pravatar.cc/150?img=9' }
            ].map((doc, i) => (
              <div key={i} className="flex items-center space-x-4">
                <img src={doc.img} alt={doc.name} className="w-12 h-12 rounded-xl object-cover border-2 border-slate-100" />
                <div className="flex-1">
                  <p className="font-bold text-primary">{doc.name}</p>
                  <p className="text-xs font-medium text-slate-500">{doc.spec}</p>
                </div>
                <button className="p-2 text-slate-400 hover:text-secondary transition-colors rounded-lg hover:bg-secondary/10">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            <button className="w-full mt-4 py-3 border-2 border-dashed border-slate-200 text-slate-500 font-bold rounded-xl hover:border-secondary hover:text-secondary transition-colors">
              Manage All Staff
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Temp fix for ChevronRight
import { ChevronRight } from 'lucide-react';
export default AdminDashboard;
