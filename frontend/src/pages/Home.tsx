import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import type { Field } from '../interfaces/types'; // ตรวจสอบว่า path นี้ถูกต้องตามที่สร้างในข้อ 1

const Home: React.FC = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
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

  // ฟังก์ชันจองสนามหลัก
  const handleBooking = (field: Field) => {
    Swal.fire({
      title: 'ยืนยันการจองสนาม',
      text: `คุณต้องการจอง ${field.name} ราคา ${field.pricePerHour} บาท ใช่หรือไม่?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      confirmButtonText: 'ยืนยัน',
      cancelButtonText: 'ยกเลิก'
    }).then((result) => {
      if (result.isConfirmed) {
        choosePaymentMethod(field);
      }
    });
  };

  // ฟังก์ชันเลือกวิธีชำระเงิน
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
        if (!value) return 'กรุณาเลือกวิธีชำระเงิน!';
      },
      confirmButtonText: 'ถัดไป',
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        // ย้ายไปหน้า Payment พร้อมส่งข้อมูล
        navigate('/payment', { state: { field: field, method: result.value } });
      }
    });
  };

  return (
    <div style={{ padding: '40px 20px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>สนามกีฬาที่เปิดให้บริการ</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px', maxWidth: '1200px', margin: '0 auto' }}>
        {fields.map((field) => (
          <div key={field.id} style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <h3>{field.name}</h3>
            <p>ราคา: {field.pricePerHour} บาท / ชม.</p>
            {token && (
              <button 
                onClick={() => handleBooking(field)} 
                style={{ width: '100%', backgroundColor: '#2563eb', color: 'white', padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
              >
                จองสนาม
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;