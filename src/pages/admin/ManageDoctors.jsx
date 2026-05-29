import React, { useEffect, useState } from "react";
import { Users, Plus, Edit2, Trash2 } from "lucide-react";
import {
  onDoctorsSnapshot,
  addDoctor,
  updateDoctor,
  deleteDoctor,
  uploadFile,
} from "../../services/firebaseServices";

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState(null);
  const [form, setForm] = useState({
    name: "",
    specialty: "",
    phone: "",
    bio: "",
    imageUrl: "",
  });
  const [editing, setEditing] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const unsubscribe = onDoctorsSnapshot((err, data) => {
      if (err) return console.error(err);
      setDoctors(data);
    });
    return () => unsubscribe && unsubscribe();
  }, []);

  useEffect(() => {
    if (!imageFile) return setPreview(null);
    const url = URL.createObjectURL(imageFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onImageChange = (e) => {
    const f = e.target.files && e.target.files[0];
    setImageFile(f || null);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = form.imageUrl;
      if (imageFile) {
        imageUrl = await uploadFile(imageFile, "doctors");
      }
      const payload = {
        name: form.name,
        specialty: form.specialty,
        phone: form.phone,
        bio: form.bio,
        imageUrl,
      };
      if (editing) {
        await updateDoctor(editing.id, payload);
      } else {
        await addDoctor(payload);
      }
      setForm({ name: "", specialty: "", phone: "", bio: "", imageUrl: "" });
      setImageFile(null);
      setPreview(null);
      setEditing(null);
    } catch (err) {
      console.error(err);
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
    setPreview(doc.imageUrl || null);
    setImageFile(null);
  };

  const onDelete = async (id) => {
    if (!confirm("Delete doctor?")) return;
    try {
      await deleteDoctor(id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-10">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-in-up">
        <div className="flex items-center">
          <div className="p-3 rounded-2xl bg-primary/10 mr-4">
            <Users className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-primary">
              Manage Doctors
            </h1>
            <p className="text-slate-500 text-sm">
              Add, edit, and remove doctor profiles. Changes appear in
              real-time.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              setEditing(null);
              setForm({
                name: "",
                specialty: "",
                phone: "",
                bio: "",
                imageUrl: "",
              });
              setImageFile(null);
              setPreview(null);
            }}
            className="bg-white border border-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            Reset
          </button>
          <button
            onClick={() => {
              setEditing(null);
            }}
            className="bg-primary hover:bg-primary-light text-white font-bold px-4 py-2 rounded-xl transition-colors shadow-md flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> New Doctor
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 animate-fade-in-up">
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
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-6 text-center text-slate-400"
                    >
                      Loading doctors...
                    </td>
                  </tr>
                ) : doctors.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-6 text-center text-slate-400"
                    >
                      No doctors found.
                    </td>
                  </tr>
                ) : (
                  doctors.map((d) => (
                    <tr
                      key={d.id}
                      className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-4 py-4 flex items-center gap-3">
                        <img
                          src={d.imageUrl || "https://i.pravatar.cc/40"}
                          alt={d.name}
                          className="w-10 h-10 rounded-lg object-cover border"
                        />
                        <div>
                          <p className="font-bold">{d.name}</p>
                          <p className="text-xs text-slate-400">{d.bio}</p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-slate-500">
                        {d.specialty}
                      </td>
                      <td className="px-4 py-4 text-slate-500">{d.phone}</td>
                      <td className="px-4 py-4 text-right">
                        <div className="inline-flex items-center gap-3">
                          <button
                            onClick={() => onEdit(d)}
                            className="text-secondary flex items-center gap-2"
                          >
                            <Edit2 className="w-4 h-4" /> Edit
                          </button>
                          <button
                            onClick={() => onDelete(d.id)}
                            className="text-rose-600 flex items-center gap-2"
                          >
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

        <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-primary mb-4">
            {editing ? "Edit Doctor" : "Add Doctor"}
          </h3>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-600">Name</label>
              <input
                name="name"
                value={form.name}
                onChange={onChange}
                required
                className="w-full mt-2 p-3 border rounded-lg"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600">
                Specialty
              </label>
              <input
                name="specialty"
                value={form.specialty}
                onChange={onChange}
                required
                className="w-full mt-2 p-3 border rounded-lg"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600">
                Phone
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={onChange}
                className="w-full mt-2 p-3 border rounded-lg"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600">Bio</label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={onChange}
                className="w-full mt-2 p-3 border rounded-lg"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-600">
                Profile Image
              </label>
              <div className="mt-2 flex items-center gap-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-100 border flex items-center justify-center">
                  {preview ? (
                    <img
                      src={preview}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  ) : form.imageUrl ? (
                    <img
                      src={form.imageUrl}
                      alt="current"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-slate-400">No image</span>
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onImageChange}
                  />
                  {(preview || form.imageUrl) && (
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setPreview(null);
                        setForm((prev) => ({ ...prev, imageUrl: "" }));
                      }}
                      className="text-sm text-rose-600 mt-2"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3 pt-2">
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded-xl font-bold"
              >
                {editing ? "Update Doctor" : "Create Doctor"}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setForm({
                      name: "",
                      specialty: "",
                      phone: "",
                      bio: "",
                      imageUrl: "",
                    });
                    setImageFile(null);
                    setPreview(null);
                  }}
                  className="px-4 py-2 rounded-xl border"
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
