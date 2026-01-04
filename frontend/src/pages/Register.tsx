import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/auth/register', {
        username,
        password,
        role: 'USER', 
      });

      Swal.fire({
        icon: 'success',
        title: 'สมัครสมาชิกสำเร็จ!',
        text: 'ยินดีต้อนรับ! คุณสามารถเข้าสู่ระบบได้ทันที',
        confirmButtonColor: '#2563eb',
        timer: 2000,
        timerProgressBar: true
      }).then(() => {
        navigate('/login');
      });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถสมัครสมาชิกได้ กรุณาลองใหม่อีกครั้ง',
        confirmButtonColor: '#ef4444',
      });
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '90vh', backgroundColor: '#f3f4f6' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', color: '#111827', marginBottom: '10px', fontSize: '1.8rem', fontWeight: 'bold' }}>สร้างบัญชีใหม่</h2>
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '30px' }}>เข้าสู่ระบบจองสนามได้ง่ายๆ เพียงไม่กี่ขั้นตอน</p>
        
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontWeight: '500' }}>ชื่อผู้ใช้งาน</label>
            <input 
              type="text" 
              placeholder="Username"
              style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #d1d5db', fontSize: '1rem', outline: 'none' }}
              onChange={(e) => setUsername(e.target.value)} 
              required
            />
          </div>

          <div style={{ position: 'relative' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontWeight: '500' }}>รหัสผ่าน</label>
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••"
              style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #d1d5db', fontSize: '1rem', outline: 'none' }}
              onChange={(e) => setPassword(e.target.value)} 
              required
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '12px', top: '42px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>

          <button type="submit" style={{ backgroundColor: '#2563eb', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', marginTop: '10px', transition: 'all 0.2s' }}>
            สมัครสมาชิก
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;