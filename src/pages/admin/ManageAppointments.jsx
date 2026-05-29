import React, { useEffect, useState } from "react";
import {
  onAppointmentsSnapshot,
  createAppointment,
  updateAppointmentStatus,
  deleteAppointment,
} from "../../services/firebaseServices";
import { Search, Calendar } from "lucide-react";

const ManageAppointments = () => {
  const [appointments, setAppointments] = useState(null);
  const [form, setForm] = useState({
    patientName: "",
    doctorName: "",
    scheduledAt: "",
  });
  const [editing, setEditing] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAppointmentsSnapshot((err, data) => {
      if (err) return console.error(err);
      setAppointments(data);
      setLoading(false);
    });
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

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        scheduledAt: new Date(form.scheduledAt),
        status: "Pending",
      };
      if (editing) {
        await updateAppointmentStatus(editing.id, form.status || "Pending");
        setEditing(null);
      } else {
        await createAppointment(payload);
      }
      setForm({ patientName: "", doctorName: "", scheduledAt: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const onDelete = async (id) => {
    if (!confirm("Delete appointment?")) return;
    try {
      await deleteAppointment(id);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredAppointments = appointments
    ? appointments.filter((app) => {
        const matchesSearch =
          (app.patientName?.toLowerCase() || "").includes(
            searchTerm.toLowerCase(),
          ) ||
          (app.doctorId?.toLowerCase() || "").includes(
            searchTerm.toLowerCase(),
          );

        const matchesStatus =
          statusFilter === "all" ||
          app.status?.toLowerCase() === statusFilter.toLowerCase();

        return matchesSearch && matchesStatus;
      })
    : [];

  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Manage Appointments
          </h1>
          <p className="text-gray-600 mt-1">
            View and organize all patient bookings
          </p>
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
              placeholder="Search by patient or doctor ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative w-full md:w-48">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-4 w-4 text-gray-400" />
            </div>
            <select
              className="block w-full pl-10 pr-8 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-primary outline-none appearance-none cursor-pointer"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Loading appointments...
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 border-b border-gray-200 text-sm uppercase tracking-wider">
                  <th className="p-4 font-medium">Patient</th>
                  <th className="p-4 font-medium">Doctor Ref</th>
                  <th className="p-4 font-medium">Date & Time</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredAppointments.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4">
                      <div className="text-sm font-medium text-gray-900">
                        {app.patientName}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: ...{app.id.slice(-6)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm font-medium text-gray-900">
                        ID: {app.doctorId}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-gray-500">
                      <div>{app.date}</div>
                      <div className="text-xs">{app.time}</div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          app.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : app.status === "Cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="p-4 text-right text-sm font-medium flex justify-end gap-2">
                      <select
                        className="border border-gray-200 rounded text-xs px-2 py-1 outline-none mr-2 bg-gray-50 hover:bg-gray-100 cursor-pointer"
                        value={app.status}
                        onChange={(e) =>
                          handleStatusChange(app.id, e.target.value)
                        }
                      >
                        <option value="Upcoming">Upcoming</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <button
                        onClick={() => onDelete(app.id)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-3">
        <input
          name="patientName"
          value={form.patientName}
          onChange={onChange}
          placeholder="Patient Name"
          className="w-full p-3 border rounded"
        />
        <input
          name="doctorName"
          value={form.doctorName}
          onChange={onChange}
          placeholder="Doctor Name"
          className="w-full p-3 border rounded"
        />
        <input
          name="scheduledAt"
          type="datetime-local"
          value={form.scheduledAt}
          onChange={onChange}
          className="w-full p-3 border rounded"
        />
        <div>
          <button
            type="submit"
            className="bg-primary text-white px-4 py-2 rounded mr-2"
          >
            {editing ? "Update Status" : "Create"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="px-4 py-2"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ManageAppointments;
