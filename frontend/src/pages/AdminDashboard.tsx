import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, CheckCircle, PlusCircle, LayoutDashboard, Database, XCircle, Edit2 } from 'lucide-react';

interface Field {
  id: number;
  name: string;
  pricePerHour: number;
  type: string; 
}


const AdminDashboard = () => {
  const [allBookings, setAllBookings] = useState<any[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const token = localStorage.getItem('token');
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


  const handleAddField = () => {
    const Swal = getSwal();
    if (!Swal) return;
    Swal.fire({
      title: 'เพิ่มสนามใหม่',
      html: `
        <div style="text-align: left;">
          <input type="text" id="fName" class="swal2-input" placeholder="ชื่อสนาม">
          <input type="number" id="fPrice" class="swal2-input" placeholder="ราคา/ชม.">
          <label style="margin-left: 25px; font-weight: bold;">เลือกประเภทสนาม:</label>
          <select id="fType" class="swal2-input">
            <option value="Football">Football</option>
            <option value="Badminton">Badminton</option>
          </select>
        </div>
      `,
      confirmButtonText: 'บันทึก',
      showCancelButton: true,
      preConfirm: () => {
        const name = (document.getElementById('fName') as HTMLInputElement).value;  
        const pricePerHour = (document.getElementById('fPrice') as HTMLInputElement).value; 
        const type = (document.getElementById('fType') as HTMLSelectElement).value; 
        if (!name || !pricePerHour) return Swal.showValidationMessage('กรุณากรอกข้อมูลให้ครบ');
        return { name, pricePerHour: Number(pricePerHour), type };
      }
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        try {
        await axios.post('http://localhost:3000/fields', result.value, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchFields();
        Swal.fire('สำเร็จ', 'เพิ่มสนามแล้ว', 'success');
      }catch (error) {
          Swal.fire('ผิดพลาด', 'ไม่สามารถเพิ่มข้อมูลได้', 'error');
      }
    }
    });
  };

    const handleEditField = (field: Field) => {
    const Swal = getSwal();
    if (!Swal) return;

    Swal.fire({
      title: 'แก้ไขข้อมูลสนาม',
      html: `
        <div style="text-align: left;">
          <input type="text" id="eName" class="swal2-input" value="${field.name}" placeholder="ชื่อสนาม">
          <input type="number" id="ePrice" class="swal2-input" value="${field.pricePerHour}" placeholder="ราคา/ชม.">
          <label style="margin-left: 25px; font-weight: bold;">ประเภทสนาม:</label>
          <select id="eType" class="swal2-input">
            <option value="Football" ${field.type === 'Football' ? 'selected' : ''}>Football</option>
            <option value="Badminton" ${field.type === 'Badminton' ? 'selected' : ''}>Badminton</option>
          </select>
        </div>
      `,
      confirmButtonText: 'อัปเดต',
      showCancelButton: true,
      preConfirm: () => {
        const name = (document.getElementById('eName') as HTMLInputElement).value;
        const pricePerHour = (document.getElementById('ePrice') as HTMLInputElement).value;
        const type = (document.getElementById('eType') as HTMLSelectElement).value;
        if (!name || !pricePerHour) return Swal.showValidationMessage('กรุณากรอกข้อมูลให้ครบ');
        return { name, pricePerHour: Number(pricePerHour), type };
      }
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        try {
          await axios.patch(`http://localhost:3000/fields/${field.id}`, result.value, {
            headers: { Authorization: `Bearer ${token}` }
          });
          fetchFields();
          Swal.fire('สำเร็จ', 'อัปเดตข้อมูลเรียบร้อย', 'success');
        } catch (error) {
          Swal.fire('ผิดพลาด', 'ไม่สามารถอัปเดตได้', 'error');
        }
      }
    });
  };

  const handleDeleteField = async (id: number) => {
    const res = await Swal.fire({ 
      title: 'ลบสนาม?', 
      text: 'หากลบไม่ได้ ให้ไปลบรายการจองของสนามนี้ออกก่อน (Data Integrity)', 
      icon: 'warning', 
      showCancelButton: true 
    });
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

        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', marginBottom: '30px' }}>
          <h2 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={20} /> รายการจองสนาม (Admin View)
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

                    {b.status !== 'CANCELLED' && (
                      <button onClick={() => updateStatus(b.id, 'CANCELLED')} style={{ color: '#f59e0b', border: 'none', background: 'none', cursor: 'pointer' }} title="ยกเลิกการจอง"><XCircle size={18} /></button>
                    )}
                    <button onClick={() => deleteBooking(b.id)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer' }} title="ลบข้อมูลการจอง"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ margin: 0, fontSize: '1.2rem' }}>🏟️ จัดการสนาม (Resource Control)</h2>
            <button onClick={handleAddField} style={{ backgroundColor: '#3b82f6', color: 'white', padding: '8px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PlusCircle size={18} /> เพิ่มสนาม
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '2px solid #f1f5f9', color: '#64748b' }}>
                <th style={{ padding: '12px' }}>ชื่อสนาม</th>
                <th style={{ padding: '12px' }}>ประเภท</th>
                <th style={{ padding: '12px' }}>ราคา/ชม.</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {fields.map(f => (
                <tr key={f.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold' }}>{f.name}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      backgroundColor: f.type === 'Football' ? '#ebf5ff' : '#f0fdf4',
                      color: f.type === 'Football' ? '#0066FF' : '#10b981',
                      padding: '4px 10px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold'
                    }}>
                      {f.type}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>฿{f.pricePerHour.toLocaleString()}</td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <button onClick={() => handleEditField(f)} style={{ color: '#3b82f6', border: 'none', background: 'none', cursor: 'pointer', marginRight: '15px' }}><Edit2 size={18} /></button>
                    <button onClick={() => handleDeleteField(f.id)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}><Trash2 size={18} /></button>
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