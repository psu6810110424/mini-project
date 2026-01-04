import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Trophy, Clock } from 'lucide-react'; 
import type { Field } from '../interfaces/types'; 

const Home: React.FC = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    const isLoginSuccess = localStorage.getItem('login_success');
    if (isLoginSuccess === 'true') {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });
      Toast.fire({ icon: 'success', title: 'ยินดีต้อนรับกลับ! เข้าสู่ระบบสำเร็จ' });
      localStorage.removeItem('login_success'); 
    }

    const fetchFields = async () => {
      try {
        const response = await axios.get('http://localhost:3000/fields');
        setFields(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching fields:', error);
      }
    };
    fetchFields();
  }, []);

  const handleBooking = (field: Field) => {
    Swal.fire({
      title: `จองสนาม: ${field.name}`,
      html: `
        <div style="text-align: left; font-family: 'Inter', sans-serif; padding: 10px;">
          <label style="display:block; margin-bottom:8px; font-weight:600; color: #1e293b;">1. เลือกวันที่ต้องการ:</label>
          <input type="date" id="bookingDate" class="swal2-input" style="width: 100%; margin: 0 0 20px 0;" min="${new Date().toISOString().split('T')[0]}">
          
          <div style="display: flex; gap: 15px;">
            <div style="flex: 1;">
              <label style="display:block; margin-bottom:8px; font-weight:600; color: #1e293b;">2. เวลาเริ่ม:</label>
              <select id="startTime" class="swal2-input" style="width: 100%; margin: 0;">
                ${Array.from({ length: 15 }, (_, i) => i + 8).map(h => `<option value="${h.toString().padStart(2, '0')}:00">${h}:00</option>`).join('')}
              </select>
            </div>
            <div style="flex: 1;">
              <label style="display:block; margin-bottom:8px; font-weight:600; color: #1e293b;">3. เวลาสิ้นสุด:</label>
              <select id="endTime" class="swal2-input" style="width: 100%; margin: 0;">
                ${Array.from({ length: 15 }, (_, i) => i + 9).map(h => `<option value="${h.toString().padStart(2, '0')}:00">${h}:00</option>`).join('')}
              </select>
            </div>
          </div>
          <p style="margin-top: 15px; font-size: 0.85rem; color: #64748b;">* ราคาสนาม ฿${field.pricePerHour} / ชั่วโมง</p>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'ตรวจสอบสถานะ',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#2563eb',
      preConfirm: () => {
        const date = (document.getElementById('bookingDate') as HTMLInputElement).value;
        const start = (document.getElementById('startTime') as HTMLSelectElement).value;
        const end = (document.getElementById('endTime') as HTMLSelectElement).value;

        if (!date || !start || !end) {
          Swal.showValidationMessage('กรุณากรอกข้อมูลให้ครบถ้วน');
          return false;
        }
        
        const startH = parseInt(start.split(':')[0]);
        const endH = parseInt(end.split(':')[0]);

        if (startH >= endH) {
          Swal.showValidationMessage('เวลาเริ่มต้องน้อยกว่าเวลาสิ้นสุด');
          return false;
        }

        return { bookingDate: date, startTime: start, endTime: end, hours: endH - startH };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        processBooking(field, result.value);
      }
    });
  };

  const processBooking = async (field: Field, bookingData: any) => {
    try {
      Swal.fire({ title: 'กำลังตรวจสอบเวลาว่าง...', didOpen: () => Swal.showLoading(), allowOutsideClick: false });

      const checkRes = await axios.get(`http://localhost:3000/bookings/check`, {
        params: {
          fieldId: field.id,
          date: bookingData.bookingDate,
          start: bookingData.startTime,
          end: bookingData.endTime
        }
      });

      if (checkRes.data.available) {
        const totalPrice = bookingData.hours * field.pricePerHour;
        
        Swal.fire({
          icon: 'success',
          title: 'สนามว่างสำหรับคุณ!',
          text: `ระยะเวลา ${bookingData.hours} ชม. รวมเป็นเงิน ฿${totalPrice}`,
          confirmButtonText: 'ไปหน้าชำระเงิน',
          confirmButtonColor: '#10b981',
        }).then(() => {
          navigate('/payment', { 
            state: { 
              field, 
              bookingData: { ...bookingData, totalPrice } 
            } 
          });
        });
      } else {
        Swal.fire('ขออภัย!', 'สนามนี้มีคนจองในช่วงเวลาดังกล่าวแล้ว', 'error');
      }
    } catch (error) {
      console.error(error);
      Swal.fire('ผิดพลาด', 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้', 'error');
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ 
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', 
        color: 'white', 
        padding: '100px 20px', 
        textAlign: 'center',
        borderRadius: '0 0 40px 40px'
      }}>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '15px' }}>
          Sport<span style={{ color: '#3b82f6' }}>Reserve</span>
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto' }}>
          จองสนามกีฬาระดับมาตรฐานได้ง่ายๆ เพียงไม่กี่คลิก พร้อมให้บริการคุณตลอด 24 ชั่วโมง
        </p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '-50px auto 50px', padding: '0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px' }}>
          {fields.map((field) => (
            <div key={field.id} style={{ 
              backgroundColor: '#fff', 
              padding: '30px', 
              borderRadius: '24px', 
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)', 
              border: '1px solid rgba(226, 232, 240, 0.8)',
              transition: 'transform 0.3s ease'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ backgroundColor: '#eff6ff', padding: '12px', borderRadius: '14px' }}>
                  <Trophy size={24} color="#2563eb" />
                </div>
                <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.9rem', backgroundColor: '#f0fdf4', padding: '5px 12px', borderRadius: '20px' }}>
                  พร้อมจอง
                </span>
              </div>
              
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>{field.name}</h3>
              <p style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b', marginBottom: '25px' }}>
                <Clock size={16} /> ราคา ฿{field.pricePerHour} / ชั่วโมง
              </p>
              
              {token ? (
                <button 
                  onClick={() => handleBooking(field)} 
                  style={{ width: '100%', backgroundColor: '#2563eb', color: 'white', padding: '14px', borderRadius: '15px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }}
                >
                  เลือกเวลาและจองสนาม
                </button>
              ) : (
                <button 
                  onClick={() => navigate('/login')}
                  style={{ width: '100%', backgroundColor: '#f1f5f9', color: '#64748b', padding: '14px', borderRadius: '15px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  ล็อกอินเข้าสู่ระบบ
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;