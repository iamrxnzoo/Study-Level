import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, LayoutDashboard, CheckSquare, Calendar, User, LogOut, Gift } from 'lucide-react';
import { useApp } from './context/AppContext';

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { user } = useApp();

  const navItems = [
    { path: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { path: '/tasks', icon: <CheckSquare size={20} />, label: 'Task Management' },
    { path: '/calendar', icon: <Calendar size={20} />, label: 'Calendar' },
    { path: '/rewards', icon: <Gift size={20} />, label: 'Rewards' }, // NEW TAB
    { path: '/profile', icon: <User size={20} />, label: 'Profile' },
  ];

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="app-container">
      <header className="top-header">
        <button onClick={() => setIsSidebarOpen(true)} className="menu-btn">
          <Menu size={24} color="#2d3748" />
        </button>
        <div className="logo-text">StudyLevel</div>
        <div style={{ width: '24px' }}></div>
      </header>

      {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      <nav className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div style={{ backgroundColor: '#f4f7fb', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', borderBottom: '1px solid #edf2f7' }}>
          <button onClick={closeSidebar} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} color="#a0aec0" />
          </button>
          <div style={{ position: 'relative', marginBottom: '10px' }}>
            <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Mochi&backgroundColor=e6f0ff" alt="Mochi" style={{ width: '70px', height: '70px', borderRadius: '50%', border: '3px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }} />
            {user.equipped === 'wizard_hat' && <span style={{ position: 'absolute', top: '-12px', right: '-10px', fontSize: '24px', transform: 'rotate(15deg)' }}>🎩</span>}
            {user.equipped === 'glasses' && <span style={{ position: 'absolute', top: '25px', right: '-10px', fontSize: '24px' }}>👓</span>}
          </div>
          <h3 style={{ margin: 0, fontSize: '16px' }}>{user.petName || "Mochi"}</h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#a0aec0' }}>Level {user.level} • {user.xp % 100}/100 XP</p>
        </div>

        <div className="sidebar-links">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} onClick={closeSidebar} className={`sidebar-link ${isActive ? 'active' : ''}`}>
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="sidebar-footer">
          <button className="logout-btn"><LogOut size={20} /><span>Log Out</span></button>
        </div>
      </nav>

      <main className="main-content"><Outlet /></main>
    </div>
  );
}