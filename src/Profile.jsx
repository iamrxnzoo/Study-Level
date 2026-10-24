import { useState, useRef } from 'react';
import { useApp } from './context/AppContext';
import { Bell, HelpCircle, LogOut, Download, Upload, Shield, Lock, X, Check, Edit2, Shirt, ChevronLeft, Paintbrush, Moon } from 'lucide-react';

export default function Profile() {
  const { user, tasks, analytics, equipCosmetic, equipTitle, renameMochi, changePetType, updateAccessoryPosition, changeTheme, importData } = useApp();
  const [isWardrobeOpen, setIsWardrobeOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Accessories');
  const fileInputRef = useRef(null);
  
  const [editingAccessory, setEditingAccessory] = useState(null); 
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0, rotate: 0, scale: 100 });

  const xpProgress = user.xp % 100;

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
  const activePos = user.accessoryPositions?.[user.equipped] || { x: 0, y: 0, rotate: 0, scale: 100 };

  const premiumItems = {
    wizard_hat: { reqLevel: 2, text: "Lvl 2" },
    glasses: { reqLevel: 3, text: "Lvl 3" },
    golden_aura: { reqLevel: 5, text: "Lvl 5" }
  };

  const isUnlocked = (itemId) => {
    if (premiumItems[itemId]) return user.level >= premiumItems[itemId].reqLevel;
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

  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        importData(json);
        alert("Data imported successfully! Refreshing...");
        window.location.reload();
      } catch (error) {
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
    event.target.value = null; // reset input
  };

  const handleStartAdjusting = (accessoryId) => {
    equipCosmetic(accessoryId);
    setCurrentPos(user.accessoryPositions?.[accessoryId] || { x: 0, y: 0, rotate: 0, scale: 100 });
    setEditingAccessory(accessoryId);
  };

  const handleSaveAdjustment = () => {
    updateAccessoryPosition(editingAccessory, currentPos);
    setEditingAccessory(null); 
  };

  return (
    <div style={{ padding: '0 20px 20px 20px' }}>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px', marginTop: '10px' }}>
        
        <div style={{ width: '140px', height: '140px', backgroundColor: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px', position: 'relative', border: '4px solid var(--card-border)', boxShadow: 'var(--card-shadow)', overflow: 'hidden' }}>
          {currentPetImage ? <img src={currentPetImage} alt="Pet" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '50px' }}>🐱</span>}
          
          {currentAccessoryImage && (
            <img 
              src={currentAccessoryImage} 
              alt="Accessory" 
              style={{ 
                position: 'absolute', top: '50%', left: '50%', width: '100px', height: '100px', objectFit: 'contain', zIndex: 10,
                transform: `translate(calc(-50% + ${activePos.x}px), calc(-50% + ${activePos.y}px)) rotate(${activePos.rotate}deg) scale(${activePos.scale / 100})`, transformOrigin: 'center center'
              }} 
            />
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h2 style={{ margin: 0, fontSize: '26px', fontWeight: '700', color: 'var(--text-main)' }}>{user.petName || "Mochi"}</h2>
          <button onClick={handleRename} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}>
            <Edit2 size={18} color="var(--text-muted)" />
          </button>
        </div>
        <p style={{ margin: '4px 0 10px 0', fontSize: '14px', color: 'var(--text-muted)', fontWeight: '600' }}>Level {user.level} • {xpProgress}/100 XP</p>
        
        <button 
          onClick={() => setIsWardrobeOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--primary)', color: 'var(--text-on-primary)', border: '3px solid var(--card-border)', padding: '12px 24px', borderRadius: '20px', fontSize: '15px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 6px 0 var(--secondary)' }}
        >
          <Shirt size={20} /> Edit Pet
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <MenuRow icon={<Shield size={20} color="var(--primary)" />} title="Account Information" subtitle="View and edit your details" />
        <MenuRow icon={<Bell size={20} color="var(--chip-color)" />} title="Notifications" subtitle="Manage your notifications" />
        
        <div style={{ padding: '15px 20px', borderBottom: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ backgroundColor: 'var(--chip-bg)', padding: '8px', borderRadius: '10px' }}><Moon size={20} color="var(--primary)" /></div>
            <h4 style={{ margin: 0, fontSize: '15px', color: 'var(--text-main)', fontWeight: '700' }}>Theme</h4>
          </div>
          <select 
            value={user.theme || 'cute'} 
            onChange={(e) => changeTheme(e.target.value)}
            style={{ padding: '8px', borderRadius: '10px', border: '2px solid var(--card-border)', backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', fontWeight: '600', outline: 'none', fontSize: '13px' }}
          >
            <option value="cute">Cute Core 🌸</option>
            <option value="monochrome">Monochrome 🖤</option>
            <option value="space">Cosmic Space 🚀</option>
          </select>
        </div>

        <MenuRow icon={<HelpCircle size={20} color="#66d9a0" />} title="Help & Support" subtitle="Get help or contact us" />
        
        <div onClick={handleExportData} style={{ display: 'flex', alignItems: 'center', padding: '15px 20px', cursor: 'pointer', borderTop: '1px solid var(--card-border)' }}>
          <div style={{ marginRight: '15px', backgroundColor: 'var(--chip-bg)', padding: '8px', borderRadius: '10px' }}><Download size={20} color="var(--primary)" /></div>
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: 0, fontSize: '15px', color: 'var(--text-main)', fontWeight: '700' }}>Export Research Data</h4>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>Download your data as JSON</p>
          </div>
        </div>

        <div onClick={() => fileInputRef.current.click()} style={{ display: 'flex', alignItems: 'center', padding: '15px 20px', cursor: 'pointer', borderTop: '1px solid var(--card-border)' }}>
          <div style={{ marginRight: '15px', backgroundColor: 'var(--chip-bg)', padding: '8px', borderRadius: '10px' }}><Upload size={20} color="var(--primary)" /></div>
          <div style={{ flex: 1 }}>
            <h4 style={{ margin: 0, fontSize: '15px', color: 'var(--text-main)', fontWeight: '700' }}>Import Data</h4>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>Restore from a JSON backup</p>
          </div>
        </div>
        <input type="file" accept=".json" ref={fileInputRef} onChange={handleImportData} style={{ display: 'none' }} />
      </div>

      <button className="logout-btn" style={{ marginTop: '10px' }}>
        <LogOut size={20} /> Log Out
      </button>

      {/* WARDROBE MODAL */}
      {isWardrobeOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 100, animation: 'fadeIn 0.3s ease' }}>
          
          <style>
            {`
              @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
              @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
            `}
          </style>

          <div style={{ backgroundColor: 'var(--bg-color)', width: '100%', maxWidth: '480px', height: '85vh', borderTopLeftRadius: '40px', borderTopRightRadius: '40px', display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)', borderTop: '4px solid var(--card-border)' }}>
            
            <div style={{ padding: '20px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px dashed var(--card-border)' }}>
              {editingAccessory ? (
                <button onClick={() => setEditingAccessory(null)} style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', color: 'var(--primary)', fontWeight: '700', padding: 0 }}>
                  <ChevronLeft size={20} /> Back
                </button>
              ) : (
                <h3 style={{ margin: 0, fontSize: '20px', color: 'var(--text-main)', fontWeight: '700' }}>Customize {user.petName}</h3>
              )}
              
              <button onClick={() => { setIsWardrobeOpen(false); setEditingAccessory(null); }} style={{ background: 'var(--card-bg)', border: '2px solid var(--card-border)', borderRadius: '50%', padding: '8px', cursor: 'pointer', display: 'flex' }}>
                <X size={20} color="var(--text-main)" />
              </button>
            </div>

            {!editingAccessory && (
              <div style={{ display: 'flex', padding: '15px 20px', gap: '10px' }}>
                {['Accessories', 'Persona', 'Titles'].map(tab => (
                  <button 
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{ flex: 1, padding: '12px', border: '2px solid', borderColor: activeTab === tab ? 'var(--primary)' : 'transparent', borderRadius: '15px', backgroundColor: activeTab === tab ? 'var(--secondary)' : 'var(--card-bg)', color: activeTab === tab ? 'var(--text-on-primary)' : 'var(--text-muted)', fontWeight: '700', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s ease' }}
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
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px', width: '100%', textAlign: 'center', fontWeight: '600' }}>No accessories found.</p>
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
                        <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--card-bg)', borderRadius: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5, position: 'relative', border: '2px solid var(--card-border)' }}>
                          <Paintbrush size={30} color="var(--text-muted)" />
                          <Lock size={20} color="var(--text-muted)" style={{ position: 'absolute' }} />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>Custom Art</p>
                          <p style={{ margin: 0, fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600' }}>Reach Lvl 10</p>
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
                  
                  <div style={{ width: '220px', height: '220px', backgroundColor: 'var(--card-bg)', borderRadius: '30px', border: '3px dashed var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', marginBottom: '20px' }}>
                    {currentPetImage ? <img src={currentPetImage} alt="Pet" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '60px' }}>🐱</span>}
                    
                    {currentAccessoryImage && (
                      <img 
                        src={currentAccessoryImage} 
                        alt="Accessory" 
                        style={{ 
                          position: 'absolute', top: '50%', left: '50%', width: '120px', height: '120px', objectFit: 'contain', zIndex: 10,
                          transform: `translate(calc(-50% + ${currentPos.x}px), calc(-50% + ${currentPos.y}px)) rotate(${currentPos.rotate}deg) scale(${currentPos.scale / 100})`, transformOrigin: 'center center'
                        }} 
                      />
                    )}
                  </div>

                  <h4 style={{ margin: '0 0 15px 0', fontSize: '18px', color: 'var(--text-main)', fontWeight: '700' }}>Adjust Position</h4>

                  <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '15px', padding: '0 10px' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>Move Left / Right</label>
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>{currentPos.x}px</span>
                      </div>
                      <input type="range" min="-150" max="150" value={currentPos.x} onChange={(e) => setCurrentPos({...currentPos, x: Number(e.target.value)})} style={{ width: '100%', accentColor: 'var(--primary)' }} />
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>Move Up / Down</label>
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>{currentPos.y}px</span>
                      </div>
                      <input type="range" min="-150" max="150" value={currentPos.y} onChange={(e) => setCurrentPos({...currentPos, y: Number(e.target.value)})} style={{ width: '100%', accentColor: 'var(--primary)' }} />
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>Tilt</label>
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>{currentPos.rotate}°</span>
                      </div>
                      <input type="range" min="-180" max="180" value={currentPos.rotate} onChange={(e) => setCurrentPos({...currentPos, rotate: Number(e.target.value)})} style={{ width: '100%', accentColor: 'var(--primary)' }} />
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                        <label style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>Scale (Size)</label>
                        <span style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>{currentPos.scale}%</span>
                      </div>
                      <input type="range" min="50" max="300" value={currentPos.scale} onChange={(e) => setCurrentPos({...currentPos, scale: Number(e.target.value)})} style={{ width: '100%', accentColor: 'var(--primary)' }} />
                    </div>
                  </div>

                  <button onClick={handleSaveAdjustment} className="btn-primary" style={{ marginTop: '25px', width: '100%' }}>
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
          width: '80px', height: '80px', backgroundColor: 'var(--card-bg)', borderRadius: '25px', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px', 
          cursor: isUnlocked ? 'pointer' : 'not-allowed', 
          border: isEquipped ? '3px solid var(--primary)' : '3px solid var(--card-border)', 
          boxShadow: isEquipped ? '0 4px 0 var(--secondary)' : 'none',
          opacity: isUnlocked ? 1 : 0.5, position: 'relative', transition: 'all 0.2s ease',
          padding: '10px'
        }}
      >
        {image ? <img src={image} alt={name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : icon}
        
        {!isUnlocked && <Lock size={24} color="var(--text-muted)" style={{ position: 'absolute' }} />}
        
        {isEquipped && (
          <div style={{ 
            position: 'absolute', top: '-8px', right: '-8px', 
            backgroundColor: 'var(--primary)', borderRadius: '50%', padding: '4px', 
            zIndex: 10, border: '2px solid white', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' 
          }}>
            <Check size={14} color="var(--text-on-primary)" strokeWidth={3} />
          </div>
        )}
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: 'var(--text-main)' }}>{name}</p>
        {req && !isUnlocked && <p style={{ margin: 0, fontSize: '10px', color: 'var(--text-muted)', fontWeight: '600' }}>{req}</p>}
      </div>
    </div>
  );
}

function TitleItem({ title, isEquipped, onClick, isLocked }) {
  return (
    <div onClick={() => !isLocked && onClick()} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px', backgroundColor: 'var(--card-bg)', borderRadius: '20px', border: isEquipped ? '2px solid var(--primary)' : '2px solid var(--card-border)', cursor: isLocked ? 'not-allowed' : 'pointer', opacity: isLocked ? 0.5 : 1, transition: 'all 0.2s', boxShadow: isEquipped ? '0 4px 0 var(--secondary)' : 'none' }}>
      <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-main)' }}>🏅 {title}</span>
      {isLocked ? <Lock size={16} color="var(--text-muted)" /> : isEquipped ? <Check size={18} color="var(--primary)" /> : null}
    </div>
  );
}

function MenuRow({ icon, title, subtitle }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '15px 20px', borderBottom: '1px solid var(--card-border)', cursor: 'pointer' }}>
      <div style={{ marginRight: '15px', backgroundColor: 'var(--chip-bg)', padding: '8px', borderRadius: '10px' }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <h4 style={{ margin: 0, fontSize: '15px', color: 'var(--text-main)', fontWeight: '700' }}>{title}</h4>
        <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' }}>{subtitle}</p>
      </div>
    </div>
  );
}