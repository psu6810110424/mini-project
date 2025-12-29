import React, { useState } from 'react';
import axios from 'axios';
import type { AuthResponse } from '../interfaces/types';

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post<AuthResponse>('http://localhost:3000/auth/login', {
        username,
        password,
      });
      
      // เก็บ JWT ลง Local Storage ตามโจทย์
      localStorage.setItem('token', response.data.access_token);
      
      alert('Login Success!');
      window.location.href = '/'; // กลับไปหน้าแรก
    } catch (error) {
      alert('Username หรือ Password ไม่ถูกต้อง');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;