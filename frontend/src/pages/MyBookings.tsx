import { useEffect, useState } from 'react'; 
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react'; 

const MyBookings = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [openIds, setOpenIds] = useState<Record<string | number, boolean>>({});
  const navigate = useNavigate();

  const toggleOpen = (id: string | number) => {
    setOpenIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const fetchMyBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');
      const res = await axios.get('http://localhost:3000/bookings/my-bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  const handleCancel = async (id: number) => {
    const confirm = await Swal.fire({
      title: 'ต้องการยกเลิกการจอง?',
      text: "รายการนี้จะถูกเปลี่ยนสถานะเป็น ยกเลิก",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      confirmButtonText: 'ยืนยันยกเลิก'
    });

    if (confirm.isConfirmed) {
      try {
        const token = localStorage.getItem('token');
        await axios.patch(`http://localhost:3000/bookings/${id}/cancel`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Immediately remove the canceled (unpaid) booking from the UI
        setBookings(prev => prev.filter(b => b.id !== id));

        Swal.fire('สำเร็จ', 'รายการจองถูกลบออกจากรายการของคุณแล้ว', 'success');
      } catch (err: any) {
        Swal.fire('ผิดพลาด', err.response?.data?.message || 'ไม่สามารถยกเลิกได้', 'error');
      }
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  return (
    <div style={{ padding: '40px 20px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', marginBottom: '20px' }}>
          <ArrowLeft size={18} /> กลับหน้าหลัก
        </button>
        
        <h2 style={{ textAlign: 'center', marginBottom: '30px', fontWeight: '800' }}>ประวัติการจองของฉัน</h2>

        {bookings.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#64748b' }}>คุณยังไม่มีรายการจองในขณะนี้</p>
        ) : (
          bookings.map((booking) => {
            const fieldName = booking?.field?.name ?? 'สนามฟุตบอล';
            const status = booking?.status ?? 'PENDING';
            const statusColor = status === 'CANCELLED' ? '#fee2e2' : status === 'PENDING' ? '#fef3c7' : '#dcfce7';
            const statusTextColor = status === 'CANCELLED' ? '#b91c1c' : status === 'PENDING' ? '#92400e' : '#15803d';

            return (
              <div key={booking.id} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '15px', marginBottom: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: 0, color: '#1e293b' }}>{fieldName}</h3>
                    <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: 5 }}>
                      <Calendar size={14} style={{ verticalAlign: 'middle' }} /> {booking.bookingDate} | 
                      <Clock size={14} style={{ verticalAlign: 'middle', marginLeft: 10 }} /> {booking.startTime}-{booking.endTime}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ 
                      padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold',
                      backgroundColor: statusColor, color: statusTextColor
                    }}>
                      {status === 'PENDING' ? 'รอดำเนินการ' : status === 'CANCELLED' ? 'ยกเลิก' : 'ยืนยันแล้ว'}
                    </span>
                    <div style={{ marginTop: '8px', fontWeight: 'bold', fontSize: '1.1rem' }}>฿{Number(booking.totalPrice).toLocaleString()}</div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '15px', borderTop: '1px solid #f1f5f9', paddingTop: '10px' }}>
                  <button onClick={() => toggleOpen(booking.id)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                    {openIds[booking.id] ? <ChevronUp size={14}/> : <ChevronDown size={14}/>} รายละเอียด
                  </button>
                  {/* แสดงปุ่มยกเลิกเฉพาะรายการที่ยัง PENDING */}
                  {status === 'PENDING' && (
                    <button onClick={() => handleCancel(booking.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }} aria-label="ยกเลิกการจอง">
                      <i className="bi bi-trash" style={{ fontSize: 16 }} />
                      <span>ยกเลิกการจอง</span>
                    </button>
                  )}
                </div>

                {openIds[booking.id] && (
                  <div style={{ marginTop: '10px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', fontSize: '0.85rem', color: '#475569', border: '1px solid #e2e8f0' }}>
                    <p style={{ margin: '4px 0' }}><strong>Booking ID:</strong> #{booking.id}</p>
                    <p style={{ margin: '4px 0' }}><strong>บันทึกเมื่อ:</strong> {new Date(booking.createdAt).toLocaleString()}</p>
                    <p style={{ margin: '4px 0' }}><strong>ราคาต่อชั่วโมง:</strong> ฿{booking.field?.pricePerHour ?? '-'}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MyBookings;