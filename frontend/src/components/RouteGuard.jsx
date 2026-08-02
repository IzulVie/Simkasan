import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RouteGuard = ({ children, allowedRoles }) => {
  const { user, token, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#F7F5F0]">
        <div className="text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#5B7553] border-t-transparent mx-auto"></div>
          <p className="mt-4 text-[#5B7553] font-medium text-sm">Memuat data SIMKASAN...</p>
        </div>
      </div>
    );
  }

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const hasAllowedRole = allowedRoles.some((role) => user.roles && user.roles.includes(role));

  if (!hasAllowedRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default RouteGuard;
