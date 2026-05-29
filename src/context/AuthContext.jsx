import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch custom user doc to get the role and name
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser({ uid: firebaseUser.uid, email: firebaseUser.email, ...userDoc.data() });
        } else {
          // Fallback if doc is missing
          setUser({ uid: firebaseUser.uid, email: firebaseUser.email, role: 'patient' });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginWithEmail = async (email, password) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const registerWithEmail = async (name, email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;
    
    // Default to patient, could be expanded later
    const userData = {
      name,
      email,
      role: 'patient',
      createdAt: new Date().toISOString()
    };
    
    // Save to firestore
    await setDoc(doc(db, 'users', firebaseUser.uid), userData);
    setUser({ uid: firebaseUser.uid, ...userData });
  };

  const resetPassword = async (email) => {
    // We delay import since it's modularly lightweight
    const { sendPasswordResetEmail } = await import('firebase/auth');
    await sendPasswordResetEmail(auth, email);
  };

  const updateUserProfileDocs = async (updates) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'users', user.uid), { ...user, ...updates }, { merge: true });
      setUser({ ...user, ...updates });
    } catch (err) {
      console.error("Failed to update profile", err);
      throw err;
    }
  };

  const logout = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loginWithEmail, registerWithEmail, resetPassword, updateUserProfileDocs, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
