import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import { ToastProvider } from './components/ui/Toast';
import { ClientApp } from './ClientApp';
import { AdminApp } from './admin/AdminApp';
import { AuthGuard } from './components/guards/AuthGuard';
import { AdminGuard } from './components/guards/AdminGuard';
import { LoadingScreen } from './components/LoadingScreen';
import { NotificationProvider } from './components/notifications/NotificationProvider';
import { ErrorBoundary } from './components/ErrorBoundary';

function AppRoutes() {
  const { loading } = useAppContext();

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      <Route path="/" element={<ClientApp />} />
      <Route
        path="/admin/*"
        element={
          <AdminGuard>
            <AdminApp />
          </AdminGuard>
        }
      />
      <Route
        path="/bookings"
        element={
          <AuthGuard>
            <ClientApp initialTab="bookings" />
          </AuthGuard>
        }
      />
      <Route
        path="/messages"
        element={
          <AuthGuard>
            <ClientApp initialTab="messages" />
          </AuthGuard>
        }
      />
      <Route
        path="/dashboard"
        element={
          <AuthGuard>
            <ClientApp initialTab="dashboard" />
          </AuthGuard>
        }
      />
      <Route
        path="/partner"
        element={
          <AuthGuard>
            <ClientApp initialTab="partner" />
          </AuthGuard>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppProvider>
          <ToastProvider>
            <NotificationProvider>
              <AppRoutes />
            </NotificationProvider>
          </ToastProvider>
        </AppProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
