import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export default function ProtectedRoute({ allowedRoles }) {
  // CHANGED: Reading from sessionStorage instead of localStorage
  const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
  const userRole = sessionStorage.getItem('userRole');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect to their respective dashboard if they try to access unauthorized routes
    if (userRole === 'ADMIN') return <Navigate to="/admin" replace />;
    if (userRole === 'FACULTY') return <Navigate to="/faculty" replace />;
    return <Navigate to="/student" replace />;
  }

  return <Outlet />;
}