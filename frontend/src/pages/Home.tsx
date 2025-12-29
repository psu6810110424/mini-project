import React, { useEffect, useState } from 'react';
import axios from 'axios';
import type { Field } from '../interfaces/types';

const Home: React.FC = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const token = localStorage.getItem('token');
  const userRole = (token ? 'USER' : 'GUEST') as 'ADMIN' | 'USER' | 'GUEST';

  useEffect(() => {
    const fetchFields = async () => {
      try {
        const response = await axios.get('http://localhost:3000/fields');
        setFields(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching fields:', error);
        setFields([]);
      }
    };
    fetchFields();
  }, []);

  const handleBooking = (fieldName: string) => {
    alert(`ยืนยันการจอง\nสนาม: ${fieldName}\nระบบกำลังนำคุณไปยังหน้าชำระเงิน...`);
  };

  return (
    <div style={{ padding: '40px 20px', backgroundColor: '#f9fafb', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', color: '#111827', marginBottom: '40px', fontSize: '2.5rem' }}>
        สนามกีฬาที่เปิดให้บริการ
      </h1>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '25px', maxWidth: '1200px', margin: '0 auto' 
      }}>
        {fields.length > 0 ? (
          fields.map((field) => (
            <div key={field.id} style={{ 
              backgroundColor: '#fff', padding: '24px', borderRadius: '16px', 
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb' 
            }}>
              <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
                {field.name}
              </div>
              <p style={{ color: '#6b7280', marginBottom: '20px' }}>
                ราคาเริ่มต้น <span style={{ color: '#059669', fontWeight: '600' }}>{field.pricePerHour} บาท</span> / ชม.
              </p>
              
              <div style={{ display: 'flex', gap: '10px' }}>
                {token && (
                  <button 
                    onClick={() => handleBooking(field.name)} 
                    style={{ 
                      flex: 1, backgroundColor: '#2563eb', color: 'white', padding: '10px', 
                      borderRadius: '8px', border: 'none', fontWeight: '600', cursor: 'pointer' 
                    }}
                  >
                    จองสนามตอนนี้
                  </button>
                )}
                {userRole === 'ADMIN' && (
                  <button style={{ backgroundColor: '#ef4444', color: 'white', padding: '10px 15px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                    ลบ
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#9ca3af' }}>กำลังโหลดข้อมูล...</div>
        )}
      </div>
    </div>
  );
};

export default Home;