import { useEffect, useState } from 'react'; 
import axios from 'axios';
import { Calendar, Clock, CheckCircle } from 'lucide-react'; 

const MyBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    const fetchMyBookings = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;
    const res = await axios.get('http://localhost:3000/bookings/my-bookings', {
      headers: { 
        Authorization: `Bearer ${token}` 
      }
    });

    // Ensure we always set an array
    const data = Array.isArray(res.data) ? res.data : [];
    setBookings(data);
  } catch (err) {
    console.error("Error fetching bookings:", err);
  }
};
    fetchMyBookings();
  }, []);

  return (
    <div style={{ padding: '40px 20px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '40px', fontWeight: '800', color: '#1e293b' }}>ประวัติการจองของฉัน</h2>
      
      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {(!Array.isArray(bookings) || bookings.length === 0) ? (
          <p style={{ textAlign: 'center', color: '#64748b' }}>คุณยังไม่มีรายการจองในขณะนี้</p>
        ) : (
          bookings.map((booking: any) => {
            const fieldName = booking?.field?.name ?? 'สนาม (ข้อมูลหายไป)';
            const total = booking?.totalPrice ?? 0;
            return (
            <div key={booking.id ?? Math.random()} style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0' }}>
              <div>
                <h3 style={{ margin: '0 0 10px 0', color: '#2563eb' }}>{fieldName}</h3>
                <div style={{ display: 'flex', gap: '20px', color: '#64748b', fontSize: '0.9rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={16} /> {booking.bookingDate}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Clock size={16} /> {booking.startTime} - {booking.endTime}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ backgroundColor: '#f0fdf4', color: '#16a34a', padding: '6px 15px', borderRadius: '99px', fontSize: '0.85rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <CheckCircle size={14} /> ชำระเงินแล้ว
                </span>
                <p style={{ margin: '10px 0 0 0', fontWeight: '700', fontSize: '1.1rem' }}>฿{total}</p>
              </div>
            </div>
            )
          })
        )}
      </div>
    </div>
  );
};

export default MyBookings;