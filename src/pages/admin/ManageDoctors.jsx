import React, { useEffect, useState } from "react";
import { Users, Plus, Edit2, Trash2, Link as LinkIcon, ImageOff } from "lucide-react";
import Modal from "../../components/Modal";
import {
  onDoctorsSnapshot,
  addDoctor,
  updateDoctor,
  deleteDoctor,
} from "../../services/firebaseServices";

const RESET_FORM = { name: "", specialty: "", phone: "", bio: "", imageUrl: "" };

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState(null);
  const [form, setForm] = useState(RESET_FORM);
  const [editing, setEditing] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [modal, setModal] = useState({ open: false, type: "info", title: "", message: "" });
  const [confirmModal, setConfirmModal] = useState({ open: false, doctorId: null });

  useEffect(() => {
    const unsubscribe = onDoctorsSnapshot((err, data) => {
      if (err) return console.error(err);
      setDoctors(data);
    });
    return () => unsubscribe && unsubscribe();
  }, []);

  // Reset image error whenever the URL changes
  useEffect(() => { setImgError(false); }, [form.imageUrl]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        specialty: form.specialty,
        phone: form.phone,
        bio: form.bio,
        imageUrl: form.imageUrl,
      };
      if (editing) {
        await updateDoctor(editing.id, payload);
        setModal({ open: true, type: "success", title: "Doctor Updated", message: `${form.name}'s profile has been updated.` });
      } else {
        await addDoctor(payload);
        setModal({ open: true, type: "success", title: "Doctor Added", message: `${form.name} has been added successfully.` });
      }
      setForm(RESET_FORM);
      setEditing(null);
    } catch (err) {
      console.error(err);
      setModal({ open: true, type: "error", title: "Error", message: "Something went wrong. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const onEdit = (doc) => {
    setEditing(doc);
    setForm({
      name: doc.name || "",
      specialty: doc.specialty || "",
      phone: doc.phone || "",
      bio: doc.bio || "",
      imageUrl: doc.imageUrl || "",
    });
  };

  const onDelete = (id) => setConfirmModal({ open: true, doctorId: id });

  const handleConfirmDelete = async () => {
    try {
      await deleteDoctor(confirmModal.doctorId);
      setModal({ open: true, type: "success", title: "Doctor Deleted", message: "The doctor profile has been removed." });
    } catch (err) {
      console.error(err);
      setModal({ open: true, type: "error", title: "Error", message: "Failed to delete doctor. Please try again." });
    } finally {
      setConfirmModal({ open: false, doctorId: null });
    }
  };

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
        title="Delete Doctor?"
        message="This action cannot be undone. The doctor profile will be permanently removed."
        confirmText="Delete"
        cancelText="Keep"
        onClose={() => setConfirmModal({ open: false, doctorId: null })}
        onConfirm={handleConfirmDelete}
      />

      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-in-up">
        <div className="flex items-center">
          <div className="p-3 rounded-2xl bg-primary/10 mr-4">
            <Users className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-primary">Manage Doctors</h1>
            <p className="text-slate-500 text-sm">Add, edit, and remove doctor profiles. Changes appear in real-time.</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => { setEditing(null); setForm(RESET_FORM); }}
            className="bg-white border border-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            Reset
          </button>
          <button
            onClick={() => { setEditing(null); setForm(RESET_FORM); }}
            className="bg-primary hover:bg-primary-light text-white font-bold px-4 py-2 rounded-xl transition-colors shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New Doctor
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 animate-fade-in-up">
        {/* Doctors Table */}
        <div className="lg:col-span-2 bg-white rounded-[1.5rem] shadow-sm border border-slate-100 p-4">
          <h2 className="text-lg font-bold text-primary mb-4">Doctors List</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-slate-100">
                  <th className="px-4 py-3 font-bold">Profile</th>
                  <th className="px-4 py-3 font-bold">Specialty</th>
                  <th className="px-4 py-3 font-bold">Phone</th>
                  <th className="px-4 py-3 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm font-medium">
                {doctors === null ? (
                  <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-400">Loading doctors...</td></tr>
                ) : doctors.length === 0 ? (
                  <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-400">No doctors found.</td></tr>
                ) : (
                  doctors.map((d) => (
                    <tr key={d.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-4 flex items-center gap-3">
                        <img
                          src={d.imageUrl || `https://i.pravatar.cc/40?u=${d.id}`}
                          alt={d.name}
                          className="w-10 h-10 rounded-lg object-cover border"
                        />
                        <div>
                          <p className="font-bold">{d.name}</p>
                          <p className="text-xs text-slate-400 truncate max-w-[12rem]">{d.bio}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-slate-500">{d.specialty}</td>
                      <td className="px-4 py-4 text-slate-500">{d.phone}</td>
                      <td className="px-4 py-4 text-right">
                        <div className="inline-flex items-center gap-3">
                          <button onClick={() => onEdit(d)} className="text-secondary flex items-center gap-2">
                            <Edit2 className="w-4 h-4" /> Edit
                          </button>
                          <button onClick={() => onDelete(d.id)} className="text-rose-600 flex items-center gap-2">
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add / Edit Form */}
        <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-primary mb-4">
            {editing ? "Edit Doctor" : "Add Doctor"}
          </h3>
          <form onSubmit={onSubmit} className="space-y-4">

            {/* Name */}
            <div>
              <label className="text-sm font-medium text-slate-600">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                required
                placeholder="Dr. Jane Smith"
                className="w-full mt-1.5 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition"
              />
            </div>

            {/* Specialty */}
            <div>
              <label className="text-sm font-medium text-slate-600">Specialty</label>
              <input
                name="specialty"
                value={form.specialty}
                onChange={onChange}
                required
                placeholder="e.g. Cardiology"
                className="w-full mt-1.5 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm font-medium text-slate-600">Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={onChange}
                placeholder="+234 801 234 5678"
                className="w-full mt-1.5 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="text-sm font-medium text-slate-600">Bio</label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={onChange}
                rows={3}
                placeholder="Brief professional summary..."
                className="w-full mt-1.5 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition resize-none"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="text-sm font-medium text-slate-600">Profile Image URL</label>
              <div className="mt-1.5 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LinkIcon className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={onChange}
                  type="url"
                  placeholder="https://example.com/doctor.jpg"
                  className="w-full pl-9 pr-3 p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition"
                />
              </div>

              {/* Live preview */}
              {form.imageUrl && (
                <div className="mt-3 flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                    {imgError ? (
                      <ImageOff className="w-6 h-6 text-slate-300" />
                    ) : (
                      <img
                        src={form.imageUrl}
                        alt="preview"
                        className="w-full h-full object-cover"
                        onError={() => setImgError(true)}
                      />
                    )}
                  </div>
                  <div className="text-xs text-slate-500">
                    {imgError
                      ? <span className="text-rose-500 font-medium">⚠ Image URL could not be loaded</span>
                      : <span className="text-emerald-600 font-medium">✓ Image preview</span>
                    }
                    <button
                      type="button"
                      onClick={() => { setForm((p) => ({ ...p, imageUrl: "" })); setImgError(false); }}
                      className="block text-rose-500 hover:text-rose-700 mt-1 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-primary text-white px-4 py-2.5 rounded-xl font-bold hover:bg-primary-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />{editing ? "Updating..." : "Creating..."}</>
                ) : (
                  editing ? "Update Doctor" : "Create Doctor"
                )}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={() => { setEditing(null); setForm(RESET_FORM); }}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ManageDoctors;
