import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('user_role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
    navigate('/login');
    window.location.reload();
  };

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '12px 28px', backgroundColor: '#0f172a', color: 'white', position: 'sticky', top: 0, zIndex: 1000,
      borderBottom: '3px solid rgba(255,255,255,0.03)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'white', cursor: 'pointer' }} onClick={() => navigate('/') }>
          SPORT<span style={{ color: '#3b82f6' }}>RESERVE</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        
        {token ? (
          <>
            <button onClick={() => navigate('/my-bookings')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontWeight: 600 }}>
              ประวัติการจอง
            </button>
            
            <button onClick={handleLogout} style={{ backgroundColor: 'rgba(239,68,68,0.12)', color: '#ef4444', padding: '8px 12px', borderRadius: 8, border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer', fontWeight: 600 }}>
              ออกจากระบบ
            </button>

            {userRole === 'ADMIN' && (
              <button onClick={() => navigate('/admin/dashboard')} style={{ backgroundColor: '#10b981', color: 'white', padding: '8px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                Admin Panel
              </button>
            )}
          </>
        ) : (
          <>
            <Link to="/login" style={{ textDecoration: 'none', color: '#94a3b8', fontWeight: 600 }}>เข้าสู่ระบบ</Link>
            <Link to="/register" style={{ textDecoration: 'none', backgroundColor: '#3b82f6', color: 'white', padding: '8px 14px', borderRadius: 8, fontWeight: 600 }}>สมัครสมาชิก</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;