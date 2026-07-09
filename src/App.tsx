import React, { useState, useEffect } from 'react';
import { ClientApp } from './ClientApp';
import { AdminApp } from './admin/AdminApp';

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdmin(window.location.hash === '#admin');
    };
    
    // Check initial hash
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (isAdmin) {
    return <AdminApp />;
  }

  return <ClientApp />;
}
