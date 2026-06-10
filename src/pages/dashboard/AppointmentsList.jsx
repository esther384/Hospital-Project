import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, XCircle, CheckCircle2 } from 'lucide-react';
import { getAppointmentsByPatientId, updateAppointmentStatus, getDoctors } from '../../services/firebaseServices';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal';

const AppointmentCard = ({ appointment, onCancel, doctorsData }) => {
  const doctor = doctorsData.find(d => d.id === appointment.doctorId);
  const isUpcoming = appointment.status?.toLowerCase() === 'upcoming';

  // Render even if doctor data isn't loaded yet
  const doctorName = doctor?.name || appointment.doctorName || 'Unknown Doctor';
  const doctorSpecialty = doctor?.specialty || '';
  const doctorImage = doctor?.imageUrl || doctor?.image || `https://i.pravatar.cc/80?u=${appointment.doctorId}`;

  return (
    <div className={`bg-white rounded-2xl shadow-sm border p-6 flex flex-col md:flex-row gap-6 ${isUpcoming ? 'border-primary/30 shadow-primary/5' : 'border-gray-100'}`}>
      <div className="flex-shrink-0">
        <img 
          src={doctorImage} 
          alt={doctorName} 
          className="w-20 h-20 rounded-xl object-cover"
        />
      </div>
      
      <div className="flex-grow flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{doctorName}</h3>
              <p className="text-primary font-medium">{doctorSpecialty}</p>
            </div>
            <div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize flex items-center ${
                isUpcoming ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
              }`}>
                {isUpcoming ? <Clock className="w-3 h-3 mr-1" /> : <CheckCircle2 className="w-3 h-3 mr-1" />}
                {appointment.status}
              </span>
            </div>
          </div>
          <p className="text-gray-500 text-sm mt-2">{appointment.reason}</p>
        </div>
        
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center text-sm font-medium text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg">
            <Calendar className="w-4 h-4 mr-2 text-gray-500" />
            {appointment.date}
          </div>
          <div className="flex items-center text-sm font-medium text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg">
            <Clock className="w-4 h-4 mr-2 text-gray-500" />
            {appointment.time}
          </div>
          <div className="flex items-center text-sm font-medium text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg">
            <MapPin className="w-4 h-4 mr-2 text-gray-500" />
            ApexCare Medical Centre, Lagos
          </div>
        </div>
      </div>
      
      {isUpcoming && (
        <div className="flex flex-col justify-center border-l md:border-l border-gray-100 pl-0 md:pl-6 pt-4 md:pt-0 mt-4 md:mt-0 border-t md:border-t-0">
          <button 
            onClick={() => onCancel(appointment.id)}
            className="flex items-center justify-center text-red-500 hover:text-white hover:bg-red-500 border border-red-200 hover:border-red-500 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            <XCircle className="w-4 h-4 mr-2" />
            Cancel 
          </button>
        </div>
      )}
    </div>
  );
};

const AppointmentsList = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [doctorsData, setDoctorsData] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({ open: false, appointmentId: null });

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const [apps, docs] = await Promise.all([
          getAppointmentsByPatientId(user.uid),
          getDoctors()
        ]);
        setAppointments(apps);
        setDoctorsData(docs);
      } catch (error) {
        console.error("Failed to load data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const cancelAppointment = (id) => {
    setConfirmModal({ open: true, appointmentId: id });
  };

  const handleConfirmCancel = async () => {
    try {
      await updateAppointmentStatus(confirmModal.appointmentId, 'Cancelled');
      setAppointments(appointments.map(app =>
        app.id === confirmModal.appointmentId ? { ...app, status: 'Cancelled' } : app
      ));
    } catch (error) {
      console.error("Error cancelling", error);
    } finally {
      setConfirmModal({ open: false, appointmentId: null });
    }
  };

  const filteredAppointments = appointments.filter(app => {
    if (filter === 'all') return true;
    return app.status.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="max-w-4xl mx-auto">
      <Modal
        open={confirmModal.open}
        type="confirm"
        title="Cancel Appointment?"
        message="Are you sure you want to cancel this appointment? This cannot be undone."
        confirmText="Yes, Cancel"
        cancelText="Keep"
        onClose={() => setConfirmModal({ open: false, appointmentId: null })}
        onConfirm={handleConfirmCancel}
      />
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Appointments</h1>
          <p className="text-gray-600 mt-1">View and manage your medical appointments</p>
        </div>
        
        <div className="inline-flex bg-gray-100 p-1 rounded-xl">
          <button 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
             className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'upcoming' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setFilter('upcoming')}
          >
            Upcoming
          </button>
          <button 
             className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'completed' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setFilter('completed')}
          >
            Past
          </button>
        </div>
      </div>

      {filteredAppointments.length > 0 ? (
        <div className="space-y-6">
          {filteredAppointments.map(appointment => (
            <AppointmentCard 
              key={appointment.id} 
              appointment={appointment} 
              onCancel={cancelAppointment}
              doctorsData={doctorsData}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No appointments found</h3>
          <p className="text-gray-500">You don't have any {filter !== 'all' ? filter : ''} appointments to display.</p>
        </div>
      )}
    </div>
  );
};

export default AppointmentsList;
