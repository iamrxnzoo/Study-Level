import { useApp } from './context/AppContext';
import { Flame, CheckCircle, Clock, ListTodo, Sparkles, Star } from 'lucide-react';

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
      
      {/* Greeting */}
      <div style={{ marginBottom: '25px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '700', color: '#FF85A2', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          Good morning, {user.name}! <Sparkles size={22} color="#FFD700" />
        </h1>
        <p style={{ fontSize: '15px', color: '#B0A0B0', fontWeight: '600', marginTop: '5px' }}>Let's make today super productive! 🌸</p>
      </div>

      {/* XP Level Card - Cute Gradient */}
      <div style={{ background: 'linear-gradient(135deg, #FFD1DC 0%, #FFB6C1 100%)', borderRadius: '30px', padding: '25px', color: 'white', marginBottom: '25px', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 0 #FFA07A, 0 15px 25px rgba(255, 133, 162, 0.3)', border: '3px solid white' }}>
        
        {/* Floating Stars decoration */}
        <Star size={16} color="white" fill="white" style={{ position: 'absolute', top: '15px', left: '15px', opacity: 0.5 }} />
        <Star size={24} color="white" fill="white" style={{ position: 'absolute', bottom: '20px', right: '30px', opacity: 0.3 }} />

        <div style={{ position: 'absolute', top: '-15px', right: '-15px', width: '120px', height: '120px', background: 'rgba(255,255,255,0.3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '4px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
          {currentPetImage ? <img src={currentPetImage} alt="Pet" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '60px' }}>🐱</span>}
        </div>

        <p style={{ margin: '0 0 5px 0', fontSize: '15px', fontWeight: '600', opacity: 0.9, textShadow: '1px 1px 0 rgba(0,0,0,0.1)' }}>Your Study Level</p>
        <h2 style={{ margin: '0 0 15px 0', fontSize: '36px', fontWeight: '700', textShadow: '2px 2px 0 rgba(0,0,0,0.1)' }}>Level {user.level}</h2>
        
        <div style={{ background: 'rgba(255,255,255,0.4)', borderRadius: '15px', padding: '12px', position: 'relative', zIndex: 1, width: '75%', border: '2px solid white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '700', marginBottom: '8px', color: '#FF85A2' }}>
            <span>{xpProgress} / 100 XP</span>
          </div>
          <div style={{ width: '100%', height: '12px', backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: '6px' }}>
            <div style={{ width: `${xpProgress}%`, height: '100%', backgroundColor: '#FF85A2', borderRadius: '6px', transition: 'width 0.3s' }}></div>
          </div>
        </div>
      </div>

      {/* Stat Grid - Bubbly & Colorful */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '25px' }}>
        <div className="card" style={{ padding: '15px 5px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 0, border: '3px solid #E6F0FF', boxShadow: '0 6px 0 #E6F0FF' }}>
          <div style={{ backgroundColor: '#E6F0FF', padding: '10px', borderRadius: '15px', marginBottom: '8px' }}><ListTodo size={20} color="#5B8DEF" /></div>
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#5B8DEF' }}>{totalTasks}</h3>
          <p style={{ margin: 0, fontSize: '10px', color: '#A0AEC0', fontWeight: '700', textAlign: 'center' }}>Total</p>
        </div>
        
        <div className="card" style={{ padding: '15px 5px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 0, border: '3px solid #E6FCEF', boxShadow: '0 6px 0 #E6FCEF' }}>
          <div style={{ backgroundColor: '#E6FCEF', padding: '10px', borderRadius: '15px', marginBottom: '8px' }}><CheckCircle size={20} color="#66D9A0" /></div>
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#66D9A0' }}>{completedTasks}</h3>
          <p style={{ margin: 0, fontSize: '10px', color: '#A0AEC0', fontWeight: '700', textAlign: 'center' }}>Done</p>
        </div>
        
        <div className="card" style={{ padding: '15px 5px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 0, border: '3px solid #FFF9E6', boxShadow: '0 6px 0 #FFF9E6' }}>
          <div style={{ backgroundColor: '#FFF9E6', padding: '10px', borderRadius: '15px', marginBottom: '8px' }}><Clock size={20} color="#F2C94C" /></div>
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#F2C94C' }}>{dueTodayCount}</h3>
          <p style={{ margin: 0, fontSize: '10px', color: '#A0AEC0', fontWeight: '700', textAlign: 'center' }}>Due</p>
        </div>
        
        <div className="card" style={{ padding: '15px 5px', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 0, border: '3px solid #FFE6E6', boxShadow: '0 6px 0 #FFE6E6', position: 'relative' }}>
          <div style={{ backgroundColor: '#FFE6E6', padding: '10px', borderRadius: '15px', marginBottom: '8px' }}><Flame size={20} color="#EB5757" /></div>
          <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '700', color: '#EB5757' }}>{user.streak}</h3>
          <p style={{ margin: 0, fontSize: '10px', color: '#A0AEC0', fontWeight: '700', textAlign: 'center' }}>Streak</p>
          {user.streakFreezes > 0 && (
             <div style={{ position: 'absolute', top: '-8px', right: '-8px', backgroundColor: '#5B8DEF', color: 'white', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', border: '2px solid white', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>❄️</div>
          )}
        </div>
      </div>

      {/* Weekly Progress - Bubbly Card */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <span style={{ fontSize: '24px' }}>📊</span>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#FF85A2' }}>Weekly Progress</h3>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '25px' }}>
            <div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#66D9A0' }}>{completedThisWeek}</div>
              <div style={{ fontSize: '13px', color: '#B0A0B0', fontWeight: '600' }}>Completed</div>
            </div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#5B8DEF' }}>{totalThisWeek}</div>
              <div style={{ fontSize: '13px', color: '#B0A0B0', fontWeight: '600' }}>Remaining</div>
            </div>
          </div>
          
          {/* Cute Donut Chart */}
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: `conic-gradient(#FF85A2 ${weeklyProgress}%, #FFE4E1 0)`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid white', boxShadow: '0 4px 10px rgba(255, 133, 162, 0.2)' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '16px', fontWeight: '700', color: '#FF85A2' }}>{weeklyProgress}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mochi Dialogue - Cute Bubble */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '15px', background: '#FFF9FB', border: '3px dashed #FFD1DC', boxShadow: 'none' }}>
        <div style={{ width: '60px', height: '60px', overflow: 'hidden', borderRadius: '50%', border: '3px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
          {currentPetImage ? <img src={currentPetImage} alt="Pet" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '40px' }}>🐱</span>}
        </div>
        <div style={{ background: 'white', padding: '15px 20px', borderRadius: '20px', borderTopLeftRadius: '0', flex: 1, boxShadow: '0 4px 10px rgba(255, 133, 162, 0.1)' }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#FF85A2', fontWeight: '600', fontStyle: 'italic' }}>
            "{dueTodayCount > 0 ? `You have ${dueTodayCount} tasks due today. You got this!` : "Small steps every day lead to big results! I'm so proud of you! 🌸"}"
          </p>
        </div>
      </div>

    </div>
  );
}