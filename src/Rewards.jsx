import { useState } from 'react';
import { useApp } from './context/AppContext';
import { Lock, Check, Flame, Map, X } from 'lucide-react';

export default function Rewards() {
  const { user } = useApp();
  const [isRoadmapOpen, setIsRoadmapOpen] = useState(false);

  const xpProgress = user?.xp % 100 || 0;
  const nextMilestoneLevel = user?.level === 1 ? 2 : user?.level === 2 ? 3 : 4;
  const nextMilestoneName = user?.level === 1 ? "Wizard Hat 🎩" : user?.level === 2 ? "Glasses 👓" : "Mystery Reward 🎁";

  const isUnlocked = (item) => user?.inventory?.includes(item) || false;

  const roadmap = [
    { level: 1, reward: "Graduation Cap 🎓", unlocked: true },
    { level: 2, reward: "Wizard Hat 🎩", unlocked: isUnlocked('wizard_hat') },
    { level: 3, reward: "Glasses 👓", unlocked: isUnlocked('glasses') },
    { level: 5, reward: "Mystery Reward 🎁", unlocked: false }, 
    { level: 10, reward: "Mystery Reward 🎁", unlocked: false }, 
  ];

  return (
    <div style={{ padding: '0 20px 20px 20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: '0 0 5px 0', fontSize: '24px', fontWeight: '700', color: 'var(--text-main)' }}>Rewards & Milestones</h2>
        <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-muted)', fontWeight: '600' }}>Track your progress and unlock cosmetics.</p>
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', fontWeight: '700', color: 'var(--text-main)' }}>Next Milestone</h3>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--primary)' }}>Level {user?.level}</span>
          <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-muted)' }}>Level {nextMilestoneLevel}</span>
        </div>
        
        <div style={{ width: '100%', height: '12px', backgroundColor: 'var(--card-border)', borderRadius: '6px', marginBottom: '15px', position: 'relative' }}>
          <div style={{ width: `${xpProgress}%`, height: '100%', backgroundColor: 'var(--primary)', borderRadius: '6px', transition: 'width 0.3s' }}></div>
        </div>
        
        <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center', fontWeight: '600' }}>
          {user?.level >= 3 ? "You've unlocked everything currently available!" : `Earn ${100 - xpProgress} XP to unlock ${nextMilestoneName}`}
        </p>

        <button onClick={() => setIsRoadmapOpen(true)} style={{ width: '100%', padding: '15px', backgroundColor: 'var(--chip-bg)', color: 'var(--primary)', border: '2px solid var(--card-border)', borderRadius: '15px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s' }}>
          <Map size={18} /> View Milestones
        </button>
      </div>

      <div className="card" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ backgroundColor: '#fef3c7', padding: '15px', borderRadius: '15px' }}>
          <Flame size={28} color="#ed8936" />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: 'var(--text-main)' }}>Streak Freezes</h3>
          {/* FIXED: Changed to user.streak_freezes */}
          <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: 'var(--text-muted)', fontWeight: '600' }}>
            You have <strong>{user?.streak_freezes || 0}</strong> available. These automatically protect your streak if you miss a day.
          </p>
        </div>
      </div>

      {isRoadmapOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 100, animation: 'fadeIn 0.3s ease' }}>
          
          <style>
            {`@keyframes slideUpRoad { from { transform: translateY(100%); } to { transform: translateY(0); } }`}
          </style>

          <div style={{ backgroundColor: 'var(--bg-color)', width: '100%', maxWidth: '480px', height: '85vh', borderTopLeftRadius: '40px', borderTopRightRadius: '40px', display: 'flex', flexDirection: 'column', overflow: 'hidden', animation: 'slideUpRoad 0.3s cubic-bezier(0.16, 1, 0.3, 1)', borderTop: '4px solid var(--card-border)' }}>
            
            <div style={{ padding: '20px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px dashed var(--card-border)' }}>
              <h3 style={{ margin: 0, fontSize: '20px', color: 'var(--text-main)', fontWeight: '700' }}>Milestone Roadmap</h3>
              <button onClick={() => setIsRoadmapOpen(false)} style={{ background: 'var(--card-bg)', border: '2px solid var(--card-border)', borderRadius: '50%', padding: '8px', cursor: 'pointer', display: 'flex' }}>
                <X size={20} color="var(--text-main)" />
              </button>
            </div>

            <div style={{ flex: 1, padding: '30px 20px', overflowY: 'auto' }}>
              <div style={{ position: 'relative', paddingLeft: '20px', borderLeft: '3px solid var(--card-border)' }}>
                {roadmap.map((item, index) => {
                  const isNextUpcoming = user?.level < item.level && (index === 0 || roadmap[index - 1].level <= user?.level);

                  return (
                    <div key={index} style={{ marginBottom: '30px', position: 'relative' }}>
                      <div style={{ position: 'absolute', left: '-31px', top: '0', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: item.unlocked ? 'var(--primary)' : isNextUpcoming ? '#f2c94c' : 'var(--card-border)', border: '4px solid var(--card-bg)', boxShadow: '0 0 0 2px ' + (item.unlocked ? 'var(--primary)' : isNextUpcoming ? '#f2c94c' : 'var(--card-border)') }}></div>
                      
                      <div style={{ backgroundColor: isNextUpcoming ? 'var(--chip-bg)' : 'var(--card-bg)', padding: '15px', borderRadius: '20px', border: isNextUpcoming ? '2px solid #f2c94c' : '2px solid var(--card-border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                          <h4 style={{ margin: 0, fontSize: '16px', color: isNextUpcoming ? '#b7791f' : 'var(--text-main)', fontWeight: '700' }}>Level {item.level}</h4>
                          {item.unlocked ? <Check size={18} color="var(--primary)" /> : <Lock size={16} color="var(--text-muted)" />}
                        </div>
                        <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-main)', fontWeight: '600' }}>{item.reward}</p>
                        
                        {isNextUpcoming && <span style={{ display: 'inline-block', marginTop: '8px', backgroundColor: '#f2c94c', color: 'white', padding: '4px 10px', borderRadius: '10px', fontSize: '10px', fontWeight: '700' }}>NEXT UP</span>}
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