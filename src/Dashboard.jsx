import { useApp } from './context/AppContext';
import { Flame, CheckCircle, Clock, ListTodo } from 'lucide-react';

export default function Dashboard() {
  const { user, tasks } = useApp();

  // Load dynamic pet image
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
      
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#2d3748', margin: 0 }}>Good morning,</h1>
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#5b8def', margin: 0 }}>{user.petName || "Mochi"}!</h1>
        <p style={{ fontSize: '14px', color: '#a0aec0', fontWeight: '600', marginTop: '5px' }}>Let's make today productive!</p>
      </div>

      {/* XP Level Card with Synced Pet Image */}
      <div style={{ background: 'linear-gradient(135deg, #6b8df7 0%, #8b6bf7 100%)', borderRadius: '24px', padding: '24px', color: 'white', marginBottom: '20px', position: 'relative', overflow: 'hidden', boxShadow: '0 10px 25px rgba(107, 141, 247, 0.3)' }}>
        
        <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '110px', height: '110px', background: 'rgba(255,255,255,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {currentPetImage ? <img src={currentPetImage} alt="Pet" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '60px' }}>🐱</span>}
        </div>

        <p style={{ margin: '0 0 5px 0', fontSize: '14px', fontWeight: '700', opacity: 0.9 }}>Your Study Level</p>
        <h2 style={{ margin: '0 0 15px 0', fontSize: '32px', fontWeight: '800' }}>Level {user.level}</h2>
        
        <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '12px', padding: '12px', position: 'relative', zIndex: 1, width: '80%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: '700', marginBottom: '8px' }}>
            <span>{xpProgress} / 100 XP</span>
          </div>
          <div style={{ width: '100%', height: '10px', backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '5px' }}>
            <div style={{ width: `${xpProgress}%`, height: '100%', backgroundColor: 'white', borderRadius: '5px', transition: 'width 0.3s' }}></div>
          </div>
        </div>
      </div>

      {/* Stat Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
        <div className="card" style={{ padding: '16px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 0 }}>
          <div style={{ backgroundColor: '#e6f0ff', padding: '10px', borderRadius: '14px', marginBottom: '8px' }}><ListTodo size={20} color="#5b8def" /></div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>{totalTasks}</h3>
          <p style={{ margin: 0, fontSize: '10px', color: '#a0aec0', fontWeight: '700' }}>Total Tasks</p>
        </div>
        
        <div className="card" style={{ padding: '16px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 0 }}>
          <div style={{ backgroundColor: '#e6fcef', padding: '10px', borderRadius: '14px', marginBottom: '8px' }}><CheckCircle size={20} color="#66d9a0" /></div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>{completedTasks}</h3>
          <p style={{ margin: 0, fontSize: '10px', color: '#a0aec0', fontWeight: '700' }}>Completed</p>
        </div>
        
        <div className="card" style={{ padding: '16px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 0 }}>
          <div style={{ backgroundColor: '#fff9e6', padding: '10px', borderRadius: '14px', marginBottom: '8px' }}><Clock size={20} color="#f2c94c" /></div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>{dueTodayCount}</h3>
          <p style={{ margin: 0, fontSize: '10px', color: '#a0aec0', fontWeight: '700' }}>Due Today</p>
        </div>
        
        <div className="card" style={{ padding: '16px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 0, position: 'relative' }}>
          <div style={{ backgroundColor: '#ffe6e6', padding: '10px', borderRadius: '14px', marginBottom: '8px' }}><Flame size={20} color="#eb5757" /></div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800' }}>{user.streak}</h3>
          <p style={{ margin: 0, fontSize: '10px', color: '#a0aec0', fontWeight: '700' }}>Streak</p>
          {user.streakFreezes > 0 && (
             <div style={{ position: 'absolute', top: '-5px', right: '-5px', backgroundColor: '#5b8def', color: 'white', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>❄️</div>
          )}
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
          <span style={{ fontSize: '20px' }}>📊</span>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800' }}>Weekly Progress</h3>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#66d9a0' }}>{completedThisWeek}</div>
              <div style={{ fontSize: '12px', color: '#a0aec0', fontWeight: '700' }}>Completed</div>
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#5b8def' }}>{totalThisWeek}</div>
              <div style={{ fontSize: '12px', color: '#a0aec0', fontWeight: '700' }}>Remaining</div>
            </div>
          </div>
          
          <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: `conic-gradient(#5b8def ${weeklyProgress}%, #e2e8f0 0)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '54px', height: '54px', borderRadius: '50%', backgroundColor: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: '800', color: '#2d3748' }}>{weeklyProgress}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mochi Dialogue */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '15px', background: '#f4f7fb', border: '1px solid #e2e8f0' }}>
        <div style={{ width: '50px', height: '50px', overflow: 'hidden', borderRadius: '50%' }}>
          {currentPetImage ? <img src={currentPetImage} alt="Pet" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '40px' }}>🐱</span>}
        </div>
        <div style={{ background: 'white', padding: '12px 16px', borderRadius: '16px', borderTopLeftRadius: '0', flex: 1, boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <p style={{ margin: 0, fontSize: '13px', color: '#4a5568', fontWeight: '600', fontStyle: 'italic' }}>
            "{dueTodayCount > 0 ? `You have ${dueTodayCount} tasks due today. You got this!` : "Small steps every day lead to big results!"}"
          </p>
        </div>
      </div>

    </div>
  );
}

