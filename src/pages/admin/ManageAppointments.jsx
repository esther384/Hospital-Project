import React, { useEffect, useState } from "react";
import {
  onAppointmentsSnapshot,
  createAppointment,
  updateAppointmentStatus,
  deleteAppointment,
  getDoctors,
  getPatients,
} from "../../services/firebaseServices";
import { Search, Calendar, User, UserCheck, Clock, FileText, Trash2, Plus, UserPlus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Modal from "../../components/Modal";

const ManageAppointments = () => {
  const { user: currentUser } = useAuth();
  const [appointments, setAppointments] = useState(null);
  const [doctorsList, setDoctorsList] = useState([]);
  const [patientsList, setPatientsList] = useState([]);
  const [isNewPatient, setIsNewPatient] = useState(false);
  const [form, setForm] = useState({
    patientId: "",
    patientName: "",
    doctorId: "",
    scheduledAt: "",
    reason: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [modal, setModal] = useState({ open: false, type: "info", title: "", message: "" });
  const [confirmModal, setConfirmModal] = useState({ open: false, appointmentId: null });

  useEffect(() => {
    // Subscribe to realtime appointments
    const unsubscribe = onAppointmentsSnapshot((err, data) => {
      if (err) return console.error(err);
      setAppointments(data);
      setLoading(false);
    });

    // Fetch doctors
    const fetchDocs = async () => {
      try {
        const data = await getDoctors();
        setDoctorsList(data);
      } catch (err) {
        console.error("Failed to load doctors list", err);
      }
    };

    // Fetch patients
    const fetchPts = async () => {
      try {
        const data = await getPatients();
        setPatientsList(data);
      } catch (err) {
        console.error("Failed to load patients list", err);
      }
    };

    fetchDocs();
    fetchPts();

    return () => unsubscribe && unsubscribe();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateAppointmentStatus(id, newStatus);
      setAppointments(
        appointments.map((a) =>
          a.id === id ? { ...a, status: newStatus } : a,
        ),
      );
    } catch (error) {
      console.error("Status update failed", error);
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "patientId" && value !== "new") {
      const selectedPatient = patientsList.find(p => p.id === value);
      setForm(prev => ({
        ...prev,
        patientId: value,
        patientName: selectedPatient ? selectedPatient.name : "",
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    const patientIdVal = isNewPatient ? (currentUser?.uid || "guest") : form.patientId;
    const patientNameVal = isNewPatient ? form.patientName : (patientsList.find(p => p.id === form.patientId)?.name || form.patientName);

    if (!isNewPatient && !form.patientId) {
      setModal({ open: true, type: "warning", title: "Select Patient", message: "Please select an existing patient or toggle to enter a new patient." });
      return;
    }
    if (isNewPatient && !form.patientName.trim()) {
      setModal({ open: true, type: "warning", title: "Patient Name Required", message: "Please enter the new patient's name." });
      return;
    }
    if (!form.doctorId) {
      setModal({ open: true, type: "warning", title: "Select Doctor", message: "Please select a doctor for the appointment." });
      return;
    }
    if (!form.scheduledAt) {
      setModal({ open: true, type: "warning", title: "Select Date & Time", message: "Please select a scheduled date and time." });
      return;
    }

    setSubmitting(true);
    try {
      const selectedDoc = doctorsList.find(d => d.id === form.doctorId);
      const doctorName = selectedDoc ? selectedDoc.name : "Unknown Doctor";
      const doctorSpecialty = selectedDoc ? selectedDoc.specialty : "";

      const dateObj = new Date(form.scheduledAt);
      const isValid = !isNaN(dateObj.getTime());
      const dateStr = isValid ? dateObj.toISOString().split("T")[0] : "";
      const timeStr = isValid
        ? dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "";
      const isoStr = isValid ? dateObj.toISOString() : new Date().toISOString();

      const payload = {
        patientId: patientIdVal,
        userId: patientIdVal,      // standard key alias
        patientName: patientNameVal,
        doctorId: form.doctorId,
        doctorName,
        doctorSpecialty,
        date: dateStr,
        time: timeStr,
        scheduledAt: dateObj,
        reason: form.reason || "Scheduled by administrator",
        status: "Pending",
        createdAt: new Date(),
      };

      await createAppointment(payload);
      setModal({
        open: true,
        type: "success",
        title: "Appointment Created",
        message: `Appointment for ${patientNameVal} has been booked successfully.`,
      });
      setForm({ patientId: "", patientName: "", doctorId: "", scheduledAt: "", reason: "" });
      setIsNewPatient(false);
    } catch (err) {
      console.error(err);
      setModal({ open: true, type: "error", title: "Booking Failed", message: `Failed to create the appointment: ${err.message || 'Permission denied'}` });
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = (id) => {
    setConfirmModal({ open: true, appointmentId: id });
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteAppointment(confirmModal.appointmentId);
      setModal({ open: true, type: "success", title: "Deleted", message: "Appointment record has been permanently removed." });
    } catch (err) {
      console.error(err);
      setModal({ open: true, type: "error", title: "Error", message: "Failed to delete the appointment." });
    } finally {
      setConfirmModal({ open: false, appointmentId: null });
    }
  };

  const getFormattedDateTime = (app) => {
    if (app.date) {
      return { date: app.date, time: app.time || "" };
    }
    if (app.scheduledAt) {
      const dt = app.scheduledAt.toDate ? app.scheduledAt.toDate() : new Date(app.scheduledAt);
      if (!isNaN(dt.getTime())) {
        return {
          date: dt.toISOString().split("T")[0],
          time: dt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
      }
    }
    return { date: "N/A", time: "" };
  };

  const filteredAppointments = appointments
    ? appointments.filter((app) => {
        const matchesSearch =
          (app.patientName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
          (app.doctorName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
          (app.doctorId?.toLowerCase() || "").includes(searchTerm.toLowerCase());

        const matchesStatus =
          statusFilter === "all" ||
          app.status?.toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesStatus;
      })
    : [];

  return (
    <div className="max-w-7xl mx-auto pb-10">
      <Modal
        open={modal.open}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={() => setModal({ open: false, type: "info", title: "", message: "" })}
      />
      <Modal
        open={confirmModal.open}
        type="confirm"
        title="Delete Appointment?"
        message="This appointment record will be permanently deleted and cannot be recovered."
        confirmText="Delete"
        cancelText="Keep"
        onClose={() => setConfirmModal({ open: false, appointmentId: null })}
        onConfirm={handleConfirmDelete}
      />

      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
            Manage Appointments
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            View and organize all patient bookings
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 animate-fade-in-up">
        {/* Table list */}
        <div className="lg:col-span-2 bg-white rounded-[1.5rem] shadow-sm border border-slate-100 p-4">
          <div className="p-4 border-b border-slate-50 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-sm font-medium"
                placeholder="Search by patient or doctor name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative w-full sm:w-48">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-4 w-4 text-gray-400" />
              </div>
              <select
                className="block w-full pl-10 pr-8 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:ring-2 focus:ring-primary outline-none appearance-none cursor-pointer text-sm font-semibold"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto mt-4">
            {loading ? (
              <div className="p-8 text-center text-slate-400 font-medium">
                Loading appointments...
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="p-8 text-center text-slate-400 font-medium">
                No appointments found.
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100">
                    <th className="px-4 py-3 font-bold">Patient</th>
                    <th className="px-4 py-3 font-bold">Doctor</th>
                    <th className="px-4 py-3 font-bold">Date & Time</th>
                    <th className="px-4 py-3 font-bold">Status</th>
                    <th className="px-4 py-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium">
                  {filteredAppointments.map((app) => {
                    const dt = getFormattedDateTime(app);
                    return (
                      <tr
                        key={app.id}
                        className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-4 py-4">
                          <div className="font-bold text-primary">
                            {app.patientName}
                          </div>
                          <div className="text-xs text-slate-400">
                            ID: ...{app.id?.slice(-6) || "N/A"}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="font-bold text-primary">
                            {app.doctorName || "TBD"}
                          </div>
                          <div className="text-xs text-slate-400">
                            {app.doctorSpecialty || (app.doctorId ? `ID: ${app.doctorId.slice(-6)}` : "")}
                          </div>
                        </td>
                        <td className="px-4 py-4 text-slate-500">
                          <div>{dt.date}</div>
                          <div className="text-xs font-semibold">{dt.time}</div>
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                              app.status === "Completed"
                                ? "bg-emerald-100 text-emerald-800"
                                : app.status === "Cancelled"
                                  ? "bg-rose-100 text-rose-800"
                                  : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {app.status || "Upcoming"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="inline-flex items-center gap-3">
                            <select
                              className="border border-slate-200 rounded-lg text-xs px-2.5 py-1.5 outline-none bg-slate-50 hover:bg-slate-100 cursor-pointer font-semibold"
                              value={app.status || "Pending"}
                              onChange={(e) =>
                                handleStatusChange(app.id, e.target.value)
                              }
                            >
                              <option value="Pending">Pending</option>
                              <option value="Upcoming">Upcoming</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                            <button
                              onClick={() => onDelete(app.id)}
                              className="text-rose-600 hover:text-rose-800 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Creation card */}
        <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 p-6 self-start">
          <h3 className="text-lg font-bold text-primary mb-4 flex items-center">
            <UserCheck className="w-5 h-5 mr-2 text-secondary" />
            Book New Appointment
          </h3>
          <form onSubmit={onSubmit} className="space-y-4">
            
            {/* Patient type switcher */}
            <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-100">
              <button
                type="button"
                onClick={() => { setIsNewPatient(false); setForm(prev => ({ ...prev, patientName: "" })); }}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${!isNewPatient ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-primary"}`}
              >
                Existing Patient
              </button>
              <button
                type="button"
                onClick={() => { setIsNewPatient(true); setForm(prev => ({ ...prev, patientId: "" })); }}
                className={`flex-grow py-2 text-xs font-bold rounded-lg transition ${isNewPatient ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-primary"}`}
              >
                <span className="flex items-center justify-center gap-1">
                  <UserPlus className="w-3.5 h-3.5" /> New Patient
                </span>
              </button>
            </div>

            {isNewPatient ? (
              <div>
                <label className="text-sm font-semibold text-slate-600 block mb-1">
                  Patient Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="w-4 h-4 text-slate-400" />
                  </div>
                  <input
                    name="patientName"
                    value={form.patientName}
                    onChange={onChange}
                    required
                    placeholder="Full name of patient"
                    className="w-full pl-9 pr-3 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition font-medium"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="text-sm font-semibold text-slate-600 block mb-1">
                  Select Patient
                </label>
                <select
                  name="patientId"
                  value={form.patientId}
                  onChange={onChange}
                  required
                  className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition font-medium bg-white"
                >
                  <option value="" disabled>Choose a patient...</option>
                  {patientsList.map((pat) => (
                    <option key={pat.id} value={pat.id}>
                      {pat.name} ({pat.email})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-1">
                Assign Doctor
              </label>
              <select
                name="doctorId"
                value={form.doctorId}
                onChange={onChange}
                required
                className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition font-medium bg-white"
              >
                <option value="" disabled>Choose a doctor...</option>
                {doctorsList.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} ({doc.specialty})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-1">
                Schedule Date & Time
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  name="scheduledAt"
                  type="datetime-local"
                  value={form.scheduledAt}
                  onChange={onChange}
                  required
                  className="w-full pl-9 pr-3 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition font-medium bg-white"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-600 block mb-1">
                Reason / Symptoms
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                  <FileText className="w-4 h-4 text-slate-400" />
                </div>
                <textarea
                  name="reason"
                  value={form.reason}
                  onChange={onChange}
                  placeholder="Brief reason for booking..."
                  rows={2}
                  className="w-full pl-9 pr-3 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition font-medium resize-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary hover:bg-primary-light text-white font-bold py-3 px-4 rounded-xl shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" /> Create Appointment
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ManageAppointments;
