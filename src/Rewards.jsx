import { useState } from 'react';
import { useApp } from './context/AppContext';
import { Lock, Check, Shirt, Flame, Map, X, ChevronRight } from 'lucide-react';

export default function Rewards() {
  const { user, equipCosmetic } = useApp();
  const [isRoadmapOpen, setIsRoadmapOpen] = useState(false);

  const xpProgress = user.xp % 100;
  const nextMilestoneLevel = user.level === 1 ? 2 : user.level === 2 ? 3 : 4;
  const nextMilestoneName = user.level === 1 ? "Wizard Hat 🎩" : user.level === 2 ? "Glasses 👓" : "Mystery Reward 🎁";

  const isUnlocked = (item) => user.inventory.includes(item);

  // Roadmap Data (Content spaced out)
  const roadmap = [
    { level: 1, reward: "Graduation Cap 🎓", unlocked: true },
    { level: 2, reward: "Wizard Hat 🎩", unlocked: isUnlocked('wizard_hat') },
    { level: 3, reward: "Glasses 👓", unlocked: isUnlocked('glasses') },
    { level: 5, reward: "Mystery Reward 🎁", unlocked: false }, 
    { level: 10, reward: "Mystery Reward 🎁", unlocked: false }, 
  ];

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: '0 0 5px 0' }}>Rewards & Milestones</h2>
        <p style={{ margin: 0, fontSize: '14px', color: '#a0aec0' }}>Track your progress and unlock cosmetics.</p>
      </div>

      {/* Milestone Tracker Box */}
      <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '20px', marginBottom: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>Next Milestone</h3>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#5b8def' }}>Level {user.level}</span>
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#a0aec0' }}>Level {nextMilestoneLevel}</span>
        </div>
        
        <div style={{ width: '100%', height: '12px', backgroundColor: '#e2e8f0', borderRadius: '6px', marginBottom: '10px', position: 'relative' }}>
          <div style={{ width: `${xpProgress}%`, height: '100%', backgroundColor: '#5b8def', borderRadius: '6px', transition: 'width 0.3s' }}></div>
        </div>
        
        <p style={{ margin: '0 0 20px 0', fontSize: '12px', color: '#a0aec0', textAlign: 'center' }}>
          {user.level >= 3 ? "You've unlocked everything currently available!" : `Earn ${100 - xpProgress} XP to unlock ${nextMilestoneName}`}
        </p>

        {/* The big visible button */}
        <button onClick={() => setIsRoadmapOpen(true)} style={{ width: '100%', padding: '15px', backgroundColor: '#e6f0ff', color: '#5b8def', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Map size={18} /> View Milestones
        </button>
      </div>

      {/* Streak Freezes */}
      <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '20px', marginBottom: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ backgroundColor: '#fef3c7', padding: '15px', borderRadius: '15px' }}>
          <Flame size={28} color="#ed8936" />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '16px' }}>Streak Freezes</h3>
          <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#a0aec0' }}>You have <strong>{user.streakFreezes}</strong> available. These automatically protect your streak if you miss a day.</p>
        </div>
      </div>

      {/* Wardrobe */}
      <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
          <Shirt size={20} color="#5b8def" />
          <h3 style={{ margin: 0, fontSize: '16px' }}>Wardrobe</h3>
        </div>
        
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <WardrobeItem icon="🎓" name="Grad Cap" isUnlocked={true} isEquipped={user.equipped === 'default'} onClick={() => equipCosmetic('default')} />
          <WardrobeItem icon="🎩" name="Wizard Hat" isUnlocked={isUnlocked('wizard_hat')} isEquipped={user.equipped === 'wizard_hat'} onClick={() => equipCosmetic('wizard_hat')} req="Lvl 2" />
          <WardrobeItem icon="👓" name="Glasses" isUnlocked={isUnlocked('glasses')} isEquipped={user.equipped === 'glasses'} onClick={() => equipCosmetic('glasses')} req="Lvl 3" />
        </div>
      </div>

      {/* --- ROADMAP MODAL --- */}
      {isRoadmapOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: 'white', width: '100%', maxWidth: '480px', height: '85vh', borderTopLeftRadius: '30px', borderTopRightRadius: '30px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            
            <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #edf2f7' }}>
              <h3 style={{ margin: 0, fontSize: '18px' }}>Milestone Roadmap</h3>
              <button onClick={() => setIsRoadmapOpen(false)} style={{ background: '#f4f7fb', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer', display: 'flex' }}>
                <X size={20} color="#4a5568" />
              </button>
            </div>

            <div style={{ flex: 1, padding: '30px 20px', overflowY: 'auto' }}>
              
              <div style={{ position: 'relative', paddingLeft: '20px', borderLeft: '3px solid #e2e8f0' }}>
                {roadmap.map((item, index) => {
                  const isCurrent = user.level === item.level;
                  
                  // If the user is between levels (e.g., Level 4), highlight the NEXT upcoming milestone box
                  const isNextUpcoming = user.level < item.level && (index === 0 || roadmap[index - 1].level <= user.level);

                  return (
                    <div key={index} style={{ marginBottom: '30px', position: 'relative' }}>
                      
                      {/* Timeline Dot */}
                      <div style={{ position: 'absolute', left: '-31px', top: '0', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: item.unlocked ? '#5b8def' : isNextUpcoming ? '#f2c94c' : '#e2e8f0', border: '4px solid white', boxShadow: '0 0 0 2px ' + (item.unlocked ? '#5b8def' : isNextUpcoming ? '#f2c94c' : '#e2e8f0') }}></div>
                      
                      <div style={{ backgroundColor: isNextUpcoming ? '#fff9e6' : '#f8fafc', padding: '15px', borderRadius: '15px', border: isNextUpcoming ? '2px solid #f2c94c' : '2px solid transparent' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                          <h4 style={{ margin: 0, fontSize: '16px', color: isNextUpcoming ? '#b7791f' : '#2d3748' }}>Level {item.level}</h4>
                          {item.unlocked ? <Check size={18} color="#5b8def" /> : <Lock size={16} color="#a0aec0" />}
                        </div>
                        <p style={{ margin: 0, fontSize: '14px', color: '#4a5568' }}>{item.reward}</p>
                        
                        {isNextUpcoming && <span style={{ display: 'inline-block', marginTop: '8px', backgroundColor: '#f2c94c', color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 'bold' }}>NEXT UP</span>}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function WardrobeItem({ icon, name, isUnlocked, isEquipped, onClick, req }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <div 
        onClick={() => isUnlocked && onClick()}
        style={{ width: '70px', height: '70px', backgroundColor: '#f4f7fb', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', cursor: isUnlocked ? 'pointer' : 'not-allowed', border: isEquipped ? '3px solid #5b8def' : '3px solid transparent', opacity: isUnlocked ? 1 : 0.4, position: 'relative' }}
      >
        {icon}
        {!isUnlocked && <Lock size={20} color="#4a5568" style={{ position: 'absolute' }} />}
        {isEquipped && <div style={{ position: 'absolute', bottom: '-5px', right: '-5px', backgroundColor: '#5b8def', borderRadius: '50%', padding: '2px' }}><Check size={12} color="white" /></div>}
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: '12px', fontWeight: 'bold', color: '#2d3748' }}>{name}</p>
        {req && !isUnlocked && <p style={{ margin: 0, fontSize: '10px', color: '#a0aec0' }}>{req}</p>}
      </div>
    </div>
  );
}