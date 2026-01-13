import React, { useState, useEffect } from 'react'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Eye, EyeOff, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); 
  const navigate = useNavigate();
  const [validations, setValidations] = useState({ 
    length: false, 
    upper: false,  
    number: false  
  });

  useEffect(() => {
    setValidations({
      length: password.length >= 8,
      upper: /[A-Z]/.test(password), 
      number: /[0-9]/.test(password), 
    });
  }, [password]);
  const isPasswordSecure = Object.values(validations).every(Boolean);
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); 
    
    try {
      await axios.post('http://localhost:3000/auth/register', { 
        username, 
        password, 
        role: 'USER' 
      });

      Swal.fire({ 
        icon: 'success', 
        title: 'สมัครสำเร็จ!', 
        showConfirmButton: false, 
        timer: 1500 
      }).then(() => navigate('/login')); 

    } catch (err) {
      Swal.fire({ 
        icon: 'error', 
        title: 'ล้มเหลว', 
        text: 'ชื่อผู้ใช้นี้มีคนใช้แล้ว' 
      });
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 45px 12px 16px', 
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    outline: 'none',
    boxSizing: 'border-box', 
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '30px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)', width: '100%', maxWidth: '420px' }}>
        <h2 style={{ textAlign: 'center', fontWeight: '800', fontSize: '2rem', marginBottom: '30px' }}>สร้างบัญชีใหม่</h2>
        
        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>ชื่อผู้ใช้งาน</label>
            <input 
              type="text" 
              style={inputStyle} 
              onChange={(e) => setUsername(e.target.value)} 
              placeholder="Username" 
              required 
            />
          </div>

          <div style={{ position: 'relative' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>รหัสผ่าน</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
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
                style={{ position: 'absolute', right: '12px', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div style={{ backgroundColor: '#f9fafb', padding: '15px', borderRadius: '15px', border: '1px solid #f1f5f9' }}>
            <p style={{ fontSize: '0.75rem', fontWeight: '700', color: '#4b5563', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <ShieldCheck size={14} /> ความปลอดภัยของรหัสผ่าน:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: validations.length ? '#10b981' : '#9ca3af' }}>
                {validations.length ? <CheckCircle2 size={14}/> : <XCircle size={14}/>} อย่างน้อย 8 ตัวอักษร
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: validations.upper ? '#10b981' : '#9ca3af' }}>
                {validations.upper ? <CheckCircle2 size={14}/> : <XCircle size={14}/>} มีตัวพิมพ์ใหญ่ (A-Z)
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: validations.number ? '#10b981' : '#9ca3af' }}>
                {validations.number ? <CheckCircle2 size={14}/> : <XCircle size={14}/>} มีตัวเลข (0-9)
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={!isPasswordSecure} 
            style={{ 
              backgroundColor: isPasswordSecure ? '#2563eb' : '#94a3b8', 
              color: 'white', 
              padding: '15px', 
              borderRadius: '12px', 
              border: 'none', 
              fontWeight: 'bold', 
              cursor: isPasswordSecure ? 'pointer' : 'not-allowed',
              transition: 'background-color 0.3s ease' 
            }}
          >
            สมัครสมาชิก
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;