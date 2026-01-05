import { useEffect, useState } from 'react'; 
import axios from 'axios';
import { Calendar, Clock, ChevronDown, ChevronUp } from 'lucide-react'; 

const MyBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [openIds, setOpenIds] = useState<Record<string | number, boolean>>({});

  const toggleOpen = (id: string | number) => {
    setOpenIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

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
          bookings.map((booking: any, idx: number) => {
            const fieldName = booking?.field?.name ?? 'สนาม (ข้อมูลหายไป)';
            const total = booking?.totalPrice ?? 0;
            const created = booking?.createdAt ? new Date(booking.createdAt).toLocaleString() : '-';
            const status = booking?.status ?? 'PENDING';
            const statusColor = status === 'CANCELLED' ? '#fecaca' : status === 'PENDING' ? '#fde68a' : '#bbf7d0';
            const statusTextColor = status === 'CANCELLED' ? '#b91c1c' : status === 'PENDING' ? '#92400e' : '#15803d';

            const idKey = booking.id ?? `idx-${idx}`;
            const open = !!openIds[idKey];

            return (
              <div key={idKey} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #e2e8f0' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                    <div>
                      <h3 style={{ margin: '0 0 8px 0', color: '#2563eb' }}>{fieldName}</h3>
                      <div style={{ display: 'flex', gap: '18px', color: '#64748b', fontSize: '0.9rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={16} /> {booking.bookingDate}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={16} /> {booking.startTime} - {booking.endTime}</span>
                      </div>
                      <div style={{ marginTop: 8, color: '#64748b', fontSize: '0.85rem' }}>Booking ID: #{booking.id ?? '-'}</div>
                      <div style={{ marginTop: 4, color: '#94a3b8', fontSize: '0.8rem' }}>Created: {created}</div>
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                      <div style={{ backgroundColor: statusColor, color: statusTextColor, padding: '6px 12px', borderRadius: 999, fontWeight: 700, fontSize: '0.85rem' }}>{status === 'PENDING' ? 'รอดำเนินการ' : status === 'CANCELLED' ? 'ยกเลิก' : 'ชำระเงินแล้ว'}</div>
                      <div style={{ marginTop: 6, fontWeight: 800, fontSize: '1.05rem' }}>฿{Number(total).toFixed(2)}</div>
                      <button onClick={() => toggleOpen(idKey)} style={{ marginTop: 8, background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />} รายละเอียด
                      </button>
                    </div>
                  </div>

                  {open && (
                    <div style={{ marginTop: 12, padding: 12, background: '#f8fafc', borderRadius: 8, border: '1px solid #e6edf3', color: '#475569' }}>
                      <div><strong>สนาม ID:</strong> {booking?.field?.id ?? '-'}</div>
                      <div><strong>สถานะ:</strong> {status}</div>
                      <div><strong>สร้างเมื่อ:</strong> {created}</div>
                      <div><strong>เวลา:</strong> {booking.startTime} - {booking.endTime}</div>
                      <div><strong>ราคา/ชั่วโมง:</strong> ฿{booking?.field?.pricePerHour ?? '-'}</div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MyBookings;