import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import {Clock, LogOut, ListOrdered } from 'lucide-react';
import type { Field } from '../interfaces/types';

const Home = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const fetchFields = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:3000/fields');
      setFields(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching fields:', error);
    }
  }, []);

  useEffect(() => {
    fetchFields();
  }, [fetchFields]);

  // ฟังก์ชันจองสนาม (ย้ายมาไว้ก่อน return เพื่อให้เรียกใช้งานได้)
  const handleBooking = (field: Field) => {
    Swal.fire({
      title: `จองสนาม: ${field.name}`,
      html: `
        <input type="date" id="bookingDate" class="swal2-input" min="${new Date().toISOString().split('T')[0]}">
        <select id="startTime" class="swal2-input">
          ${[7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22].map(h => `<option value="${h}:00">${h}:00</option>`).join('')}
        </select>
        <select id="endTime" class="swal2-input">
          ${[8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23].map(h => `<option value="${h}:00">${h}:00</option>`).join('')}
        </select>
      `,
      preConfirm: () => {
        const date = (document.getElementById('bookingDate') as HTMLInputElement).value;
        const start = (document.getElementById('startTime') as HTMLSelectElement).value;
        const end = (document.getElementById('endTime') as HTMLSelectElement).value;
        return { bookingDate: date, startTime: start, endTime: end };
      }
    }).then((result) => {
      if (result.isConfirmed) processBooking(field, result.value);
    });
  };

  const processBooking = async (field: Field, data: any) => {
    try {
      const res = await axios.get(`http://localhost:3000/bookings/check`, {
        params: { fieldId: field.id, ...data }
      });
      if (res.data.available) {
        navigate('/payment', { state: { field, bookingData: data } });
      } else {
        Swal.fire('สนามไม่ว่าง', 'กรุณาเลือกเวลาอื่น', 'error');
      }
    } catch (e) { console.error(e); }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <nav style={{ backgroundColor: '#1e293b', padding: '15px 5%', display: 'flex', justifyContent: 'space-between', color: 'white' }}>
        <h2 onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Sport<span style={{ color: '#3b82f6' }}>Reserve</span></h2>
        <div style={{ display: 'flex', gap: '15px' }}>
          {token && (
            <button onClick={() => navigate('/my-bookings')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <ListOrdered size={20} /> ประวัติการจอง
            </button>
          )}
          <button onClick={() => { localStorage.clear(); window.location.reload(); }} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><LogOut size={20} /></button>
        </div>
      </nav>
      <main style={{ padding: '40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {fields.map(field => (
          <div key={field.id} style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h3>{field.name}</h3>
            <p><Clock size={16} /> ฿{field.pricePerHour}/ชม.</p>
            <button onClick={() => handleBooking(field)} style={{ width: '100%', padding: '10px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>จองสนาม</button>
          </div>
        ))}
      </main>
    </div>
  );
};

export default Home;