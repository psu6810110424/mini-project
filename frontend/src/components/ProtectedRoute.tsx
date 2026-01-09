import React from 'react';
import { Navigate } from 'react-router-dom';
import { type UserRole } from '../interfaces/types';

interface ProtectedRouteProps {
  children: React.ReactNode; 
  allowedRole: UserRole;// รับค่า 'ADMIN' หรือ 'USER'
}

const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
  const token = localStorage.getItem('token');
  const rawRole = localStorage.getItem('user_role') || '';
  const userRole = rawRole ? (rawRole as string).toUpperCase() as UserRole : null;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (userRole !== allowedRole) {
    // Normalize and be explicit in feedback/redirect to avoid confusing users when casing differs
    // Only show alert for authorized users who lack this role
    alert('คุณไม่มีสิทธิ์เข้าถึงหน้านี้!');
    return <Navigate to={userRole === 'ADMIN' ? '/admin/dashboard' : '/'} replace />;
  }

  return children;
};

export default ProtectedRoute;