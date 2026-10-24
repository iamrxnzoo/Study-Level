import { useState } from 'react';
import { useApp } from './context/AppContext';
import { Bell, Moon, HelpCircle, LogOut, Download, Shield, Lock, X, Check, Edit2, Shirt, ChevronLeft, Paintbrush } from 'lucide-react';

export default function Profile() {
  const { user, tasks, analytics, equipCosmetic, equipTitle, renameMochi, changePetType, updateAccessoryPosition } = useApp();
  const [isWardrobeOpen, setIsWardrobeOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Accessories');
  
  const [editingAccessory, setEditingAccessory] = useState(null); 
  const [currentPos, setCurrentPos] = useState({ x: 10, y: 10, rotate: 0, scale: 100 });

  const xpProgress = user.xp % 100;

  // Dynamic Image Loading
  const petFiles = import.meta.glob('/public/images/pets/*.{png,jpg,jpeg,svg,jfif}', { eager: true });
  const accessoryFiles = import.meta.glob('/public/images/accessories/*.{png,jpg,jpeg,svg,jfif}', { eager: true });

  const formatFiles = (filesObj, folder) => {
    return Object.keys(filesObj).map(path => {
      const fileName = path.split('/').pop(); 
      const id = fileName.split('.')[0]; 
      const name = id.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); 
      return { id, name, src: `/images/${folder}/${fileName}` };
    });
  };

  const petChoices = formatFiles(petFiles, 'pets');
  const accessoryChoices = formatFiles(accessoryFiles, 'accessories');

  const currentPetImage = petChoices.find(p => p.id === user.petType)?.src || petChoices[0]?.src;
  const currentAccessoryImage = accessoryChoices.find(a => a.id === user.equipped)?.src;
  const activePos = user.accessoryPositions?.[user.equipped] || { x: 10, y: 10, rotate: 0, scale: 100 };

  // --- THE UNLOCK LOGIC ---
  // Hardcoded premium items that require levels
  const premiumItems = {
    wizard_hat: { reqLevel: 2, text: "Lvl 2" },
    glasses: { reqLevel: 3, text: "Lvl 3" },
    golden_aura: { reqLevel: 5, text: "Lvl 5" } // Future proofing
  };

  const isUnlocked = (itemId) => {
    // 1. Check if it's a premium item
    if (premiumItems[itemId]) {
      return user.level >= premiumItems[itemId].reqLevel;
    }
    // 2. If it's NOT in the premium list, it's a freebie. Always unlock it.
    return true; 
  };

  const getRequirementText = (itemId) => {
    return premiumItems[itemId] ? premiumItems[itemId].text : null;
  };

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

  const handleStartAdjusting = (accessoryId) => {
    equipCosmetic(accessoryId);
    setCurrentPos(user.accessoryPositions?.[accessoryId] || { x: 10, y: 10, rotate: 0, scale: 100 });
    setEditingAccessory(accessoryId);
  };

  const handleSaveAdjustment = () => {
    updateAccessoryPosition(editingAccessory, currentPos);
    setEditingAccessory(null); 
  };

  return (
    <div style={{ padding: '20px', paddingBottom: '80px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px', marginTop: '10px' }}>
        
        <div style={{ width: '140px', height: '140px', backgroundColor: '#e2e8f0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px', position: 'relative', border: '4px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          {currentPetImage ? <img src={currentPetImage} alt="Pet" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '50px' }}>🐱</span>}
          
          {currentAccessoryImage && (
            <img 
              src={currentAccessoryImage} 
              alt="Accessory" 
              style={{ 
                position: 'absolute', top: `${activePos.y}px`, left: `${activePos.x}px`, width: '60px', height: '60px', objectFit: 'contain', zIndex: 10,
                transform: `rotate(${activePos.rotate}deg) scale(${activePos.scale / 100})`, transformOrigin: 'center center'
              }} 
            />
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h2 style={{ margin: 0, fontSize: '22px' }}>{user.petName || "Mochi"}</h2>
          <button onClick={handleRename} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
            <Edit2 size={16} color="#a0aec0" />
          </button>
        </div>
        <p style={{ margin: '4px 0 10px 0', fontSize: '14px', color: '#a0aec0' }}>Level {user.level} • {xpProgress}/100 XP</p>
        
        <button 
          onClick={() => setIsWardrobeOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#5b8def', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '12px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(91, 141, 239, 0.3)' }}
        >
          <Shirt size={20} /> Edit Pet
        </button>
      </div>

      {/* Menu List */}
      <div style={{ backgroundColor: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
        <MenuRow icon={<Shield size={20} color="#5b8def" />} title="Account Information" subtitle="View and edit your details" />
        <MenuRow icon={<Bell size={20} color="#f2c94c" />} title="Notifications" subtitle="Manage your notifications" />
        <MenuRow icon={<Moon size={20} color="#7b61ff" />} title="Theme" subtitle="Light / Dark mode" />
        <MenuRow icon={<HelpCircle size={20} color="#66d9a0" />} title="Help & Support" subtitle="Get help or contact us" />
        
        <div onClick={handleExportData} style={{ display: 'flex', alignItems: 'center', padding: '15px 20px', borderTop: '1px solid #edf2f7', cursor: 'pointer' }}>
          <div style={{ marginRight: '15px', backgroundColor: '#e6f0ff', padding: '8px', borderRadius: '10px' }}><Download size={20} color="#5b8def" /></div>
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: 0, fontSize: '14px', color: '#2d3748' }}>Export Research Data</h4>
            <p style={{ margin: 0, fontSize: '12px', color: '#a0aec0' }}>Download tasks, stats, and analytics as JSON</p>
          </div>
        </div>
      </div>

      <button style={{ width: '100%', padding: '15px', backgroundColor: '#ffe6e6', color: '#eb5757', border: 'none', borderRadius: '15px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        <LogOut size={20} /> Log Out
      </button>

      {/* WARDROBE MODAL */}
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
              {editingAccessory ? (
                <button onClick={() => setEditingAccessory(null)} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', color: '#5b8def', fontWeight: 'bold', padding: 0 }}>
                  <ChevronLeft size={20} /> Back
                </button>
              ) : (
                <h3 style={{ margin: 0, fontSize: '20px' }}>Customize {user.petName}</h3>
              )}
              
              <button onClick={() => { setIsWardrobeOpen(false); setEditingAccessory(null); }} style={{ background: '#f4f7fb', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer', display: 'flex' }}>
                <X size={20} color="#4a5568" />
              </button>
            </div>

            {!editingAccessory && (
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
            )}

            <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
              
              {!editingAccessory && (
                <>
                  {activeTab === 'Accessories' && (
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                      {accessoryChoices.length === 0 ? (
                        <p style={{ color: '#a0aec0', fontSize: '14px', width: '100%', textAlign: 'center' }}>No accessories found. Add PNGs to public/images/accessories.</p>
                      ) : (
                        accessoryChoices.map(item => (
                          <WardrobeItem 
                            key={item.id}
                            image={item.src} 
                            name={item.name} 
                            isUnlocked={isUnlocked(item.id)} 
                            isEquipped={user.equipped === item.id} 
                            onClick={() => handleStartAdjusting(item.id)}
                            req={getRequirementText(item.id)} 
                          />
                        ))
                      )}
                      
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '80px', height: '80px', backgroundColor: '#f4f7fb', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5, position: 'relative' }}>
                          <Paintbrush size={30} color="#4a5568" />
                          <Lock size={20} color="#4a5568" style={{ position: 'absolute' }} />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <p style={{ margin: 0, fontSize: '13px', fontWeight: 'bold', color: '#2d3748' }}>Custom Art</p>
                          <p style={{ margin: 0, fontSize: '10px', color: '#a0aec0' }}>Reach Lvl 10</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'Persona' && (
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                      {petChoices.map(item => (
                        <WardrobeItem 
                          key={item.id}
                          image={item.src} 
                          name={item.name} 
                          isUnlocked={true} 
                          isEquipped={user.petType === item.id} 
                          onClick={() => changePetType(item.id)} 
                        />
                      ))}
                    </div>
                  )}

                  {activeTab === 'Titles' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <TitleItem title="Beginner" isEquipped={user.equippedTitle === 'Beginner'} onClick={() => equipTitle('Beginner')} />
                      <TitleItem title="Task Master" isEquipped={user.equippedTitle === 'Task Master'} onClick={() => equipTitle('Task Master')} />
                      <TitleItem title="Night Owl" isEquipped={user.equippedTitle === 'Night Owl'} onClick={() => equipTitle('Night Owl')} isLocked={true} />
                    </div>
                  )}
                </>
              )}

              {editingAccessory && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  
                  <div style={{ width: '200px', height: '200px', backgroundColor: '#f8fafc', borderRadius: '20px', border: '2px dashed #cbd5e0', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', marginBottom: '20px' }}>
                    {currentPetImage ? <img src={currentPetImage} alt="Pet" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '60px' }}>🐱</span>}
                    
                    {currentAccessoryImage && (
                      <img 
                        src={currentAccessoryImage} 
                        alt="Accessory" 
                        style={{ 
                          position: 'absolute', top: `${currentPos.y}px`, left: `${currentPos.x}px`, width: '80px', height: '80px', objectFit: 'contain', zIndex: 10,
                          transform: `rotate(${currentPos.rotate}deg) scale(${currentPos.scale / 100})`, transformOrigin: 'center center'
                        }} 
                      />
                    )}
                  </div>

                  <h4 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#2d3748' }}>Adjust Position</h4>

                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '15px', padding: '0 10px' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#4a5568' }}>Move Left / Right</label>
                        <span style={{ fontSize: '12px', color: '#a0aec0' }}>{currentPos.x}px</span>
                      </div>
                      <input type="range" min="-80" max="80" value={currentPos.x} onChange={(e) => setCurrentPos({...currentPos, x: Number(e.target.value)})} style={{ width: '100%', accentColor: '#5b8def' }} />
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#4a5568' }}>Move Up / Down</label>
                        <span style={{ fontSize: '12px', color: '#a0aec0' }}>{currentPos.y}px</span>
                      </div>
                      <input type="range" min="-80" max="80" value={currentPos.y} onChange={(e) => setCurrentPos({...currentPos, y: Number(e.target.value)})} style={{ width: '100%', accentColor: '#5b8def' }} />
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#4a5568' }}>Tilt</label>
                        <span style={{ fontSize: '12px', color: '#a0aec0' }}>{currentPos.rotate}°</span>
                      </div>
                      <input type="range" min="-45" max="45" value={currentPos.rotate} onChange={(e) => setCurrentPos({...currentPos, rotate: Number(e.target.value)})} style={{ width: '100%', accentColor: '#5b8def' }} />
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#4a5568' }}>Scale (Size)</label>
                        <span style={{ fontSize: '12px', color: '#a0aec0' }}>{currentPos.scale}%</span>
                      </div>
                      <input type="range" min="50" max="150" value={currentPos.scale} onChange={(e) => setCurrentPos({...currentPos, scale: Number(e.target.value)})} style={{ width: '100%', accentColor: '#5b8def' }} />
                    </div>
                  </div>

                  <button onClick={handleSaveAdjustment} style={{ width: '100%', padding: '15px', backgroundColor: '#5b8def', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', marginTop: '20px' }}>
                    Save & Equip
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function WardrobeItem({ icon, image, name, isUnlocked, isEquipped, onClick, req }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <div 
        onClick={() => isUnlocked && onClick()}
        style={{ 
          width: '80px', height: '80px', backgroundColor: '#f4f7fb', borderRadius: '20px', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', 
          cursor: isUnlocked ? 'pointer' : 'not-allowed', 
          border: isEquipped ? '3px solid #5b8def' : '3px solid transparent', 
          opacity: isUnlocked ? 1 : 0.4, position: 'relative', transition: 'all 0.2s ease',
          padding: '10px'
        }}
      >
        {image ? <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : icon}
        
        {!isUnlocked && <Lock size={24} color="#4a5568" style={{ position: 'absolute' }} />}
        
        {isEquipped && (
          <div style={{ 
            position: 'absolute', top: '-8px', right: '-8px', 
            backgroundColor: '#5b8def', borderRadius: '50%', padding: '4px', 
            zIndex: 10, border: '2px solid white', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' 
          }}>
            <Check size={14} color="white" strokeWidth={3} />
          </div>
        )}
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
    <div onClick={() => !isLocked && onClick()} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '12px', border: isEquipped ? '2px solid #5b8def' : '2px solid transparent', cursor: isLocked ? 'not-allowed' : 'pointer', opacity: isLocked ? 0.5 : 1, transition: 'all 0.2s' }}>
      <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#2d3748' }}>🏅 {title}</span>
      {isLocked ? <Lock size={16} color="#a0aec0" /> : isEquipped ? <Check size={18} color="#5b8def" /> : null}
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