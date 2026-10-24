import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, LayoutDashboard, CheckSquare, Calendar, User, LogOut, Gift } from 'lucide-react';
import { useApp } from './context/AppContext';

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const { user } = useApp();

  const petFiles = import.meta.glob('/public/images/pets/*.{png,jpg,jpeg,svg,jfif}', { eager: true });
  const petChoices = Object.keys(petFiles).map(path => {
    const fileName = path.split('/').pop();
    const id = fileName.split('.')[0];
    return { id, src: `/images/pets/${fileName}` };
  });
  const currentPetImage = petChoices.find(p => p.id === user.petType)?.src || petChoices[0]?.src;

  const navItems = [
    { path: '/', icon: <LayoutDashboard size={22} />, label: 'Dashboard' },
    { path: '/tasks', icon: <CheckSquare size={22} />, label: 'Task Management' },
    { path: '/calendar', icon: <Calendar size={22} />, label: 'Calendar' },
    { path: '/rewards', icon: <Gift size={22} />, label: 'Rewards' },
    { path: '/profile', icon: <User size={22} />, label: 'My Profile' },
  ];

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="app-container">
      <header className="top-header">
        <button onClick={() => setIsSidebarOpen(true)} className="menu-btn">
          <Menu size={28} />
        </button>
        <div className="logo-text">
          <span style={{ fontSize: '24px' }}>📚</span> StudyLevel
        </div>
        <div style={{ width: '28px' }}></div>
      </header>

      {isSidebarOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}

      <nav className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        
        <div className="sidebar-header">
          <div className="sidebar-user">
            <div className="avatar-placeholder">
               {currentPetImage ? <img src={currentPetImage} alt="Pet" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user.petName?.charAt(0) || "M"}
            </div>
            <div>
              <h3>{user.name || "Student"}</h3>
              <p>Level {user.level} • {user.xp % 100}/100 XP</p>
            </div>
          </div>
          <button onClick={closeSidebar} className="close-btn">
            <X size={24} />
          </button>
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

        <div className="sidebar-footer" style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ width: '100px', height: '100px', margin: '0 auto 10px auto', backgroundColor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '3px solid var(--card-border)' }}>
            {currentPetImage ? <img src={currentPetImage} alt="Pet" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '50px' }}>🐱</span>}
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600', fontStyle: 'italic', marginBottom: '20px' }}>"Study today, level up tomorrow!"</p>
          
          <button className="logout-btn" style={{ justifyContent: 'center' }}>
            <LogOut size={20} />
            <span>Log Out</span>
          </button>
        </div>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}