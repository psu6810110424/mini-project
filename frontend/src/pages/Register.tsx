import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<string>('USER');
  const navigate = useNavigate();
  const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!username.trim() || !password.trim()) {
    alert('กรุณากรอกข้อมูลให้ครบถ้วนทุกช่อง (ห้ามเว้นว่าง)');
    return;
  }

  if (password.length < 6) {
    alert('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
    return;
  }

  try {
    await axios.post('http://localhost:3000/auth/register', { 
      username: username.trim(), 
      password, 
      role 
    });
    alert('สมัครสมาชิกสำเร็จ!');
    navigate('/login');
  } catch (error: any) {
    const message = error.response?.data?.message || 'การสมัครสมาชิกล้มเหลว';
    alert(Array.isArray(message) ? message.join(', ') : message);
  }
};

  return (
    <div style={{ padding: '20px' }}>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input 
          type="text" 
          placeholder="Username" 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} 
        />
        <select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRole(e.target.value)}>
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;