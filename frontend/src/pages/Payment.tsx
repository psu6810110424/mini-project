import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { CreditCard, QrCode, Banknote, Calendar, Clock, ArrowLeft } from 'lucide-react';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { field, method, bookingData } = location.state || {}; 

  if (!field || !bookingData) {
    return (
      <div style={{ textAlign: 'center', padding: '100px' }}>
        <h2>ไม่พบข้อมูลการจอง</h2>
        <button onClick={() => navigate('/')} style={{ color: '#2563eb', cursor: 'pointer', border: 'none', background: 'none', textDecoration: 'underline' }}>
          กลับไปหน้าหลัก
        </button>
      </div>
    );
  }

  const handleConfirmPayment = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        Swal.fire('Session expired', 'Please log in again.', 'error');
        navigate('/login');
        return;
      }

      Swal.fire({ 
        title: 'กำลังบันทึกการจอง...', 
        allowOutsideClick: false, 
        didOpen: () => { Swal.showLoading(); } 
      });

      await axios.post('http://localhost:3000/bookings', {
        fieldId: Number(field.id),
        bookingDate: bookingData.bookingDate,
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        totalPrice: Number(bookingData.totalPrice),
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        icon: 'success',
        title: 'จองสนามสำเร็จ!',
        text: 'เราได้รับข้อมูลการจองของคุณเรียบร้อยแล้ว',
        confirmButtonColor: '#10b981',
      }).then(() => navigate('/my-bookings'));

    } catch (error: any) {
      console.error("Payment Error Response:", error.response);

      if (error.response?.status === 401) {
        Swal.fire('เซสชันหมดอายุ', 'รหัสยืนยันตัวตนไม่ถูกต้องหรือหมดอายุ กรุณาล็อกอินใหม่อีกครั้ง', 'error')
          .then(() => {
            localStorage.removeItem('token');
            navigate('/login');
          });
      } else {
        Swal.fire('เกิดข้อผิดพลาด', error.response?.data?.message || 'ไม่สามารถบันทึกการจองได้', 'error');
      }
    }
  };

  return (
    <div style={{ padding: '40px 20px', backgroundColor: '#f3f4f6', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
      <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: '500px' }}>
        
        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', marginBottom: '20px', fontWeight: '600' }}>
          <ArrowLeft size={18} /> ย้อนกลับ
        </button>

        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#1e293b' }}>ยืนยันการชำระเงิน</h2>

        <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '16px', marginBottom: '25px', border: '1px solid #e2e8f0' }}>
          <h4 style={{ margin: '0 0 15px 0', color: '#2563eb' }}>{field.name}</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.95rem', color: '#475569' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Calendar size={16} /> <span>วันที่: {bookingData.bookingDate}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={16} /> <span>เวลา: {bookingData.startTime} - {bookingData.endTime}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Banknote size={16} /> <span>วิธีชำระ: {method === 'promptpay' ? 'PromptPay' : method === 'credit' ? 'บัตรเครดิต' : 'ชำระหน้าสนาม'}</span>
            </div>
          </div>
          <hr style={{ border: 'none', borderTop: '1px dashed #cbd5e1', margin: '15px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: '600' }}>ยอดชำระทั้งสิ้น</span>
            <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1e293b' }}>
              ฿{Number(bookingData.totalPrice).toLocaleString()}
            </span>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          {method === 'promptpay' && (
            <div>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '10px' }}>สแกน QR Code เพื่อชำระเงิน</p>
              <div style={{ padding: '20px', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'inline-block', backgroundColor: '#fff' }}>
                 <QrCode size={180} color="#1e293b" />
              </div>
              <p style={{ marginTop: '10px', fontWeight: '700', color: '#00467F' }}>PromptPay</p>
            </div>
          )}

          {method === 'credit' && (
            <div style={{ padding: '20px', border: '1px solid #e2e8f0', borderRadius: '12px', textAlign: 'left' }}>
               <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: '5px' }}>หมายเลขบัตร</label>
               <div style={{ position: 'relative', marginBottom: '15px' }}>
                 <input type="text" placeholder="xxxx xxxx xxxx xxxx" style={{ width: '100%', padding: '10px 10px 10px 35px', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                 <CreditCard size={18} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
               </div>
            </div>
          )}

          {method === 'cash' && (
            <div style={{ padding: '30px', backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', color: '#92400e' }}>
              <p>คุณเลือกชำระเงินที่หน้าสนาม</p>
              <small>กรุณาไปถึงก่อนเวลาจอง 15 นาที</small>
            </div>
          )}
        </div>

        <button 
          onClick={handleConfirmPayment}
          style={{ 
            width: '100%', padding: '16px', backgroundColor: '#10b981', color: '#fff', 
            border: 'none', borderRadius: '14px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem',
            boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.4)'
          }}
        >
          ยืนยันการชำระเงิน
        </button>
      </div>
    </div>
  );
};

export default Payment;