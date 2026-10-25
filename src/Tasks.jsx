import { useState, useMemo } from 'react';
import { useApp } from './context/AppContext';
import { Plus, CheckCircle, Circle, Trash2, Search, Filter, ArrowUpDown, Clock } from 'lucide-react';

export default function Tasks() {
    const { tasks, user, addTask, toggleTask, deleteTask, addSubject } = useApp();
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(user.subjects?.[0] || 'General');
  const [category, setCategory] = useState('Assignment');
  const [difficulty, setDifficulty] = useState('Low');
  const [deadline, setDeadline] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [error, setError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState('Deadline');

   const handleAddNewSubject = async () => {
    const newSub = window.prompt("Enter a new subject name:");
    if (newSub && newSub.trim() !== "") {
      await addSubject(newSub.trim()); // Save to database
      setSubject(newSub.trim()); // Select it immediately
    }
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    setError('');

    const today = new Date();
    today.setHours(0,0,0,0);
    const selectedDate = new Date(deadline);
    
    if (selectedDate < today) {
      setError("Deadline cannot be in the past!");
      return;
    }

    if (!title || !deadline) return;

    let xpValue = 10;
    if (difficulty === 'Medium') xpValue = 20;
    if (difficulty === 'High') xpValue = 30;

    addTask({
      id: Date.now(), title, subject, category, difficulty, xpValue, deadline,
      estimatedTime: estimatedTime ? Number(estimatedTime) : 0, isCompleted: false
    });

    setShowForm(false);
    setTitle(''); setCategory('Assignment'); setDifficulty('Low'); setDeadline(''); setEstimatedTime('');
  };

  const filteredAndSortedTasks = useMemo(() => {
    let result = tasks;
    if (searchQuery) {
      result = result.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.subject.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (filterDifficulty !== 'All') {
      result = result.filter(t => t.difficulty === filterDifficulty);
    }
    result = [...result].sort((a, b) => {
      if (sortBy === 'Deadline') return new Date(a.deadline) - new Date(b.deadline);
      if (sortBy === 'Difficulty') {
        const weight = { High: 3, Medium: 2, Low: 1 };
        return weight[b.difficulty] - weight[a.difficulty];
      }
      if (sortBy === 'Name') return a.title.localeCompare(b.title);
      return 0;
    });
    return result;
  }, [tasks, searchQuery, filterDifficulty, sortBy]);

  const todoTasks = filteredAndSortedTasks.filter(t => !t.isCompleted);
  const completedTasks = filteredAndSortedTasks.filter(t => t.isCompleted);

  return (
    <div style={{ padding: '20px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>My Tasks</h2>
        <button onClick={() => setShowForm(!showForm)} style={{ background: '#5b8def', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(91, 141, 239, 0.3)' }}>
          <Plus size={24} />
        </button>
      </div>

      {/* Search/Filter/Sort */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', borderRadius: '10px', padding: '0 10px', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
          <Search size={18} color="#a0aec0" />
          <input type="text" placeholder="Search tasks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ border: 'none', padding: '12px', width: '100%', outline: 'none', borderRadius: '10px' }} />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', backgroundColor: 'white', borderRadius: '10px', padding: '0 10px', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
            <Filter size={16} color="#a0aec0" />
            <select value={filterDifficulty} onChange={(e) => setFilterDifficulty(e.target.value)} style={{ border: 'none', padding: '10px', width: '100%', outline: 'none', backgroundColor: 'transparent', fontSize: '13px' }}>
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', backgroundColor: 'white', borderRadius: '10px', padding: '0 10px', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
            <ArrowUpDown size={16} color="#a0aec0" />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ border: 'none', padding: '10px', width: '100%', outline: 'none', backgroundColor: 'transparent', fontSize: '13px' }}>
              <option value="Deadline">Sort by Deadline</option>
              <option value="Difficulty">Sort by Priority</option>
              <option value="Name">Sort by Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Add Task Form */}
      {showForm && (
        <form onSubmit={handleAddTask} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '15px', marginBottom: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
          {error && <div style={{ backgroundColor: '#ffe6e6', color: '#eb5757', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '13px', fontWeight: 'bold' }}>{error}</div>}

          <input type="text" placeholder="Task Name" value={title} onChange={e => setTitle(e.target.value)} required style={inputStyle} />
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <select value={subject} onChange={e => setSubject(e.target.value)} style={{ ...inputStyle, marginBottom: 0, flex: 1 }}>
              {user.subjects?.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
            <button type="button" onClick={handleAddNewSubject} style={{ backgroundColor: '#e6f0ff', color: '#5b8def', border: 'none', borderRadius: '10px', padding: '0 15px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Plus size={16} /> New
            </button>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <select value={category} onChange={e => setCategory(e.target.value)} style={inputStyle}>
              <option>Assignment</option>
              <option>Review</option>
              <option>Activity</option>
              <option>Project</option>
            </select>
            <select value={difficulty} onChange={e => setDifficulty(e.target.value)} style={inputStyle}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Clock size={16} color="#a0aec0" style={{ position: 'absolute', top: '15px', left: '10px' }} />
              <input type="number" placeholder="Est. Time (mins)" value={estimatedTime} onChange={e => setEstimatedTime(e.target.value)} style={{ ...inputStyle, paddingLeft: '32px', marginBottom: 0 }} />
            </div>
            <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} required style={{ ...inputStyle, marginBottom: 0 }} />
          </div>
          
          <button type="submit" style={{ width: '100%', padding: '12px', background: '#5b8def', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', marginTop: '15px' }}>
            Add Task
          </button>
        </form>
      )}

      <h3 style={{ fontSize: '16px', color: '#4a5568', marginBottom: '10px' }}>To Do</h3>
      {todoTasks.length === 0 ? <p style={{ color: '#a0aec0', fontSize: '14px' }}>No tasks found. 🎉</p> : null}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        {todoTasks.map(task => (
          <TaskCard key={task.id} task={task} toggleTask={toggleTask} deleteTask={deleteTask} />
        ))}
      </div>

      <h3 style={{ fontSize: '16px', color: '#4a5568', marginBottom: '10px' }}>Completed</h3>
      {completedTasks.length === 0 ? <p style={{ color: '#a0aec0', fontSize: '14px' }}>No completed tasks yet.</p> : null}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {completedTasks.map(task => (
          <TaskCard key={task.id} task={task} toggleTask={toggleTask} deleteTask={deleteTask} />
        ))}
      </div>
    </div>
  );
}

function TaskCard({ task, toggleTask, deleteTask }) {
  const isCompleted = task.isCompleted;
  let diffBg = '#e6fcef'; let diffColor = '#66d9a0';
  if (task.difficulty === 'Medium') { diffBg = '#fff9e6'; diffColor = '#f2c94c'; }
  if (task.difficulty === 'High') { diffBg = '#ffe6e6'; diffColor = '#eb5757'; }

  const isOverdue = !isCompleted && new Date(task.deadline) < new Date().setHours(0,0,0,0);

  return (
    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'white', padding: '15px', borderRadius: '15px', opacity: isCompleted ? 0.6 : 1, boxShadow: '0 2px 10px rgba(0,0,0,0.03)', borderLeft: isOverdue ? '4px solid #eb5757' : 'none' }}>
      <button onClick={() => toggleTask(task.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '15px', display: 'flex' }}>
        {isCompleted ? <CheckCircle size={24} color="#66d9a0" /> : <Circle size={24} color="#cbd5e0" />}
      </button>

      <div style={{ flex: 1, overflow: 'hidden' }}>
        <h4 style={{ margin: 0, fontSize: '16px', textDecoration: isCompleted ? 'line-through' : 'none', color: isCompleted ? '#a0aec0' : '#2d3748', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {task.title}
        </h4>
        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: isOverdue ? '#eb5757' : '#a0aec0', fontWeight: isOverdue ? 'bold' : 'normal' }}>
          {task.subject} • {new Date(task.deadline).toLocaleDateString()} {isOverdue && '(Overdue)'}
          {task.estimatedTime > 0 && ` • ⏱ ${task.estimatedTime}m`}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '10px' }}>
        <span style={{ backgroundColor: diffBg, color: diffColor, padding: '4px 8px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold' }}>{task.difficulty}</span>
        <button onClick={() => deleteTask(task.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#eb5757' }}><Trash2 size={18} /></button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none', backgroundColor: '#f8fafc'
};