import React from 'react';
import { Navigate } from 'react-router-dom';
import { type UserRole } from '../interfaces/types';

interface ProtectedRouteProps {
  children: React.ReactNode; 
  allowedRole: UserRole;// รับค่า 'ADMIN' หรือ 'USER'
}

const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('user_role') as UserRole | null;

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (userRole !== allowedRole) {
    alert("คุณไม่มีสิทธิ์เข้าถึงหน้านี้!");
    return <Navigate to={userRole === 'ADMIN' ? "/admin/dashboard" : "/home"} replace />;
  }

  return children;
};

export default ProtectedRoute;