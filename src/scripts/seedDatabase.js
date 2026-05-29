import { getDoctors, deleteDoctor, addDoctor } from '../services/firebaseServices.js';
import doctorsData from '../data/doctors.json';

export const fixDatabase = async () => {
    try {
        const doctors = await getDoctors();
        
        // Force delete ALL doctors to clear bad image links
        for (const doc of doctors) {
            await deleteDoctor(doc.id);
        }

        // Reseed with correct images from JSON
        for (const doc of doctorsData) {
            const { id, ...dataToSave } = doc;
            await addDoctor(dataToSave);
        }
        
        console.log('Successfully applied new images to all doctors!');
    } catch (error) {
        console.error('Error fixing db:', error);
    }
};
