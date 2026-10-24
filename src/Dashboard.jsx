import { useApp } from './context/AppContext';
import { Flame, CheckCircle, Clock, ListTodo, Sparkles, Star } from 'lucide-react';

export default function Dashboard() {
  const { user, tasks } = useApp();

  const petFiles = import.meta.glob('/public/images/pets/*.{png,jpg,jpeg,svg,jfif}', { eager: true });
  const petChoices = Object.keys(petFiles).map(path => {
    const fileName = path.split('/').pop();
    const id = fileName.split('.')[0];
    return { id, src: `/images/pets/${fileName}` };
  });
  const currentPetImage = petChoices.find(p => p.id === user.petType)?.src || petChoices[0]?.src;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.isCompleted).length;
  const todayString = new Date().toDateString();
  const dueTodayCount = tasks.filter(t => !t.isCompleted && new Date(t.deadline).toDateString() === todayString).length;
  
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const completedThisWeek = tasks.filter(t => t.isCompleted && new Date(t.completedAt || Date.now()) >= oneWeekAgo).length;
  const totalThisWeek = tasks.filter(t => new Date(t.deadline) >= oneWeekAgo).length;
  const weeklyProgress = totalThisWeek === 0 ? 0 : Math.round((completedThisWeek / totalThisWeek) * 100);

  const xpProgress = user.xp % 100; 

  return (
    <div style={{ padding: '0 20px 20px 20px' }}>
      
      <div style={{ marginBottom: '25px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '700', color: 'var(--primary)', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          Good morning, {user.name}! <Sparkles size={22} color="var(--secondary)" />
        </h1>
        <p style={{ fontSize: '15px', color: 'var(--text-muted)', fontWeight: '600', marginTop: '5px' }}>Let's make today super productive! 🌸</p>
      </div>

      <div style={{ background: 'var(--card-bg)', borderRadius: '30px', padding: '25px', color: 'var(--text-main)', marginBottom: '25px', position: 'relative', overflow: 'hidden', boxShadow: `0 8px 0 var(--card-border), 0 15px 25px rgba(0,0,0,0.2)`, border: '3px solid var(--card-border)' }}>
        
        <Star size={16} fill="currentColor" style={{ position: 'absolute', top: '15px', left: '15px', opacity: 0.1 }} />
        <Star size={24} fill="currentColor" style={{ position: 'absolute', bottom: '20px', right: '30px', opacity: 0.1 }} />

        <div style={{ position: 'absolute', top: '-15px', right: '-15px', width: '120px', height: '120px', background: 'var(--chip-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '4px solid var(--card-border)' }}>
          {currentPetImage ? <img src={currentPetImage} alt="Pet" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '60px' }}>🐱</span>}
        </div>

        <p style={{ margin: '0 0 5px 0', fontSize: '15px', fontWeight: '600', color: 'var(--text-muted)' }}>Your Study Level</p>
        <h2 style={{ margin: '0 0 15px 0', fontSize: '36px', fontWeight: '700', color: 'var(--text-main)' }}>Level {user.level}</h2>
        
        <div style={{ background: 'var(--chip-bg)', borderRadius: '15px', padding: '12px', position: 'relative', zIndex: 1, width: '75%', border: '2px solid var(--card-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '700', marginBottom: '8px', color: 'var(--text-main)' }}>
            <span>{xpProgress} / 100 XP</span>
          </div>
          <div style={{ width: '100%', height: '12px', backgroundColor: 'var(--card-border)', borderRadius: '6px' }}>
            {/* THE XP BAR uses primary color now */}
            <div style={{ width: `${xpProgress}%`, height: '100%', backgroundColor: 'var(--primary)', borderRadius: '6px', transition: 'width 0.3s', boxShadow: '0 0 10px var(--primary)' }}></div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '25px' }}>
        <div className="card" style={{ padding: '15px 5px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 0, border: '2px solid var(--card-border)' }}>
          <div style={{ backgroundColor: 'var(--chip-bg)', padding: '10px', borderRadius: '15px', marginBottom: '8px' }}><ListTodo size={20} color="var(--primary)" /></div>
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: 'var(--text-main)' }}>{totalTasks}</h3>
          <p className="text-chip" style={{ margin: '5px 0 0 0', fontSize: '10px' }}>Total</p>
        </div>
        
        <div className="card" style={{ padding: '15px 5px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 0, border: '2px solid var(--card-border)' }}>
          <div style={{ backgroundColor: 'var(--chip-bg)', padding: '10px', borderRadius: '15px', marginBottom: '8px' }}><CheckCircle size={20} color="#66D9A0" /></div>
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: 'var(--text-main)' }}>{completedTasks}</h3>
          <p className="text-chip" style={{ margin: '5px 0 0 0', fontSize: '10px' }}>Done</p>
        </div>
        
        <div className="card" style={{ padding: '15px 5px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 0, border: '2px solid var(--card-border)' }}>
          <div style={{ backgroundColor: 'var(--chip-bg)', padding: '10px', borderRadius: '15px', marginBottom: '8px' }}><Clock size={20} color="#F2C94C" /></div>
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: 'var(--text-main)' }}>{dueTodayCount}</h3>
          <p className="text-chip" style={{ margin: '5px 0 0 0', fontSize: '10px' }}>Due</p>
        </div>
        
        <div className="card" style={{ padding: '15px 5px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 0, border: '2px solid var(--card-border)', position: 'relative' }}>
          <div style={{ backgroundColor: 'var(--chip-bg)', padding: '10px', borderRadius: '15px', marginBottom: '8px' }}><Flame size={20} color="#EB5757" /></div>
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: 'var(--text-main)' }}>{user.streak}</h3>
          <p className="text-chip" style={{ margin: '5px 0 0 0', fontSize: '10px' }}>Streak</p>
          {user.streakFreezes > 0 && (
             <div style={{ position: 'absolute', top: '-8px', right: '-8px', backgroundColor: 'var(--primary)', color: 'var(--text-on-primary)', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', border: '2px solid var(--card-border)' }}>❄️</div>
          )}
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <span style={{ fontSize: '24px' }}>📊</span>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: 'var(--text-main)' }}>Weekly Progress</h3>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '25px' }}>
            <div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#66D9A0' }}>{completedThisWeek}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>Completed</div>
            </div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--primary)' }}>{totalThisWeek}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '600' }}>Remaining</div>
            </div>
          </div>
          
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: `conic-gradient(var(--primary) ${weeklyProgress}%, var(--card-border) 0)`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid var(--card-bg)', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'var(--card-bg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--primary)' }}>{weeklyProgress}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'var(--card-bg)', border: '2px dashed var(--card-border)', boxShadow: 'none' }}>
        <div style={{ width: '60px', height: '60px', overflow: 'hidden', borderRadius: '50%', border: '3px solid var(--card-border)', backgroundColor: 'white' }}>
          {currentPetImage ? <img src={currentPetImage} alt="Pet" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '40px' }}>🐱</span>}
        </div>
        <div style={{ background: 'var(--chip-bg)', padding: '15px 20px', borderRadius: '20px', borderTopLeftRadius: '0', flex: 1 }}>
          <p style={{ margin: 0, fontSize: '14px', color: 'var(--chip-color)', fontWeight: '600', fontStyle: 'italic' }}>
            "{dueTodayCount > 0 ? `You have ${dueTodayCount} tasks due today. You got this!` : "Small steps every day lead to big results! I'm so proud of you! 🌸"}"
          </p>
        </div>
      </div>

    </div>
  );
}