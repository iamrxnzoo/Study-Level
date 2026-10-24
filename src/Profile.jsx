import { useState } from 'react';
import { useApp } from './context/AppContext';
import { Bell, Moon, HelpCircle, LogOut, Download, Shield, Lock, X, Check, Edit2, Shirt } from 'lucide-react';

export default function Profile() {
  const { user, tasks, analytics, equipCosmetic, equipTitle, renameMochi, changePetType } = useApp();
  const [isWardrobeOpen, setIsWardrobeOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Accessories');

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

  const isUnlocked = (item) => user.inventory.includes(item);

  // Placeholder image URLs (replace with your actual images later)
  const petImages = {
    cat: "https://api.dicebear.com/7.x/notionists/svg?seed=Mochi&backgroundColor=e6f0ff",
    fox: "https://api.dicebear.com/7.x/notionists/svg?seed=Foxy&backgroundColor=ffecd2",
    panda: "https://api.dicebear.com/7.x/notionists/svg?seed=Panda&backgroundColor=e2e8f0"
  };

  return (
    <div style={{ padding: '20px', paddingBottom: '80px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px', marginTop: '10px' }}>
        
        {/* Avatar */}
        <div style={{ width: '120px', height: '120px', backgroundColor: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px', position: 'relative', border: '4px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
          <img src={petImages[user.petType] || petImages.cat} alt="Pet" style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
          
          {/* Equipped Cosmetics Overlay */}
          {user.equipped === 'wizard_hat' && <span style={{ position: 'absolute', top: '-15px', right: '-10px', fontSize: '40px', transform: 'rotate(15deg)', zIndex: 10 }}>🎩</span>}
          {user.equipped === 'glasses' && <span style={{ position: 'absolute', top: '40px', right: '-15px', fontSize: '40px', zIndex: 10 }}>👓</span>}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h2 style={{ margin: 0, fontSize: '22px' }}>{user.petName || "Mochi"}</h2>
          <button onClick={handleRename} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
            <Edit2 size={16} color="#a0aec0" />
          </button>
        </div>

        <p style={{ margin: '4px 0 10px 0', fontSize: '14px', color: '#a0aec0' }}>Level {user.level} • {xpProgress}/100 XP</p>
        
        <div style={{ backgroundColor: '#e6f0ff', color: '#5b8def', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', marginBottom: '20px' }}>
          🏅 {user.equippedTitle}
        </div>

        <button 
          onClick={() => setIsWardrobeOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#5b8def', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(91, 141, 239, 0.3)' }}
        >
          <Shirt size={20} />
          Edit Pet
        </button>
      </div>

      {/* Menu List */}
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
        <LogOut size={20} />
        Log Out
      </button>

      {/* --- ANIMATED WARDROBE MODAL --- */}
      {isWardrobeOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 100, animation: 'fadeIn 0.3s ease' }}>
          
          <style>
            {`
              @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
              @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
            `}
          </style>

          <div style={{ backgroundColor: 'white', width: '100%', maxWidth: '480px', height: '85vh', borderTopLeftRadius: '30px', borderTopRightRadius: '30px', display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            
            <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #edf2f7' }}>
              <h3 style={{ margin: 0, fontSize: '20px' }}>Customize {user.petName}</h3>
              <button onClick={() => setIsWardrobeOpen(false)} style={{ background: '#f4f7fb', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer', display: 'flex' }}>
                <X size={20} color="#4a5568" />
              </button>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', padding: '15px 20px', gap: '10px', backgroundColor: '#f8fafc' }}>
              {['Accessories', 'Persona', 'Titles'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '10px', backgroundColor: activeTab === tab ? 'white' : 'transparent', color: activeTab === tab ? '#5b8def' : '#a0aec0', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', boxShadow: activeTab === tab ? '0 2px 5px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s ease' }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Content */}
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
              
              {activeTab === 'Accessories' && (
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  <WardrobeItem icon="🎓" name="Grad Cap" isUnlocked={true} isEquipped={user.equipped === 'default'} onClick={() => equipCosmetic('default')} />
                  <WardrobeItem icon="🎩" name="Wizard Hat" isUnlocked={isUnlocked('wizard_hat')} isEquipped={user.equipped === 'wizard_hat'} onClick={() => equipCosmetic('wizard_hat')} req="Lvl 2" />
                  <WardrobeItem icon="👓" name="Glasses" isUnlocked={isUnlocked('glasses')} isEquipped={user.equipped === 'glasses'} onClick={() => equipCosmetic('glasses')} req="Lvl 3" />
                </div>
              )}

              {activeTab === 'Persona' && (
                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                  <WardrobeItem image={petImages.cat} name="Classic Cat" isUnlocked={true} isEquipped={user.petType === 'cat'} onClick={() => changePetType('cat')} />
                  <WardrobeItem image={petImages.fox} name="Fox" isUnlocked={true} isEquipped={user.petType === 'fox'} onClick={() => changePetType('fox')} req="Coming Soon" />
                  <WardrobeItem image={petImages.panda} name="Panda" isUnlocked={false} isEquipped={user.petType === 'panda'} req="Coming Soon" />
                </div>
              )}

              {activeTab === 'Titles' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <TitleItem title="Beginner" isEquipped={user.equippedTitle === 'Beginner'} onClick={() => equipTitle('Beginner')} />
                  <TitleItem title="Task Master" isEquipped={user.equippedTitle === 'Task Master'} onClick={() => equipTitle('Task Master')} />
                  <TitleItem title="Night Owl" isEquipped={user.equippedTitle === 'Night Owl'} onClick={() => equipTitle('Night Owl')} isLocked={true} />
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Wardrobe Item Component (Supports Icons or Images)
function WardrobeItem({ icon, image, name, isUnlocked, isEquipped, onClick, req }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <div 
        onClick={() => isUnlocked && onClick()}
        style={{ width: '80px', height: '80px', backgroundColor: '#f4f7fb', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', cursor: isUnlocked ? 'pointer' : 'not-allowed', border: isEquipped ? '3px solid #5b8def' : '3px solid transparent', opacity: isUnlocked ? 1 : 0.4, position: 'relative', transition: 'all 0.2s ease' }}
      >
        {image ? <img src={image} alt={name} style={{ width: '100%', height: '100%', borderRadius: '18px' }} /> : icon}
        {!isUnlocked && <Lock size={24} color="#4a5568" style={{ position: 'absolute' }} />}
        {isEquipped && <div style={{ position: 'absolute', bottom: '-5px', right: '-5px', backgroundColor: '#5b8def', borderRadius: '50%', padding: '3px' }}><Check size={14} color="white" /></div>}
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: '13px', fontWeight: 'bold', color: '#2d3748' }}>{name}</p>
        {req && !isUnlocked && <p style={{ margin: 0, fontSize: '10px', color: '#a0aec0' }}>{req}</p>}
      </div>
    </div>
  );
}

function TitleItem({ title, isEquipped, onClick, isLocked }) {
  return (
    <div 
      onClick={() => !isLocked && onClick()}
      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '12px', border: isEquipped ? '2px solid #5b8def' : '2px solid transparent', cursor: isLocked ? 'not-allowed' : 'pointer', opacity: isLocked ? 0.5 : 1, transition: 'all 0.2s' }}
    >
      <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#2d3748' }}>🏅 {title}</span>
      {isLocked ? <Lock size={16} color="#a0aec0" /> : isEquipped ? <Check size={18} color="#5b8def" /> : null}
    </div>
  );
}

function MenuRow({ icon, title, subtitle }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '15px 20px', borderBottom: '1px solid #edf2f7', cursor: 'pointer' }}>
      <div style={{ marginRight: '15px', backgroundColor: '#f4f7fb', padding: '8px', borderRadius: '10px' }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <h4 style={{ margin: 0, fontSize: '14px', color: '#2d3748' }}>{title}</h4>
        <p style={{ margin: 0, fontSize: '12px', color: '#a0aec0' }}>{subtitle}</p>
      </div>
    </div>
  );
}