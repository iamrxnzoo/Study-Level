import { useApp } from './context/AppContext';
import { Bell, Moon, HelpCircle, LogOut, Download, Shield, Edit2 } from 'lucide-react';

export default function Profile() {
  const { user, tasks, analytics, renameMochi } = useApp();

  const xpProgress = user.xp % 100;

  const handleRename = () => {
    const newName = window.prompt("Enter a new name for your pet:", user.petName || "Mochi");
    if (newName && newName.trim() !== "") renameMochi(newName.trim());
  };

  const handleExportData = () => {
    const dataToExport = { user, tasks, analytics, exportedAt: new Date().toISOString() };
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `StudyLevel_Data_${user.name}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: '20px' }}>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px', marginTop: '10px' }}>
        
        <div style={{ width: '100px', height: '100px', backgroundColor: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '50px', marginBottom: '15px', position: 'relative', border: '4px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
          🐱
          {user.equipped === 'wizard_hat' && <span style={{ position: 'absolute', top: '-15px', right: '-10px', fontSize: '32px', transform: 'rotate(15deg)' }}>🎩</span>}
          {user.equipped === 'glasses' && <span style={{ position: 'absolute', top: '35px', right: '-15px', fontSize: '32px' }}>👓</span>}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h2 style={{ margin: 0, fontSize: '20px' }}>{user.petName || "Mochi"}</h2>
          <button onClick={handleRename} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
            <Edit2 size={16} color="#a0aec0" />
          </button>
        </div>

        <p style={{ margin: '4px 0 10px 0', fontSize: '14px', color: '#a0aec0' }}>Level {user.level} • {xpProgress}/100 XP</p>
        
        <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
          <div style={{ backgroundColor: '#e6f0ff', color: '#5b8def', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>🏅 {user.equippedTitle}</div>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
        <MenuRow icon={<Shield size={20} color="#5b8def" />} title="Account Information" subtitle="View and edit your details" />
        <MenuRow icon={<Bell size={20} color="#f2c94c" />} title="Notifications" subtitle="Manage your notifications" />
        <MenuRow icon={<Moon size={20} color="#7b61ff" />} title="Theme" subtitle="Light / Dark mode" />
        <MenuRow icon={<HelpCircle size={20} color="#66d9a0" />} title="Help & Support" subtitle="Get help or contact us" />
        
        <div onClick={handleExportData} style={{ display: 'flex', alignItems: 'center', padding: '15px 20px', borderTop: '1px solid #edf2f7', cursor: 'pointer' }}>
          <div style={{ marginRight: '15px', backgroundColor: '#e6f0ff', padding: '8px', borderRadius: '10px' }}>
            <Download size={20} color="#5b8def" />
          </div>
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: 0, fontSize: '14px', color: '#2d3748' }}>Export Research Data</h4>
            <p style={{ margin: 0, fontSize: '12px', color: '#a0aec0' }}>Download tasks, stats, and analytics as JSON</p>
          </div>
        </div>
      </div>

      <button style={{ width: '100%', padding: '15px', backgroundColor: '#ffe6e6', color: '#eb5757', border: 'none', borderRadius: '15px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        <LogOut size={20} /> Log Out
      </button>

    </div>
  );
}

function MenuRow({ icon, title, subtitle }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '15px 20px', borderBottom: '1px solid #edf2f7', cursor: 'pointer' }}>
      <div style={{ marginRight: '15px', backgroundColor: '#f4f7fb', padding: '8px', borderRadius: '10px' }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <h4 style={{ margin: 0, fontSize: '14px', color: '#2d3748' }}>{title}</h4>
        <p style={{ margin: 0, fontSize: '12px', color: '#a0aec0' }}>{subtitle}</p>
      </div>
    </div>
  );
}