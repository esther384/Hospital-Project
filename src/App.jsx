import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './AppRoutes';
import { fixDatabase } from './scripts/seedDatabase';

let hasRun = false;

function App() {
  useEffect(() => {
    if (!hasRun) {
      fixDatabase();
      hasRun = true;
    }
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
