import React from 'react';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';
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
    Swal.fire({
      title: 'การเข้าถึงถูกปฏิเสธ',
      text: 'คุณไม่มีสิทธิ์เข้าถึงหน้านี้',
      icon: 'error',
      confirmButtonColor: '#3085d6',
      background: '#ffffff',
      borderRadius: 12
    });
    return <Navigate to={userRole === 'ADMIN' ? '/admin/dashboard' : '/'} replace />;
  }

  return children;
};

export default ProtectedRoute;