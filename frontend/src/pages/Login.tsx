import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import type { AuthResponse } from '../interfaces/types';
import Swal from 'sweetalert2';
import { Eye, EyeOff, Lock, User as UserIcon } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate(); 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); 
    
    try {
      const response = await axios.post<AuthResponse>('http://localhost:3000/auth/login', { 
        username, 
        password 
      });

      if (response.data.user.role === 'ADMIN') {
        const result = await Swal.fire({
          icon: 'warning',
          title: 'ไม่อนุญาต',
          text: 'บัญชี Admin กรุณาล็อกอินผ่านหน้า Admin\nต้องการไปหน้าล็อกอินของ Admin และกรอกชื่อผู้ใช้อัตโนมัติหรือไม่?',
          showCancelButton: true,
          confirmButtonText: 'ไปหน้า Admin',
          cancelButtonText: 'ยกเลิก'
        });

        if (result.isConfirmed) {
          navigate('/admin/login', { state: { username: response.data.user.username } });
        }
        return; 
      }

      const token = response.data.access_token || (response.data as any).token;

      if (!token) {
        console.error("Login Error: Token not found in response data", response.data);
        Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: 'ระบบไม่สามารถรับรหัสยืนยันตัวตนได้' });
        return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user_role', (response.data.user.role || '').toString().toUpperCase());
      localStorage.setItem('login_success', 'true'); 

      Swal.fire({ 
        icon: 'success', 
        title: 'สำเร็จ!', 
        showConfirmButton: false, 
        timer: 1500 
      }).then(() => {
        navigate('/'); 
        window.location.reload();
      });

    } catch (error: any) {
      console.error("Login Axios Error:", error.response?.data);
      Swal.fire({ 
        icon: 'error', 
        title: 'ล้มเหลว', 
        text: error.response?.data?.message || 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' 
      });
    }
  };

  const inputWrapperStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '100%', 
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 40px 12px 40px', 
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    outline: 'none',
    boxSizing: 'border-box', 
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', color: '#1e293b', marginBottom: '30px', fontWeight: '800' }}>เข้าสู่ระบบ</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>ชื่อผู้ใช้งาน</label>
            <div style={inputWrapperStyle}>
              <UserIcon size={18} style={{ position: 'absolute', left: '12px', color: '#94a3b8' }} />
              <input 
                type="text" 
                style={inputStyle} 
                onChange={(e) => setUsername(e.target.value)} 
                placeholder="Username" 
                required 
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>รหัสผ่าน</label>
            <div style={inputWrapperStyle}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', color: '#94a3b8' }} />
              <input 
                type={showPassword ? "text" : "password"} 
                style={inputStyle} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••" 
                required 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center' }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" style={{ backgroundColor: '#2563eb', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;