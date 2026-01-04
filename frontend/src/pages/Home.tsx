import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
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

      Toast.fire({
        icon: 'success',
        title: 'ยินดีต้อนรับ! เข้าสู่ระบบสำเร็จ'
      });
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
      title: 'ยืนยันการจองสนาม',
      text: `คุณต้องการจอง ${field.name} ใช่หรือไม่?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#d33',
      confirmButtonText: 'จองเลย!',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        choosePaymentMethod(field);
      }
    });
  };

  const choosePaymentMethod = (field: Field) => {
    Swal.fire({
      title: 'เลือกวิธีการชำระเงิน',
      input: 'radio',
      inputOptions: {
        'promptpay': 'PromptPay (QR Code)',
        'credit': 'บัตรเครดิต/เดบิต',
        'cash': 'ชำระที่หน้าสนาม'
      },
      inputValidator: (value) => {
        if (!value) return 'กรุณาเลือกช่องทางชำระเงิน!';
      },
      confirmButtonText: 'ถัดไป',
      confirmButtonColor: '#10b981',
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
            title: 'กำลังพาไปหน้าชำระเงิน',
            timer: 800,
            showConfirmButton: false,
            didOpen: () => { Swal.showLoading(); }
        }).then(() => {
            navigate('/payment', { state: { field: field, method: result.value } });
        });
      }
    });
  };

  return (
    <div style={{ padding: '60px 20px', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '50px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: '#111827', marginBottom: '10px' }}>
          สนามกีฬาที่<span style={{ color: '#2563eb' }}>เปิดให้บริการ</span>
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#6b7280' }}>จองสนามที่คุณชื่นชอบได้รวดเร็ว ตลอด 24 ชั่วโมง</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px', maxWidth: '1200px', margin: '0 auto' }}>
        {fields.map((field) => (
          <div key={field.id} style={{ 
            backgroundColor: '#fff', 
            padding: '30px', 
            borderRadius: '24px', 
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', 
            border: '1px solid #f1f5f9',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ width: '50px', height: '50px', backgroundColor: '#eff6ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <span style={{ fontSize: '1.5rem' }}>🏟️</span>
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#1f2937', marginBottom: '10px' }}>{field.name}</h3>
            <p style={{ color: '#6b7280', fontSize: '1rem', marginBottom: '25px' }}>
                ราคา: <span style={{ fontWeight: '800', color: '#2563eb', fontSize: '1.2rem' }}>฿{field.pricePerHour}</span> / ชม.
            </p>
            
            {token ? (
              <button 
                onClick={() => handleBooking(field)} 
                style={{ width: '100%', backgroundColor: '#2563eb', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', transition: 'background 0.2s' }}
              >
                จองสนามตอนนี้
              </button>
            ) : (
              <button 
                onClick={() => navigate('/login')}
                style={{ width: '100%', backgroundColor: '#f1f5f9', color: '#64748b', padding: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
              >
                ล็อกอินเพื่อจอง
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;