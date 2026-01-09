import { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Trash2, ArrowLeft, } from 'lucide-react';

const AdminDashboard = () => {
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchAllBookings = async () => {
    try {
      const res = await axios.get('http://localhost:3000/bookings/admin/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllBookings(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire('ผิดพลาด', 'ไม่สามารถดึงข้อมูลได้ (เฉพาะ Admin)', 'error');
      navigate('/');
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await axios.patch(`http://localhost:3000/bookings/admin/${id}/status`, 
        { status }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire('สำเร็จ', `เปลี่ยนสถานะเป็น ${status} แล้ว`, 'success');
      fetchAllBookings();
    } catch (err) { Swal.fire('Error', 'ไม่สามารถอัปเดตได้', 'error'); }
  };

  const deleteBooking = async (id: number) => {
    const confirm = await Swal.fire({
      title: 'ลบรายการจอง?',
      text: "ข้อมูลนี้จะหายไปจากฐานข้อมูลถาวร!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'ยืนยันการลบ'
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/bookings/admin/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        Swal.fire('ลบสำเร็จ!', 'รายการจองถูกลบออกจากระบบแล้ว', 'success');
        fetchAllBookings();
      } catch (err) { Swal.fire('Error', 'ไม่สามารถลบได้', 'error'); }
    }
  };

  useEffect(() => { fetchAllBookings(); }, []);

  return (
    <div style={{ padding: '40px', backgroundColor: '#f1f5f9', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', marginBottom: 20 }}>
          <ArrowLeft size={18} /> กลับหน้าหลัก
        </button>

        <h1 style={{ marginBottom: 30 }}>🛡️ ผู้ดูแลระบบ (Admin Dashboard)</h1>

        <div style={{ backgroundColor: 'white', borderRadius: 20, overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ backgroundColor: '#1e293b', color: 'white' }}>
              <tr>
                <th style={{ padding: 15 }}>ID</th>
                <th style={{ padding: 15 }}>ลูกค้า</th>
                <th style={{ padding: 15 }}>สนาม</th>
                <th style={{ padding: 15 }}>วันที่/เวลา</th>
                <th style={{ padding: 15 }}>ราคา</th>
                <th style={{ padding: 15 }}>สถานะ</th>
                <th style={{ padding: 15 }}>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {allBookings.map((b) => (
                <tr key={b.id} style={{ borderBottom: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <td style={{ padding: 15 }}>#{b.id}</td>
                  <td style={{ padding: 15 }}>{b.user?.username}</td>
                  <td style={{ padding: 15 }}>{b.field?.name}</td>
                  <td style={{ padding: 15 }}>{b.bookingDate}<br/><small>{b.startTime}-{b.endTime}</small></td>
                  <td style={{ padding: 15 }}>฿{Number(b.totalPrice).toLocaleString()}</td>
                  <td style={{ padding: 15 }}>
                     <span style={{ padding: '4px 10px', borderRadius: 12, fontSize: '0.8rem', fontWeight: 'bold', backgroundColor: b.status === 'PENDING' ? '#fef3c7' : b.status === 'CANCELLED' ? '#fee2e2' : '#dcfce7', color: b.status === 'PENDING' ? '#92400e' : b.status === 'CANCELLED' ? '#b91c1c' : '#15803d' }}>
                      {b.status}
                    </span>
                  </td>
                  <td style={{ padding: 15, display: 'flex', gap: 10, justifyContent: 'center' }}>
                    {b.status === 'PENDING' && (
                      <button onClick={() => updateStatus(b.id, 'CONFIRMED')} style={{ border: 'none', background: '#dcfce7', color: '#15803d', padding: 8, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }} aria-label="confirm">
                        <i className="bi bi-check-circle" style={{ fontSize: 16 }} />
                      </button>
                    )}
                    <button onClick={() => deleteBooking(b.id)} style={{ border: 'none', background: '#fee2e2', color: '#b91c1c', padding: 8, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }} aria-label="delete">
                      <i className="bi bi-trash" style={{ fontSize: 16 }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;