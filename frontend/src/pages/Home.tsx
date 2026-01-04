import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Trophy, Clock,} from 'lucide-react'; // อย่าลืม npm install lucide-react
import type { Field } from '../interfaces/types'; 

const Home: React.FC = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    // แจ้งเตือน Toast เมื่อ Login สำเร็จ
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

  // --- Logic การจองคงเดิมตามที่คุณเขียนไว้ ---
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
    }).then((result) => { if (result.isConfirmed) choosePaymentMethod(field); });
  };

  const choosePaymentMethod = (field: Field) => {
    Swal.fire({
      title: 'เลือกวิธีการชำระเงิน',
      input: 'radio',
      inputOptions: { 'promptpay': 'PromptPay (QR Code)', 'credit': 'บัตรเครดิต/เดบิต', 'cash': 'ชำระที่หน้าสนาม' },
      inputValidator: (value) => { if (!value) return 'กรุณาเลือกช่องทางชำระเงิน!'; },
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
        }).then(() => { navigate('/payment', { state: { field: field, method: result.value } }); });
      }
    });
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Hero Section: แยกออกจากส่วนรายการสนามชัดเจน */}
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

      {/* Content Section */}
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
                  ว่างวันนี้
                </span>
              </div>
              
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>{field.name}</h3>
              <p style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b', marginBottom: '25px' }}>
                <Clock size={16} /> ราคา ฿{field.pricePerHour} / ชั่วโมง
              </p>
              
              {token ? (
                <button 
                  onClick={() => handleBooking(field)} 
                  style={{ width: '100%', backgroundColor: '#2563eb', color: 'white', padding: '14px', borderRadius: '15px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)' }}
                >
                  จองสนามตอนนี้
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