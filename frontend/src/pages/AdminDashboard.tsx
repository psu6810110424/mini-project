import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, CheckCircle, PlusCircle, LayoutDashboard, Database, XCircle } from 'lucide-react';

const AdminDashboard = () => {
  // ---------------------------------------------------------
  // 1. ส่วนการจัดการสถานะ (State Management)
  // ---------------------------------------------------------
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // ---------------------------------------------------------
  // 2. ส่วนฟังก์ชันดึงข้อมูล (Data Fetching)
  // ---------------------------------------------------------
  const fetchAllBookings = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:3000/bookings/admin/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllBookings(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire('ผิดพลาด', 'ไม่สามารถดึงข้อมูลการจองได้', 'error');
    }
  }, [token]);

  const fetchFields = useCallback(async () => {
    try {
      const res = await axios.get('http://localhost:3000/fields');
      setFields(res.data);
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => {
    fetchAllBookings();
    fetchFields();
  }, [fetchAllBookings, fetchFields]);

  // ---------------------------------------------------------
  // 3. ส่วนฟังก์ชันจัดการการจอง (Booking Actions)
  // ---------------------------------------------------------
  
  // อัปเดตสถานะ (ยืนยัน / ยกเลิก)
  const updateStatus = async (id: number, status: string) => {
    try {
      await axios.patch(`http://localhost:3000/bookings/admin/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Swal.fire('สำเร็จ', `เปลี่ยนสถานะเป็น ${status} เรียบร้อย`, 'success');
      fetchAllBookings();
    } catch (err) { Swal.fire('Error', 'ไม่สามารถอัปเดตได้', 'error'); }
  };

  const deleteBooking = async (id: number) => {
    const confirm = await Swal.fire({
      title: 'ลบรายการจอง?',
      text: "คุณต้องลบรายการจองที่ผูกกับสนามออกก่อน จึงจะลบสนามนั้นได้",
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
        Swal.fire('ลบสำเร็จ!', 'ลบรายการจองออกจากระบบแล้ว', 'success');
        fetchAllBookings();
      } catch (err) { Swal.fire('Error', 'ลบไม่สำเร็จ', 'error'); }
    }
  };

  // ---------------------------------------------------------
  // 4. ส่วนฟังก์ชันจัดการสนาม (Field Actions)
  // ---------------------------------------------------------
  const handleAddField = () => {
    Swal.fire({
      title: 'เพิ่มสนามใหม่',
      html: `<input type="text" id="fName" class="swal2-input" placeholder="ชื่อสนาม">
             <input type="number" id="fPrice" class="swal2-input" placeholder="ราคา/ชม.">`,
      confirmButtonText: 'บันทึก',
      preConfirm: () => {
        const name = (document.getElementById('fName') as HTMLInputElement).value;
        const pricePerHour = (document.getElementById('fPrice') as HTMLInputElement).value;
        return { name, pricePerHour: Number(pricePerHour) };
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.post('http://localhost:3000/fields', result.value, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchFields();
        Swal.fire('สำเร็จ', 'เพิ่มสนามแล้ว', 'success');
      }
    });
  };

  const handleDeleteField = async (id: number) => {
    const res = await Swal.fire({ title: 'ลบสนาม?', text: 'หากลบไม่ได้ ให้ไปลบรายการจองของสนามนี้ออกก่อน', icon: 'warning', showCancelButton: true });
    if (res.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/fields/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchFields();
        Swal.fire('สำเร็จ', 'ลบสนามเรียบร้อย', 'success');
      } catch (err) {
        Swal.fire('ลบไม่ได้', 'สนามนี้ยังมีรายการจองค้างอยู่ กรุณาลบรายการจองก่อน', 'error');
      }
    }
  };

  return (
    <div style={{ padding: '40px', backgroundColor: '#f1f5f9', minHeight: '100vh', fontFamily: 'Kanit' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginBottom: '20px', fontWeight: 600 }}>
          <ArrowLeft size={20} /> กลับหน้าหลัก
        </button>

        <h1 style={{ marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <LayoutDashboard size={32} color="#3b82f6" /> ระบบจัดการหลังบ้าน
        </h1>

        {/* 4.1 ตารางจัดการการจอง */}
        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
          <h2 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={20} /> รายการจองสนาม
          </h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9', color: '#64748b' }}>
                <th style={{ padding: '12px' }}>ลูกค้า</th>
                <th style={{ padding: '12px' }}>สนาม</th>
                <th style={{ padding: '12px' }}>สถานะ</th>
                <th style={{ padding: '12px' }}>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {allBookings.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '12px' }}>{b.user?.username}</td>
                  <td style={{ padding: '12px' }}>{b.field?.name}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 'bold',
                      backgroundColor: b.status === 'CONFIRMED' ? '#dcfce7' : b.status === 'CANCELLED' ? '#fee2e2' : '#fef3c7',
                      color: b.status === 'CONFIRMED' ? '#15803d' : b.status === 'CANCELLED' ? '#b91c1c' : '#92400e'
                    }}>
                      {b.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px', display: 'flex', gap: '10px' }}>
                    {b.status === 'PENDING' && (
                      <button onClick={() => updateStatus(b.id, 'CONFIRMED')} style={{ color: '#15803d', border: 'none', background: 'none', cursor: 'pointer' }} title="ยืนยันการจอง"><CheckCircle size={18} /></button>
                    )}
                    {/* ปุ่มยกเลิกการจอง */}
                    {b.status !== 'CANCELLED' && (
                      <button onClick={() => updateStatus(b.id, 'CANCELLED')} style={{ color: '#f59e0b', border: 'none', background: 'none', cursor: 'pointer' }} title="ยกเลิกการจอง"><XCircle size={18} /></button>
                    )}
                    {/* ปุ่มลบรายการจองออกจากระบบ */}
                    <button onClick={() => deleteBooking(b.id)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }} title="ลบข้อมูลการจอง"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 4.2 ตารางจัดการสนาม */}
        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, fontSize: '1.2rem' }}>🏟️ จัดการสนาม</h2>
            <button onClick={handleAddField} style={{ backgroundColor: '#3b82f6', color: 'white', padding: '8px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PlusCircle size={18} /> เพิ่มสนาม
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {fields.map(f => (
                <tr key={f.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '12px' }}>{f.name}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <button onClick={() => handleDeleteField(f.id)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }}>ลบสนาม</button>
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