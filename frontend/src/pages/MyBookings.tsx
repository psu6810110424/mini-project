import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Clock, Calendar, User, ChevronLeft } from 'lucide-react';

interface Booking {
  id: number;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: string;
  totalPrice: number;
  field: {
    name: string;
  };
  user?: {
    username: string;
    email: string;
  };
}

const MyBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('user_role'); // 'ADMIN' หรือ 'USER'
  const navigate = useNavigate();

  const getSwal = () => (window as any).Swal;

  useEffect(() => {
    const scriptId = 'sweetalert2-cdn';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://cdn.jsdelivr.net/npm/sweetalert2@11';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    const Swal = getSwal();
    try {
      const endpoint = role === 'ADMIN' 
        ? 'http://localhost:3000/bookings/admin/all' 
        : 'http://localhost:3000/bookings/my';

      const res = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setBookings(res.data);
    } catch (err) {
      console.error(err);
      if (Swal) {
        Swal.fire('ผิดพลาด', 'ไม่สามารถโหลดประวัติการจองได้', 'error');
      }
    } finally {
      setLoading(false);
    }
  }, [token, role]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchHistory();
  }, [fetchHistory, token, navigate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return { bg: '#dcfce7', text: '#15803d' };
      case 'CANCELLED': return { bg: '#fee2e2', text: '#b91c1c' };
      default: return { bg: '#fef3c7', text: '#92400e' }; // PENDING
    }
  };

  return (
    <div style={{ padding: '40px 20px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'Kanit, sans-serif' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header Section */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
          <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontWeight: 600 }}>
            <ChevronLeft size={20} /> กลับหน้าหลัก
          </button>
          <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#1e293b' }}>
            {role === 'ADMIN' ? '📑 ประวัติการจองทั้งหมด (Admin View)' : '🕒 ประวัติการจองของฉัน'}
          </h1>
          <div style={{ width: '100px' }}></div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px', color: '#64748b' }}>กำลังโหลดประวัติ...</div>
        ) : bookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px', backgroundColor: 'white', borderRadius: '20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#64748b', fontSize: '1.2rem' }}>ไม่พบประวัติการจองในขณะนี้</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {bookings.map((booking) => (
              <div 
                key={booking.id} 
                style={{ 
                  backgroundColor: 'white', 
                  padding: '20px', 
                  borderRadius: '15px', 
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                {/* ข้อมูลการจอง */}
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div style={{ backgroundColor: '#eff6ff', padding: '15px', borderRadius: '12px' }}>
                    <Calendar size={24} color="#3b82f6" />
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', color: '#1e293b' }}>{booking.field.name}</h3>
                    <div style={{ display: 'flex', gap: '15px', color: '#64748b', fontSize: '0.9rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Clock size={14} /> {booking.startTime} - {booking.endTime}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Calendar size={14} /> {booking.bookingDate}
                      </span>
                    </div>
  
                    {role === 'ADMIN' && (
                      <div style={{ marginTop: '8px', fontSize: '0.85rem', color: '#0066FF', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <User size={14} /> ผู้จอง: {booking.user?.username || 'ไม่ระบุชื่อ'}
                      </div>
                    )}
                  </div>
                </div>

                {/* ราคาสรุปและสถานะ */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', marginBottom: '8px' }}>
                    ฿{booking.totalPrice.toLocaleString()}
                  </div>
                  <span style={{ 
                    padding: '5px 15px', 
                    borderRadius: '20px', 
                    fontSize: '0.75rem', 
                    fontWeight: 700,
                    backgroundColor: getStatusColor(booking.status).bg,
                    color: getStatusColor(booking.status).text
                  }}>
                    {booking.status === 'CONFIRMED' ? 'ชำระเงินแล้ว' : booking.status === 'CANCELLED' ? 'ยกเลิกแล้ว' : 'รอการตรวจสอบ'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;