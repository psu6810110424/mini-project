import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Trophy, Clock, LogOut, ListOrdered, Calendar, ChevronRight } from 'lucide-react';
import type { Field } from '../interfaces/types';

const Home = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
    window.location.reload();
  };

  const fetchFields = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/fields');
      setFields(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching fields:', error);
    } finally {
      setTimeout(() => setLoading(false), 800); 
    }
  }, []);

  useEffect(() => {
    fetchFields();
  }, [fetchFields]);

  const handleBooking = (field: Field) => {
    Swal.fire({
      title: `จองสนาม: ${field.name}`,
      html: `
        <div style="text-align: left; padding: 10px;">
          <label style="display:block; margin-bottom:8px; font-weight:600; color: #1e293b;">วันที่ต้องการจอง</label>
          <input type="date" id="bookingDate" class="swal2-input" style="width: 100%; margin: 0 0 15px 0;" min="${new Date().toISOString().split('T')[0]}">
          <div style="display: flex; gap: 10px;">
            <div style="flex: 1;">
              <label style="font-size: 0.85rem; color: #64748b;">เวลาเริ่ม</label>
              <select id="startTime" class="swal2-input" style="width: 100%; margin: 5px 0 0 0;">
                ${[7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22].map(h => `<option value="${h}:00">${h}:00</option>`).join('')}
              </select>
            </div>
            <div style="flex: 1;">
              <label style="font-size: 0.85rem; color: #64748b;">สิ้นสุด</label>
              <select id="endTime" class="swal2-input" style="width: 100%; margin: 5px 0 0 0;">
                ${[8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23].map(h => `<option value="${h}:00">${h}:00</option>`).join('')}
              </select>
            </div>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'ตรวจสอบความว่าง',
      confirmButtonColor: '#3b82f6',
      preConfirm: () => {
        const date = (document.getElementById('bookingDate') as HTMLInputElement).value;
        const start = (document.getElementById('startTime') as HTMLSelectElement).value;
        const end = (document.getElementById('endTime') as HTMLSelectElement).value;
        if (!date || !start || !end) return Swal.showValidationMessage('กรุณากรอกข้อมูลให้ครบ');
        const s = parseInt(start.split(':')[0]);
        const e = parseInt(end.split(':')[0]);
        if (s >= e) return Swal.showValidationMessage('เวลาเริ่มต้องน้อยกว่าเวลาจบ');
        return { bookingDate: date, startTime: start, endTime: end, hours: e - s };
      }
    }).then((result) => {
      if (result.isConfirmed) processBooking(field, result.value);
    });
  };

  const processBooking = async (field: Field, bookingData: any) => {
    try {
      Swal.fire({ title: 'กำลังตรวจสอบ...', didOpen: () => Swal.showLoading() });
      const res = await axios.get(`http://localhost:3000/bookings/check`, {
        params: { fieldId: field.id, date: bookingData.bookingDate, start: bookingData.startTime, end: bookingData.endTime }
      });

      if (res.data.available) {
        const totalPrice = bookingData.hours * field.pricePerHour;
        navigate('/payment', { state: { field, bookingData: { ...bookingData, totalPrice } } });
        Swal.close();
      } else {
        Swal.fire('ขออภัย', 'เวลานี้มีคนจองแล้ว', 'warning');
      }
    } catch (e) {
      Swal.fire('ผิดพลาด', 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์', 'error');
    }
  };

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>

      {/* Hero Section - full width */}
      <header style={{ 
        background: 'linear-gradient(180deg, #0f172a 0%, #0b1220 100%)', 
        color: 'white', padding: '120px 4%', textAlign: 'center',
        position: 'relative', overflow: 'hidden', width: '100%'
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: '3.8rem', fontWeight: 900, margin: '0 0 15px 0', letterSpacing: '-2px' }}>หาสนามฟุตบอล?</h1>
          <p style={{ color: '#94a3b8', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>จองสนามคุณภาพดีที่สุดในพื้นที่ของคุณ พร้อมโปรโมชั่นพิเศษทุกสัปดาห์</p>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ width: '100%', margin: '-80px 0 60px', padding: '0 4%', position: 'relative', zIndex: 2 }}>
        
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton-pulse" style={{ height: '350px', backgroundColor: 'white', borderRadius: '28px', opacity: 0.6 }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '34px', alignItems: 'stretch' }}>
            {fields.map(field => (
              <div 
                key={field.id} 
                style={{ 
                  backgroundColor: 'rgba(255,255,255,0.98)', padding: '28px', borderRadius: '18px', 
                  boxShadow: '0 18px 40px -12px rgba(2,6,23,0.45)',
                  border: 'none',
                  transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-10px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div style={{ backgroundColor: '#eff6ff', padding: '12px', borderRadius: '15px' }}>
                    <Trophy size={28} color="#3b82f6" />
                  </div>
                  <span style={{ backgroundColor: '#f0fdf4', color: '#16a34a', padding: '6px 14px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>
                    พร้อมบริการ
                  </span>
                </div>
                
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 10px 0', color: '#1e293b' }}>{field.name}</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
                  <p style={{ margin: 0, color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={18} /> ฿{field.pricePerHour.toLocaleString()} / ชั่วโมง
                  </p>
                  <p style={{ margin: 0, color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={18} /> จองขั้นต่ำ 1 ชั่วโมง
                  </p>
                </div>
                
                <button 
                  onClick={() => token ? handleBooking(field) : navigate('/login')}
                  style={{ 
                    width: '100%', padding: '16px', borderRadius: '18px', border: 'none', 
                    backgroundColor: token ? '#3b82f6' : '#94a3b8', 
                    color: 'white', cursor: 'pointer', fontWeight: 800, fontSize: '1rem',
                    display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px',
                    boxShadow: token ? '0 10px 15px -3px rgba(59, 130, 246, 0.3)' : 'none',
                    transition: '0.2s'
                  }}
                  onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                  onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {token ? 'จองตอนนี้' : 'ล็อกอินเพื่อจอง'} <ChevronRight size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      <style>{`
        @keyframes pulse {
          0% { background-color: #f1f5f9; }
          50% { background-color: #e2e8f0; }
          100% { background-color: #f1f5f9; }
        }
        .skeleton-pulse {
          animation: pulse 1.5s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Home;