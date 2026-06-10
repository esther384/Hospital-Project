import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, Clock, User } from 'lucide-react';
import { getDoctors, createAppointment } from '../../services/firebaseServices';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal';

const BookAppointment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedDoctor, setSelectedDoctor] = useState(location.state?.doctorId || '');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  const [doctorsData, setDoctorsData] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modal, setModal] = useState({ open: false, type: 'info', title: '', message: '' });

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await getDoctors();
        setDoctorsData(data);
      } catch (error) {
        console.error("Failed to fetch doctors", error);
      } finally {
        setLoadingDocs(false);
      }
    };
    fetchDoctors();
  }, []);

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', 
    '11:00 AM', '11:30 AM', '01:00 PM', '01:30 PM',
    '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    // time slot is not a form input so validate manually
    if (!time) {
      setModal({ open: true, type: 'warning', title: 'Select a Time', message: 'Please pick a time slot before confirming your booking.' });
      return;
    }

    const selectedDocData = doctorsData.find(d => d.id === selectedDoctor);
    const doctorName = selectedDocData?.name || 'Unknown Doctor';
    const doctorSpecialty = selectedDocData?.specialty || '';
    
    // Safe, cross-browser parsing of date ("YYYY-MM-DD") and time ("HH:MM AM/PM")
    let scheduledAt = new Date();
    if (date) {
      const dateParts = date.split('-');
      if (dateParts.length === 3) {
        const year = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10) - 1; // 0-indexed month
        const day = parseInt(dateParts[2], 10);
        
        let hours = 9;
        let minutes = 0;
        if (time) {
          const timeParts = time.split(' ');
          if (timeParts.length === 2) {
            const hm = timeParts[0].split(':');
            if (hm.length === 2) {
              hours = parseInt(hm[0], 10);
              minutes = parseInt(hm[1], 10);
              const modifier = timeParts[1];
              if (modifier === 'PM' && hours < 12) {
                hours += 12;
              } else if (modifier === 'AM' && hours === 12) {
                hours = 0;
              }
            }
          }
        }
        
        const parsedDate = new Date(year, month, day, hours, minutes);
        if (!isNaN(parsedDate.getTime())) {
          scheduledAt = parsedDate;
        }
      }
    }

    setSubmitting(true);
    try {
      await createAppointment({
        patientId: user.uid,
        userId: user.uid,          // used by admin snapshot queries
        patientName: user.name || user.displayName || user.email || 'Anonymous',
        doctorId: selectedDoctor,
        doctorName,
        doctorSpecialty,
        date,
        time,
        scheduledAt: scheduledAt,
        reason: reason || '',
        status: 'Upcoming',
        createdAt: new Date(),
      });
      setModal({
        open: true,
        type: 'success',
        title: 'Appointment Booked!',
        message: 'Your appointment has been requested successfully.',
      });
    } catch (error) {
      console.error(error);
      setModal({
        open: true,
        type: 'error',
        title: 'Booking Failed',
        message: 'Failed to book appointment. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleModalClose = () => {
    const wasSuccess = modal.type === 'success';
    setModal({ open: false, type: 'info', title: '', message: '' });
    if (wasSuccess) navigate('/dashboard/appointments');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Modal
        open={modal.open}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={handleModalClose}
      />

      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Book Appointment</h1>
        <p className="text-gray-600 mt-1">Schedule a visit with one of our specialists</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <form onSubmit={handleSubmit} className="p-4 sm:p-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Doctor</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    required
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none appearance-none"
                  >
                    <option value="" disabled>Choose a doctor...</option>
                    {doctorsData.map(doc => (
                      <option key={doc.id} value={doc.id}>{doc.name} - {doc.specialty}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CalendarIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {timeSlots.map(slot => (
                  <div
                    key={slot}
                    onClick={() => setTime(slot)}
                    className={`cursor-pointer border rounded-lg py-2 text-center transition-all ${
                      time === slot 
                        ? 'bg-primary text-white border-primary shadow-md' 
                        : 'bg-white text-gray-700 border-gray-200 hover:border-primary'
                    }`}
                  >
                    {slot}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">Reason for Visit</label>
            <textarea
              rows="3"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="Please briefly describe your symptoms or reason for visit..."
            ></textarea>
          </div>

          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-primary/30 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {submitting ? (
                <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Booking...</>
              ) : 'Confirm Booking'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default BookAppointment;
