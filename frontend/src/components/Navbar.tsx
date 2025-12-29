import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

return (
    <nav style={{ 
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
      padding: '15px 40px', backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb',
      position: 'sticky', top: 0, zIndex: 100
    }}>
      <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#2563eb', letterSpacing: '-1px' }}>
        SPORT<span style={{ color: '#111827' }}>RESERVE</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#4b5563', fontWeight: '500' }}>หน้าแรก</Link>
        {!token ? (
          <>
            <Link to="/login" style={{ textDecoration: 'none', color: '#4b5563', fontWeight: '500' }}>เข้าสู่ระบบ</Link>
            <Link to="/register" style={{ 
              textDecoration: 'none', backgroundColor: '#111827', color: 'white', 
              padding: '8px 18px', borderRadius: '6px', fontWeight: '500' 
            }}>สมัครสมาชิก</Link>
          </>
        ) : (
          <button onClick={handleLogout} style={{ 
            backgroundColor: 'transparent', border: '1px solid #d1d5db', padding: '8px 15px', 
            borderRadius: '6px', cursor: 'pointer', fontWeight: '500' 
          }}>ออกจากระบบ</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;