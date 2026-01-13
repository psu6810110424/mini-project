import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Trophy, Clock, ChevronRight, ListOrdered, LogOut, User } from 'lucide-react';
import type { Field } from '../interfaces/types';

const Home = () => {
  const [fields, setFields] = useState<Field[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('user_role');
  const navigate = useNavigate();

 
  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const fetchFields = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/fields');
      if (response.data) {
        setFields(Array.isArray(response.data) ? response.data : []);
      }
    } catch (error) {
      console.error('Error fetching fields:', error);
      setFields([]); 
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFields();
  }, [fetchFields]);

  const processBooking = async (field: Field, bookingData: any) => {
    try {
      Swal.fire({ title: 'กำลังตรวจสอบสนาม...', didOpen: () => Swal.showLoading() });
      
      const res = await axios.get(`http://localhost:3000/bookings/check`, {
        params: { 
          fieldId: field.id, 
          date: bookingData.bookingDate, 
          start: bookingData.startTime, 
          end: bookingData.endTime 
        }
      });

      if (res.data.available) {
        const h = parseInt(bookingData.endTime) - parseInt(bookingData.startTime);
        const totalPrice = h * field.pricePerHour;

        navigate('/payment', { 
          state: { field, bookingData: { ...bookingData, hours: h, totalPrice } } 
        });
        Swal.close();
      } else {
        Swal.fire('ขออภัย', 'เวลานี้มีคนจองแล้ว', 'warning');
      }
    } catch (e) { 
      Swal.fire('ผิดพลาด', 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์', 'error'); 
    }
  };

  const handleBooking = (field: Field) => {
    const minDate = new Date().toISOString().split('T')[0]; 
    Swal.fire({
      title: `<span style="font-size:1.5rem; font-weight:800;">จองสนาม: ${field.name}</span>`,
      html: `
        <div style="text-align:left; font-family:'Inter', sans-serif;">
          <div style="margin-bottom:15px;">
            <label style="display:block; font-weight:600; margin-bottom:5px;">วันที่ต้องการจอง</label>
            <input type="date" id="bookingDate" class="swal2-input" style="width:100%; margin:0;" min="${minDate}" />
          </div>
          <div style="display:flex; gap:10px; margin-bottom:15px;">
            <div style="flex:1;">
              <label style="display:block; font-weight:600;">เริ่ม</label>
              <select id="startTime" class="swal2-input" style="width:100%; margin:0;">
                ${[7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22].map(h => `<option value="${h}:00">${h}:00</option>`).join('')}
              </select>
            </div>
            <div style="flex:1;">
              <label style="display:block; font-weight:600;">ถึง</label>
              <select id="endTime" class="swal2-input" style="width:100%; margin:0;">
                ${[8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23].map(h => `<option value="${h}:00">${h}:00</option>`).join('')}
              </select>
            </div>
          </div>
          <label style="display:block; font-weight:600; margin-bottom:10px;">วิธีชำระเงิน</label>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
            <label class="pay-method selected" id="label-transfer">
              <input type="radio" name="pay-m" value="transfer" checked style="display:none" />
              <span>โอนเงิน / QR</span>
            </label>
            <label class="pay-method" id="label-cash">
              <input type="radio" name="pay-m" value="cash" style="display:none" />
              <span>ชำระหน้าสนาม</span>
            </label>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'ยืนยันการจอง',
      confirmButtonColor: '#0066FF',
      didOpen: () => {
        const t = document.getElementById('label-transfer');
        const c = document.getElementById('label-cash');
        t?.addEventListener('click', () => { t.classList.add('selected'); c?.classList.remove('selected'); });
        c?.addEventListener('click', () => { c.classList.add('selected'); t?.classList.remove('selected'); });
      },
      preConfirm: () => {
        const date = (document.getElementById('bookingDate') as HTMLInputElement).value;
        const start = (document.getElementById('startTime') as HTMLSelectElement).value;
        const end = (document.getElementById('endTime') as HTMLSelectElement).value;
        const payment = (document.querySelector('input[name="pay-m"]:checked') as HTMLInputElement).value;

        if (!date || !start || !end) return Swal.showValidationMessage('กรุณากรอกข้อมูลให้ครบ');
        if (parseInt(start) >= parseInt(end)) return Swal.showValidationMessage('เวลาเริ่มต้องน้อยกว่าเวลาเลิก');
        
        return { bookingDate: date, startTime: start, endTime: end, paymentMethod: payment };
      }
    }).then((res) => {
      if (res.isConfirmed) processBooking(field, res.value);
    });
  };
  const filteredFields = selectedCategory === 'All' 
    ? fields 
    : fields.filter(field => field.type?.toLowerCase() === selectedCategory.toLowerCase());

  
    return (
    <div style={{ backgroundColor: '#f4f7fa', minHeight: '100vh', fontFamily: "'Kanit', sans-serif" }}>
      
      <nav style={{ backgroundColor: '#1a202c', color: 'white', padding: '12px 0', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 15px rgba(0,0,0,0.4)' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto', display: 'flex', justifyContent: 'flex-start', alignItems: 'center', padding: '0 25px' }}>
          
          <div style={{ fontSize: '1.6rem', fontWeight: 900, cursor: 'pointer', letterSpacing: '-1.5px', marginRight: '50px' }} onClick={() => navigate('/')}>
            SPORT<span style={{ color: '#0066FF' }}>RESERVE</span>
          </div>

          <div style={{ display: 'flex', gap: '35px', alignItems: 'center' }}>
            <span 
              onClick={() => setSelectedCategory('All')}
              style={{ cursor: 'pointer', color: selectedCategory === 'All' ? '#0066FF' : 'white', fontWeight: selectedCategory === 'All' ? 'bold' : 'normal' }}>
              Home
            </span>
            <span 
              onClick={() => setSelectedCategory('Football')}
              style={{ cursor: 'pointer', color: selectedCategory === 'Football' ? '#0066FF' : 'white', fontWeight: selectedCategory === 'Football' ? 'bold' : 'normal', opacity: selectedCategory === 'Football' ? 1 : 0.8 }}>
              Football
            </span>
            <span 
              onClick={() => setSelectedCategory('Badminton')}
              style={{ cursor: 'pointer', color: selectedCategory === 'Badminton' ? '#0066FF' : 'white', fontWeight: selectedCategory === 'Badminton' ? 'bold' : 'normal', opacity: selectedCategory === 'Badminton' ? 1 : 0.8 }}>
              Badminton
            </span>
          </div>
            
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '20px' }}>
            {token ? (
              <>
    
                {role === 'ADMIN' && (
                  <button onClick={() => navigate('/admin/dashboard')} style={{ backgroundColor: '#10b981', color: 'white', padding: '8px 18px', borderRadius: '25px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    🛡️ จัดการระบบ
                  </button>
                )}
                <span onClick={() => navigate('/my-bookings')} style={{ cursor: 'pointer', fontSize: '0.9rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <ListOrdered size={16} /> ประวัติการจอง
                </span>
                <button onClick={handleLogout} style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', padding: '6px 18px', borderRadius: '25px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                  <LogOut size={16} style={{ marginRight: '5px' }} /> ออกจากระบบ
                </button>
              </>
            ) : (
    
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}>เข้าสู่ระบบ</button>
                <button onClick={() => navigate('/register')} style={{ backgroundColor: '#0066FF', color: 'white', padding: '10px 25px', borderRadius: '25px', border: 'none', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={18} /> สมัครสมาชิก
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>


    <header style={{ background: '#2d3748', padding: '60px 20px', textAlign: 'center', color: 'white' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', letterSpacing: '2px', margin: 0 }}>
            {selectedCategory === 'All' ? 'RECOMMEND' : selectedCategory.toUpperCase()}
          </h1>
          <div style={{ width: '60px', height: '4px', background: '#0066FF', margin: '15px auto' }}></div>
          <p style={{ opacity: 0.7, fontSize: '1.1rem' }}>
            {selectedCategory === 'All' ? 'เลือกสนามคุณภาพที่ได้รับการแนะนำสูงสุด' : `รายการสนามประเภท ${selectedCategory} ที่เปิดให้บริการ`}
          </p>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '-40px auto 60px', padding: '0 20px' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
            {[1, 2, 3, 4].map(i => <div key={i} className="skeleton-card" style={{ height: '400px', background: 'white', borderRadius: '12px' }} />)}
          </div>
        ) : (
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '25px' }}>
            {filteredFields.length > 0 ? (
              filteredFields.map(field => (
                <div key={field.id} className="marketplace-card" style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', border: '1px solid #edf2f7' }}>
                  <div style={{ height: '200px', position: 'relative' }}>
                    <img src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=600" alt="สนาม" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', top: '12px', left: '12px', background: '#0066FF', color: 'white', padding: '4px 12px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                      {field.type || 'Recommend'}
                    </div>
                    <div style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(0,0,0,0.7)', color: 'white', padding: '4px 10px', borderRadius: '6px', fontWeight: 700 }}>฿{field.pricePerHour}/hr</div>
                  </div>
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', color: '#2d3748' }}>{field.name}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '20px', color: '#718096', fontSize: '0.9rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Clock size={14} /> Open 07:00 - 23:00</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Trophy size={14} /> หญ้าเทียมเกรดดี</span>
                    </div>
                    <button onClick={() => token ? handleBooking(field) : navigate('/login')} style={{ width: '100%', background: '#edf2f7', border: 'none', padding: '12px', borderRadius: '8px', color: '#2d3748', fontWeight: 700, cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                      จองสนามตอนนี้ <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '50px', color: '#718096' }}>
                <h3>ไม่พบสนามในหมวดหมู่นี้</h3>
              </div>
            )}
          </div>
        )}
      </main>

      <style>{`
        .pay-method { border: 2px solid #edf2f7; padding: 15px; border-radius: 10px; cursor: pointer; text-align: center; transition: all 0.2s; }
        .pay-method.selected { border-color: #0066FF; background: #ebf4ff; color: #0066FF; font-weight: bold; }
        .skeleton-card { animation: pulse 1.5s infinite; background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; }
        @keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }
        .marketplace-card:hover { transform: translateY(-5px); transition: transform 0.3s ease; }
      `}</style>
    </div>
  );
};

export default Home;