import { db } from "../firebase";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

// --- DOCTORS ---
export const getDoctors = async () => {
  const querySnapshot = await getDocs(collection(db, "doctors"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const getDoctorById = async (id) => {
  const docRef = doc(db, "doctors", id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

export const addDoctor = async (doctorData) => {
  const docRef = await addDoc(collection(db, "doctors"), doctorData);
  return { id: docRef.id, ...doctorData };
};

export const updateDoctor = async (id, doctorData) => {
  const docRef = doc(db, "doctors", id);
  await updateDoc(docRef, doctorData);
};

export const deleteDoctor = async (id) => {
  const docRef = doc(db, "doctors", id);
  await deleteDoc(docRef);
};

// --- APPOINTMENTS ---
export const getAppointments = async () => {
  const querySnapshot = await getDocs(collection(db, "appointments"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const getAppointmentsByPatientId = async (patientId) => {
  const q = query(
    collection(db, "appointments"),
    where("patientId", "==", patientId),
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const createAppointment = async (appointmentData) => {
  const docRef = await addDoc(collection(db, "appointments"), appointmentData);
  return { id: docRef.id, ...appointmentData };
};

export const updateAppointmentStatus = async (id, status) => {
  const docRef = doc(db, "appointments", id);
  await updateDoc(docRef, { status });
};

export const deleteAppointment = async (id) => {
  const docRef = doc(db, "appointments", id);
  await deleteDoc(docRef);
};

export const onDoctorsSnapshot = (callback) => {
  try {
    const colRef = collection(db, "doctors");
    return onSnapshot(
      colRef,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        callback(null, data);
      },
      (error) => callback(error),
    );
  } catch (error) {
    callback(error);
    return () => {};
  }
};

export const onPatientsSnapshot = (callback) => {
  try {
    const q = query(collection(db, "users"), where("role", "==", "patient"));
    return onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        callback(null, data);
      },
      (error) => callback(error),
    );
  } catch (error) {
    callback(error);
    return () => {};
  }
};

export const onAppointmentsSnapshot = (callback, options = {}) => {
  try {
    let colRef = collection(db, "appointments");
    let q = colRef;
    if (options.userId) {
      q = query(colRef, where("userId", "==", options.userId));
    }
    return onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        callback(null, data);
      },
      (error) => callback(error),
    );
  } catch (error) {
    callback(error);
    return () => {};
  }
};

// --- PATIENTS / USERS ---
export const getPatients = async () => {
  const q = query(collection(db, "users"), where("role", "==", "patient"));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const getUserById = async (id) => {
  const docRef = doc(db, "users", id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

export const uploadFile = async (file, folder = "doctors") => {
  if (!file) return null;
  try {
    const storage = getStorage();
    const path = `${folder}/${Date.now()}_${file.name}`;
    const ref = storageRef(storage, path);
    await uploadBytes(ref, file);
    const url = await getDownloadURL(ref);
    return url;
  } catch (error) {
    console.error("uploadFile error", error);
    throw error;
  }
};
