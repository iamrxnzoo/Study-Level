import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useApp } from './context/AppContext';

export default function Calendar() {
  const { tasks } = useApp();
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay(); 
  const startingDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; 

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getTasksForDay = (day) => {
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tasks.filter(t => t.deadline === dateString && !t.isCompleted);
  };

  const getDayColor = (day) => {
    const count = getTasksForDay(day).length;
    if (count === 0) return 'transparent';
    if (count >= 1 && count <= 2) return '#66d9a0'; 
    if (count >= 3 && count <= 4) return '#f2c94c'; 
    if (count >= 5) return '#eb5757'; 
  };

  const days = [];
  for (let i = 0; i < startingDay; i++) days.push(null); 
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const formatSelectedDate = () => {
    if (!selectedDate) return '';
    const d = new Date(year, month, selectedDate);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  // --- NEW: Get Tasks Due Today ---
  const todayString = new Date().toDateString();
  const tasksDueToday = tasks.filter(t => !t.isCompleted && new Date(t.deadline).toDateString() === todayString);

  return (
    <div style={{ padding: '20px' }}>
      
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ margin: 0, fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#5b8def' }}>📅</span> Tasks Needing Attention
        </h2>
        <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#a0aec0' }}>Overdue and upcoming deadlines</p>
      </div>

      {/* Calendar Card */}
      <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <button onClick={prevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><ChevronLeft size={20} color="#4a5568" /></button>
          <h3 style={{ margin: 0, fontSize: '16px' }}>{monthNames[month]} {year}</h3>
          <button onClick={nextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><ChevronRight size={20} color="#4a5568" /></button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontSize: '12px', fontWeight: 'bold', color: '#a0aec0', marginBottom: '10px' }}>
          {dayNames.map(d => <div key={d}>{d}</div>)}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', textAlign: 'center' }}>
          {days.map((day, index) => {
            if (day === null) return <div key={`empty-${index}`}></div>;
            const color = getDayColor(day);
            return (
              <div 
                key={day} 
                onClick={() => setSelectedDate(day)}
                style={{ 
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', margin: '0 auto', borderRadius: '50%',
                  backgroundColor: color !== 'transparent' ? `${color}30` : 'transparent', 
                  color: color !== 'transparent' ? color : '#2d3748',
                  fontWeight: color !== 'transparent' ? 'bold' : 'normal', transition: 'background-color 0.2s'
                }}
              >
                {day}
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px', fontSize: '12px', color: '#a0aec0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#66d9a0' }}></div> 1-2 tasks</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f2c94c' }}></div> 3-4 tasks</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#eb5757' }}></div> 5+ tasks</div>
        </div>
      </div>

      {/* NEW: Tasks Due Today Section */}
      <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '16px', color: '#2d3748' }}>Tasks Due Today</h3>
        
        {tasksDueToday.length === 0 ? (
          <p style={{ margin: 0, fontSize: '14px', color: '#a0aec0', textAlign: 'center' }}>No tasks due today. You're all caught up! 🎉</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {tasksDueToday.map(task => (
              <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '10px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '14px', color: '#2d3748' }}>{task.title}</h4>
                  <p style={{ margin: 0, fontSize: '12px', color: '#a0aec0' }}>{task.subject} • {task.category}</p>
                </div>
                <span style={{ 
                  backgroundColor: task.difficulty === 'High' ? '#ffe6e6' : task.difficulty === 'Medium' ? '#fff9e6' : '#e6fcef',
                  color: task.difficulty === 'High' ? '#eb5757' : task.difficulty === 'Medium' ? '#f2c94c' : '#66d9a0',
                  padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold'
                }}>
                  {task.difficulty}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Pop-up */}
      {selectedDate && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ backgroundColor: 'white', width: '100%', maxWidth: '400px', borderRadius: '20px', padding: '20px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, fontSize: '16px' }}>Tasks on {formatSelectedDate()}</h3>
              <button onClick={() => setSelectedDate(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} color="#a0aec0" />
              </button>
            </div>

            {getTasksForDay(selectedDate).length === 0 ? (
              <p style={{ color: '#a0aec0', textAlign: 'center', margin: '20px 0' }}>No tasks scheduled for this day. 🎉</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {getTasksForDay(selectedDate).map(task => (
                  <div key={task.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '10px' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '14px', color: '#2d3748' }}>{task.title}</h4>
                      <p style={{ margin: 0, fontSize: '12px', color: '#a0aec0' }}>{task.subject} • {task.category}</p>
                    </div>
                    <span style={{ 
                      backgroundColor: task.difficulty === 'High' ? '#ffe6e6' : task.difficulty === 'Medium' ? '#fff9e6' : '#e6fcef',
                      color: task.difficulty === 'High' ? '#eb5757' : task.difficulty === 'Medium' ? '#f2c94c' : '#66d9a0',
                      padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold'
                    }}>
                      {task.difficulty}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}