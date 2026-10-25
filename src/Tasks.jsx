import { useState, useMemo } from 'react';
import { useApp } from './context/AppContext';
import { Plus, CheckCircle, Circle, Trash2, Search, Filter, ArrowUpDown, Clock, X } from 'lucide-react';

export default function Tasks() {
  const { tasks, user, addTask, toggleTask, deleteTask, addSubject } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');

  const availableSubjects = user?.subjects || ["Math", "Science", "English", "Filipino"];

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(availableSubjects[0]);
  const [category, setCategory] = useState('Assignment');
  const [difficulty, setDifficulty] = useState('Low');
  const [deadline, setDeadline] = useState('');
  const [estimatedTime, setEstimatedTime] = useState('');
  const [error, setError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState('Deadline');

  const handleAddNewSubject = async (e) => {
    e.preventDefault();
    if (newSubjectName.trim() !== "") {
      await addSubject(newSubjectName.trim());
      setSubject(newSubjectName.trim());
      setNewSubjectName('');
      setIsSubjectModalOpen(false);
    }
  };

  const handleAddTask = async (e) => {
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

    await addTask({
      title, subject, category, difficulty, 
      xp_value: xpValue, deadline, estimated_time: estimatedTime ? Number(estimatedTime) : 0, is_completed: false
    });

    setShowForm(false);
    setTitle(''); setCategory('Assignment'); setDifficulty('Low'); setDeadline(''); setEstimatedTime('');
  };

  const filteredAndSortedTasks = useMemo(() => {
    let result = tasks || [];
    if (searchQuery) result = result.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.subject.toLowerCase().includes(searchQuery.toLowerCase()));
    if (filterDifficulty !== 'All') result = result.filter(t => t.difficulty === filterDifficulty);
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

  const todoTasks = filteredAndSortedTasks.filter(t => !t.is_completed);
  const completedTasks = filteredAndSortedTasks.filter(t => t.is_completed);

  return (
    <div style={{ padding: '0 20px 20px 20px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: 'var(--text-main)' }}>My Tasks</h2>
        <button onClick={() => setShowForm(!showForm)} style={{ background: 'var(--primary)', color: 'var(--text-on-primary)', border: 'none', borderRadius: '50%', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.2)' }}>
          <Plus size={28} />
        </button>
      </div>

      {/* Search/Filter/Sort */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--card-bg)', borderRadius: '15px', padding: '0 15px', border: '2px solid var(--card-border)' }}>
          <Search size={20} color="var(--text-muted)" />
          <input type="text" placeholder="Search tasks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ border: 'none', padding: '15px', width: '100%', outline: 'none', borderRadius: '15px', backgroundColor: 'transparent', color: 'var(--text-main)', fontSize: '15px' }} />
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', backgroundColor: 'var(--card-bg)', borderRadius: '15px', padding: '0 15px', border: '2px solid var(--card-border)' }}>
            <Filter size={18} color="var(--text-muted)" />
            <select value={filterDifficulty} onChange={(e) => setFilterDifficulty(e.target.value)} style={{ border: 'none', padding: '12px', width: '100%', outline: 'none', backgroundColor: 'transparent', color: 'var(--text-main)', fontWeight: '600', fontSize: '14px' }}>
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', backgroundColor: 'var(--card-bg)', borderRadius: '15px', padding: '0 15px', border: '2px solid var(--card-border)' }}>
            <ArrowUpDown size={18} color="var(--text-muted)" />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ border: 'none', padding: '12px', width: '100%', outline: 'none', backgroundColor: 'transparent', color: 'var(--text-main)', fontWeight: '600', fontSize: '14px' }}>
              <option value="Deadline">Sort by Deadline</option>
              <option value="Difficulty">Sort by Priority</option>
              <option value="Name">Sort by Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Add Task Form */}
      {showForm && (
        <form 
          onSubmit={handleAddTask} 
          style={{ 
            backgroundColor: 'var(--card-bg)', padding: '20px', borderRadius: '20px', marginBottom: '20px', 
            border: '2px solid var(--card-border)', boxShadow: 'var(--card-shadow)',
            animation: 'expandHeight 0.3s ease-out', overflow: 'hidden' // <-- ADD THIS
          }}
        >          {error && <div style={{ backgroundColor: '#ffe6e6', color: '#eb5757', padding: '10px', borderRadius: '10px', marginBottom: '15px', fontSize: '13px', fontWeight: 'bold' }}>{error}</div>}

          <input type="text" placeholder="Task Name" value={title} onChange={e => setTitle(e.target.value)} required style={inputStyle} />
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            <select value={subject} onChange={e => setSubject(e.target.value)} style={{ ...inputStyle, marginBottom: 0, flex: 1 }}>
              {availableSubjects.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
            </select>
            <button type="button" onClick={() => setIsSubjectModalOpen(true)} style={{ backgroundColor: 'var(--chip-bg)', color: 'var(--primary)', border: 'none', borderRadius: '15px', padding: '0 15px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
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
              <Clock size={18} color="var(--text-muted)" style={{ position: 'absolute', top: '15px', left: '12px' }} />
              <input type="number" placeholder="Est. Time (mins)" value={estimatedTime} onChange={e => setEstimatedTime(e.target.value)} style={{ ...inputStyle, paddingLeft: '40px', marginBottom: 0 }} />
            </div>
            <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} required style={{ ...inputStyle, marginBottom: 0 }} />
          </div>
          
          <button type="submit" className="btn-primary" style={{ marginTop: '15px' }}>
            Add Task
          </button>
        </form>
      )}

      {/* Lists */}
      <h3 style={{ fontSize: '18px', color: 'var(--text-main)', marginBottom: '10px', fontWeight: '700' }}>To Do</h3>
      {todoTasks.length === 0 ? <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '600' }}>No tasks found. 🎉</p> : null}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        {todoTasks.map(task => <TaskCard key={task.id} task={task} toggleTask={toggleTask} deleteTask={deleteTask} />)}
      </div>

      <h3 style={{ fontSize: '18px', color: 'var(--text-main)', marginBottom: '10px', fontWeight: '700' }}>Completed</h3>
      {completedTasks.length === 0 ? <p style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '600' }}>No completed tasks yet.</p> : null}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {completedTasks.map(task => <TaskCard key={task.id} task={task} toggleTask={toggleTask} deleteTask={deleteTask} />)}
      </div>

    
    {/* ADD SUBJECT MODAL */}
      {isSubjectModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px', animation: 'fadeIn 0.2s ease' }}>
          <div style={{ 
            backgroundColor: 'var(--card-bg)', width: '100%', maxWidth: '350px', borderRadius: '30px', padding: '25px', border: '2px solid var(--card-border)', 
            animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)' // <-- ADD THIS
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', color: 'var(--text-main)', fontWeight: '700' }}>New Subject</h3>
              <button onClick={() => setIsSubjectModalOpen(false)} style={{ background: 'var(--chip-bg)', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer', display: 'flex' }}>
                <X size={20} color="var(--text-main)" />
              </button>
            </div>
            <form onSubmit={handleAddNewSubject}>
              <input 
                type="text" 
                placeholder="e.g. History" 
                value={newSubjectName} 
                onChange={e => setNewSubjectName(e.target.value)} 
                autoFocus
                style={{ ...inputStyle, marginBottom: '20px' }} 
              />
              <button type="submit" className="btn-primary">Add Subject</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function TaskCard({ task, toggleTask, deleteTask }) {
  const isCompleted = task.is_completed;
  let diffBg = 'var(--chip-bg)'; let diffColor = 'var(--primary)';
  if (task.difficulty === 'Medium') { diffBg = '#fff9e6'; diffColor = '#f2c94c'; }
  if (task.difficulty === 'High') { diffBg = '#ffe6e6'; diffColor = '#eb5757'; }

  const isOverdue = !isCompleted && new Date(task.deadline) < new Date().setHours(0,0,0,0);

  return (
    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--card-bg)', padding: '15px', borderRadius: '20px', opacity: isCompleted ? 0.6 : 1, border: '2px solid var(--card-border)', borderLeft: isOverdue ? '6px solid #eb5757' : '2px solid var(--card-border)' }}>
      <button onClick={() => toggleTask(task.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '15px', display: 'flex' }}>
        {isCompleted ? <CheckCircle size={26} color="var(--primary)" /> : <Circle size={26} color="var(--text-muted)" />}
      </button>

      <div style={{ flex: 1, overflow: 'hidden' }}>
        <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '700', textDecoration: isCompleted ? 'line-through' : 'none', color: isCompleted ? 'var(--text-muted)' : 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {task.title}
        </h4>
        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: isOverdue ? '#eb5757' : 'var(--text-muted)', fontWeight: '600' }}>
          {task.subject} • {new Date(task.deadline).toLocaleDateString()} {isOverdue && '(Overdue)'}
          {task.estimated_time > 0 && ` • ⏱ ${task.estimated_time}m`}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '10px' }}>
        <span style={{ backgroundColor: diffBg, color: diffColor, padding: '4px 8px', borderRadius: '8px', fontSize: '12px', fontWeight: '700' }}>{task.difficulty}</span>
        <button onClick={() => deleteTask(task.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#eb5757' }}><Trash2 size={20} /></button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%', padding: '15px', marginBottom: '15px', borderRadius: '15px', border: '2px solid var(--card-border)', fontSize: '15px', outline: 'none', backgroundColor: 'var(--bg-color)', color: 'var(--text-main)', fontWeight: '600'
};