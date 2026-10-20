import { useApp } from './context/AppContext';
import { Flame, CheckCircle, Clock, ListTodo, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const { user, tasks } = useApp();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.isCompleted).length;
  
  const todayString = new Date().toDateString();
  const dueTodayCount = tasks.filter(t => !t.isCompleted && new Date(t.deadline).toDateString() === todayString).length;

  const todayMidnight = new Date().setHours(0,0,0,0);
  const missedCount = tasks.filter(t => !t.isCompleted && new Date(t.deadline).getTime() < todayMidnight).length;

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const completedThisWeek = tasks.filter(t => t.isCompleted && new Date(t.completedAt || Date.now()) >= oneWeekAgo).length;
  const totalThisWeek = tasks.filter(t => new Date(t.deadline) >= oneWeekAgo).length;
  const weeklyProgress = totalThisWeek === 0 ? 0 : Math.round((completedThisWeek / totalThisWeek) * 100);

  const xpProgress = user.xp % 100; 

  let mochiText = "Hi! I'm Mochi. Let's make today productive!";
  if (user.streak > 0 && completedThisWeek > 0) mochiText = "Great progress! You're one step closer to your goals!";
  if (dueTodayCount > 0) mochiText = `You have ${dueTodayCount} task(s) due today. You got this!`;
  if (missedCount > 0) mochiText = `Uh oh, you have ${missedCount} missed task(s). Let's catch up!`;
  if (completedThisWeek >= 5) mochiText = "You're on fire! Keep up the amazing work! 🔥";

  return (
    <div style={{ padding: '20px' }}>
      
      {/* XP / Level Card */}
      <div style={{ background: 'linear-gradient(135deg, #5b8def, #7b61ff)', borderRadius: '20px', padding: '20px', color: 'white', marginBottom: '20px', marginTop: '10px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10px', right: '-10px' }}>
          <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Mochi&backgroundColor=transparent" alt={user.petName || "Mochi"} style={{ width: '100px', height: '100px', opacity: 0.9 }} />
        </div>
        <h3 style={{ margin: '0 0 10px 0', position: 'relative', zIndex: 1 }}>Welcome back, {user.name}!</h3>
        <p style={{ margin: '0 0 15px 0', fontSize: '14px', opacity: 0.9, width: '60%', position: 'relative', zIndex: 1 }}>Small steps every day lead to big results.</p>
        
        <div style={{ background: 'rgba(255,255,255,0.2)', borderRadius: '10px', padding: '10px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '5px' }}>
            <span>Level {user.level}</span>
            <span>{xpProgress} / 100 XP</span>
          </div>
          <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: '4px' }}>
            <div style={{ width: `${xpProgress}%`, height: '100%', backgroundColor: 'white', borderRadius: '4px', transition: 'width 0.3s' }}></div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '15px' }}>
        <StatCard icon={<ListTodo size={18} color="#5b8def" />} label="Total" value={totalTasks} bgColor="#e6f0ff" />
        <StatCard icon={<CheckCircle size={18} color="#66d9a0" />} label="Done" value={completedTasks} bgColor="#e6fcef" />
        <StatCard icon={<AlertCircle size={18} color="#eb5757" />} label="Missed" value={missedCount} bgColor="#ffe6e6" />
        
        <div style={{ position: 'relative' }}>
          <StatCard icon={<Flame size={18} color="#ed8936" />} label="Streak" value={user.streak} bgColor="#fef3c7" />
          {user.streakFreezes > 0 && (
            <div style={{ position: 'absolute', top: '5px', right: '5px', backgroundColor: '#5b8def', color: 'white', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: 'bold', zIndex: 2 }}>
              ❄️
            </div>
          )}
        </div>
      </div>

      {/* Due Today Wide Card */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{ backgroundColor: 'white', borderRadius: '15px', padding: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ backgroundColor: '#fff9e6', padding: '10px', borderRadius: '10px', display: 'flex' }}>
            <Clock size={20} color="#f2c94c" />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '12px', color: '#a0aec0', fontWeight: 'bold' }}>Due Today</p>
            <h3 style={{ margin: 0, fontSize: '18px' }}>{dueTodayCount}</h3>
          </div>
        </div>
      </div>

      {/* Weekly Progress Summary */}
      <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3 style={{ margin: 0, fontSize: '16px', color: '#2d3748' }}>Weekly Progress</h3>
          <span style={{ fontSize: '12px', color: '#a0aec0' }}>Last 7 Days</span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#66d9a0' }}>{completedThisWeek}</div>
              <div style={{ fontSize: '12px', color: '#a0aec0' }}>Completed</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#5b8def' }}>{totalThisWeek}</div>
              <div style={{ fontSize: '12px', color: '#a0aec0' }}>Assigned</div>
            </div>
          </div>
          
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: `conic-gradient(#5b8def ${weeklyProgress}%, #e2e8f0 0)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', color: '#2d3748' }}>
              {weeklyProgress}%
            </div>
          </div>
        </div>
      </div>

      {/* Mochi Dialogue */}
      <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '20px', display: 'flex', alignItems: 'center', gap: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
        <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Mochi&backgroundColor=transparent" alt={user.petName || "Mochi"} style={{ width: '50px', height: '50px' }} />
        <div style={{ backgroundColor: '#f4f7fb', padding: '12px 15px', borderRadius: '15px', borderTopLeftRadius: '0', flex: 1 }}>
          <p style={{ margin: 0, fontSize: '14px', color: '#4a5568', fontStyle: 'italic' }}>"{mochiText}"</p>
        </div>
      </div>

    </div>
  );
}

function StatCard({ icon, label, value, bgColor }) {
  return (
    <div style={{ backgroundColor: 'white', padding: '12px 5px', borderRadius: '15px', boxShadow: '0 2px 10px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div style={{ backgroundColor: bgColor, padding: '8px', borderRadius: '10px', display: 'flex', marginBottom: '8px' }}>
        {icon}
      </div>
      <h3 style={{ margin: 0, fontSize: '18px', color: '#2d3748' }}>{value}</h3>
      <p style={{ margin: '2px 0 0 0', fontSize: '10px', color: '#a0aec0', fontWeight: 'bold' }}>{label}</p>
    </div>
  );
}