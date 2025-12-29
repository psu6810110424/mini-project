import { useLocation, useNavigate } from 'react-router-dom';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { field, method } = location.state || {}; 

  if (!field) return <div>ไม่พบข้อมูลการจอง</div>;

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      <h1> หน้าชำระเงิน</h1>
      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '15px', display: 'inline-block' }}>
        <h3>รายการ: {field.name}</h3>
        <p>ยอดชำระ: <b>{field.pricePerHour} บาท</b></p>
        <p>วิธีชำระเงิน: <span style={{ color: 'blue' }}>{method}</span></p>
        <div style={{ backgroundColor: '#eee', padding: '40px', margin: '20px' }}>
            [ ส่วนแสดง QR Code หรือ ฟอร์มบัตรเครดิต ]
        </div>

        <button 
          onClick={() => {
            alert('ชำระเงินสำเร็จ!');
            navigate('/');
          }}
          style={{ padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          ยืนยันการชำระเงิน
        </button>
      </div>
    </div>
  );
};

export default Payment;