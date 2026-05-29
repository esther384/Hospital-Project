import { db } from '../firebase';
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where 
} from 'firebase/firestore';

// --- DOCTORS ---
export const getDoctors = async () => {
  const querySnapshot = await getDocs(collection(db, 'doctors'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getDoctorById = async (id) => {
  const docRef = doc(db, 'doctors', id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

export const addDoctor = async (doctorData) => {
  const docRef = await addDoc(collection(db, 'doctors'), doctorData);
  return { id: docRef.id, ...doctorData };
};

export const updateDoctor = async (id, doctorData) => {
  const docRef = doc(db, 'doctors', id);
  await updateDoc(docRef, doctorData);
};

export const deleteDoctor = async (id) => {
  const docRef = doc(db, 'doctors', id);
  await deleteDoc(docRef);
};

// --- APPOINTMENTS ---
export const getAppointments = async () => {
  const querySnapshot = await getDocs(collection(db, 'appointments'));
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getAppointmentsByPatientId = async (patientId) => {
  const q = query(collection(db, 'appointments'), where('patientId', '==', patientId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const createAppointment = async (appointmentData) => {
  const docRef = await addDoc(collection(db, 'appointments'), appointmentData);
  return { id: docRef.id, ...appointmentData };
};

export const updateAppointmentStatus = async (id, status) => {
  const docRef = doc(db, 'appointments', id);
  await updateDoc(docRef, { status });
};

// --- PATIENTS / USERS ---
export const getPatients = async () => {
  const q = query(collection(db, 'users'), where('role', '==', 'patient'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getUserById = async (id) => {
  const docRef = doc(db, 'users', id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};
