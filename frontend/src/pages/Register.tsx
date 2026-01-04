import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
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
    alert('สมัครสมาชิกสำเร็จ!');
    navigate('/login');
  } catch (error) {
    alert('การสมัครสมาชิกล้มเหลว');
  }
};

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '90vh', backgroundColor: '#f3f4f6' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <h2 style={{ textAlign: 'center', color: '#111827', marginBottom: '30px', fontSize: '1.8rem' }}>สร้างบัญชีใหม่</h2>
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '8px', color: '#374151' }}>ชื่อผู้ใช้งาน</label>
            <input 
              type="text" 
              placeholder="Username"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db' }}
              onChange={(e) => setUsername(e.target.value)} 
            />
          </div>

          <div style={{ position: 'relative' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#374151' }}>รหัสผ่าน</label>
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••"
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db' }}
              onChange={(e) => setPassword(e.target.value)} 
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{ position: 'absolute', right: '10px', top: '38px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>

          <button type="submit" style={{ backgroundColor: '#2563eb', color: 'white', padding: '14px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
            สมัครสมาชิก
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;