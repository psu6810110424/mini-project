import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const AdminRegister: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const handleAdminRegister = async (e: React.FormEvent) => {
    e.preventDefault(); 
    
    try {
      await axios.post('http://localhost:3000/auth/register', {
        username,
        password,
        role: 'ADMIN', 
      });

      await Swal.fire({ 
        title: 'สำเร็จ', 
        text: 'สร้างบัญชีผู้ดูแลระบบสำเร็จ!', 
        icon: 'success', 
        confirmButtonColor: '#10b981' 
      });

      try {
        localStorage.setItem('saved_admin_credentials', JSON.stringify({ username, password }));
      } catch (e) { 
      }

      navigate('/admin/login'); 

    } catch (error) {
      await Swal.fire({ 
        title: 'ผิดพลาด', 
        text: 'ไม่สามารถสร้างบัญชี Admin ได้ (Username นี้อาจมีผู้ใช้แล้ว)', 
        icon: 'error', 
        confirmButtonColor: '#d33' 
      });
    }
  };

  return (
    
    <div style={{ 
      display: 'flex', justifyContent: 'center', alignItems: 'center', 
      minHeight: '80vh', backgroundColor: '#111827' 
    }}>
      <div style={{ 
        backgroundColor: 'white', padding: '40px', borderRadius: '16px', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)', width: '100%', maxWidth: '400px' 
      }}>
        <h2 style={{ textAlign: 'center', color: '#111827', marginBottom: '10px' }}>
          Admin Registration
        </h2>
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '30px', fontSize: '0.85rem' }}>
          * เฉพาะเจ้าหน้าที่ที่ได้รับอนุญาตเท่านั้น *
        </p>

        <form onSubmit={handleAdminRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px' }}>Admin Username</label>
            <input 
              type="text" 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db' }}
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="กำหนดชื่อผู้ใช้ Admin"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px' }}>Password</label>
            <input 
              type="password" 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db' }}
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="กำหนดรหัสผ่าน"
              required
            />
          </div>

          <button type="submit" style={{ 
            backgroundColor: '#ef4444', color: 'white', padding: '12px', 
            borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer' 
          }}>
            ยืนยันการสร้างบัญชี Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminRegister;