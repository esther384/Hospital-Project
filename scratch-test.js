import fs from 'fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';

const envContent = fs.readFileSync('.env', 'utf8');
const config = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    const key = match[1];
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    }
    config[key] = value;
  }
});

const firebaseConfig = {
  apiKey: config.VITE_FIREBASE_API_KEY,
  authDomain: config.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: config.VITE_FIREBASE_PROJECT_ID,
  storageBucket: config.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: config.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: config.VITE_FIREBASE_APP_ID,
  measurementId: config.VITE_FIREBASE_MEASUREMENT_ID
};

console.log("Initializing Firebase with project ID:", firebaseConfig.projectId);

try {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  console.log("Attempting to read 'doctors' collection...");
  const doctorsSnap = await getDocs(collection(db, "doctors"));
  console.log(`Success: Found ${doctorsSnap.size} doctors.`);
  doctorsSnap.forEach(doc => {
    console.log(` - Doctor [${doc.id}]:`, doc.data().name);
  });

  console.log("Attempting to write a test appointment to 'appointments' collection...");
  const testApp = {
    patientId: "test-patient-id",
    userId: "test-patient-id",
    patientName: "Test Patient Name",
    doctorId: "test-doc-id",
    doctorName: "Test Doctor Name",
    doctorSpecialty: "Test Specialty",
    date: "2026-06-12",
    time: "09:30 AM",
    scheduledAt: new Date().toISOString(),
    status: "Upcoming",
    createdAt: new Date().toISOString(),
    reason: "Test connection booking"
  };

  const docRef = await addDoc(collection(db, "appointments"), testApp);
  console.log("Success: Test appointment written with ID:", docRef.id);
  process.exit(0);
} catch (error) {
  console.error("Firebase Test Error:", error);
  process.exit(1);
}
