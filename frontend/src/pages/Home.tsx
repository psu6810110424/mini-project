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

 return (
    <div style={{ padding: '20px' }}>
      <h1>สนามกีฬาที่เปิดให้บริการ</h1>
      <div style={{ display: 'grid', gap: '20px' }}>
        {/* เช็คว่าเป็น Array และมีข้อมูลค่อยทำการ Map */}
        {Array.isArray(fields) && fields.length > 0 ? (
          fields.map((field) => (
            <div key={field.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
              <h3>{field.name}</h3>
              <p>ราคา: {field.pricePerHour} บาท/ชั่วโมง</p>
              
              {/* ปุ่มสำหรับคน Login แล้ว (USER) */}
              {token && (
                <button style={{ backgroundColor: '#4CAF50', color: 'white', marginRight: '10px', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  จองสนาม
                </button>
              )}

              {/* ปุ่มสำหรับ ADMIN */}
              {userRole === 'ADMIN' && (
                <button style={{ backgroundColor: '#f44336', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  ลบสนาม (Admin Only)
                </button>
              )}
            </div>
          ))
        ) : (
          <p>ขณะนี้ยังไม่มีข้อมูลสนาม หรือ กำลังโหลดข้อมูล...</p>
        )}
      </div>
    </div>
  );
};
export default Home;