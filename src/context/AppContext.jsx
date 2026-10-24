import { createContext, useState, useEffect, useContext } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('studylevel_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('studylevel_user');
    return saved ? JSON.parse(saved) : { 
      name: "Marlow", 
      level: 1, 
      xp: 0, 
      streak: 0, 
      lastActiveDate: null, 
      streakFreezes: 1,
      inventory: [], 
      equipped: "default",
      unlockedTitles: ["Beginner"],
      equippedTitle: "Beginner",
      petName: "Mochi",
      petType: "cat",
      subjects: ["Math", "Science", "English", "Filipino"],
      accessoryPositions: {} // Stores custom X, Y, Tilt, Scale
    };
  });

  const [analytics, setAnalytics] = useState(() => {
    const saved = localStorage.getItem('studylevel_analytics');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => { localStorage.setItem('studylevel_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('studylevel_user', JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem('studylevel_analytics', JSON.stringify(analytics)); }, [analytics]);

  const logEvent = (action, details = "") => {
    setAnalytics(prev => [...prev, { timestamp: new Date().toISOString(), action, details }]);
  };

  useEffect(() => {
    if (!user.lastActiveDate) return; 
    const today = new Date(); today.setHours(0,0,0,0);
    const lastActive = new Date(user.lastActiveDate); lastActive.setHours(0,0,0,0);
    const diffInDays = Math.round((today.getTime() - lastActive.getTime()) / (1000 * 3600 * 24));

    if (diffInDays > 1) {
      if (user.streakFreezes > 0) {
        setUser(prev => ({ ...prev, streakFreezes: prev.streakFreezes - 1, lastActiveDate: new Date(today.getTime() - 86400000).toISOString() }));
        logEvent("STREAK_FREEZE_USED");
      } else {
        setUser(prev => ({ ...prev, streak: 0 }));
        logEvent("STREAK_LOST");
      }
    }
  }, []); 

  const addTask = (task) => {
    setTasks(prev => [...prev, task]);
    logEvent("TASK_ADDED", task.title);
  };

  const toggleTask = (id) => {
    const taskToToggle = tasks.find(t => t.id === id);
    if (!taskToToggle) return;

    const isNowCompleted = !taskToToggle.isCompleted;
    const xpChange = isNowCompleted ? taskToToggle.xpValue : -taskToToggle.xpValue;

    setTasks(prevTasks => prevTasks.map(task => 
      task.id === id ? { ...task, isCompleted: isNowCompleted, completedAt: isNowCompleted ? new Date().toISOString() : null } : task
    ));

    setUser(prevUser => {
      const newXp = Math.max(0, prevUser.xp + xpChange);
      const newLevel = Math.floor(newXp / 100) + 1;
      let newInventory = [...prevUser.inventory];
      
      if (newLevel >= 2 && !newInventory.includes('wizard_hat')) {
        newInventory.push('wizard_hat');
        logEvent("REWARD_UNLOCKED", "wizard_hat");
      }
      if (newLevel >= 3 && !newInventory.includes('glasses')) {
        newInventory.push('glasses');
        logEvent("REWARD_UNLOCKED", "glasses");
      }

      return { ...prevUser, xp: newXp, level: newLevel, inventory: newInventory };
    });

    if (isNowCompleted) {
      logEvent("TASK_COMPLETED", taskToToggle.title);
      const today = new Date(); today.setHours(0,0,0,0);
      setUser(prevUser => {
        if (prevUser.lastActiveDate) {
          const lastActive = new Date(prevUser.lastActiveDate); lastActive.setHours(0,0,0,0);
          if (lastActive.getTime() === today.getTime()) return prevUser;
        }
        return { ...prevUser, streak: prevUser.streak + 1, lastActiveDate: today.toISOString() };
      });
    } else {
      logEvent("TASK_UNDONE", taskToToggle.title);
    }
  };

  const deleteTask = (id) => {
    const taskToDelete = tasks.find(t => t.id === id);
    if (taskToDelete && taskToDelete.isCompleted) {
      setUser(prevUser => {
        const newXp = Math.max(0, prevUser.xp - taskToDelete.xpValue);
        const newLevel = Math.floor(newXp / 100) + 1;
        return { ...prevUser, xp: newXp, level: newLevel };
      });
    }
    setTasks(prev => prev.filter(t => t.id !== id));
    logEvent("TASK_DELETED", taskToDelete?.title || "Unknown");
  };

  const equipCosmetic = (item) => {
    setUser(prev => ({ ...prev, equipped: item }));
    logEvent("COSMETIC_EQUIPPED", item);
  };

  const updateAccessoryPosition = (item, position) => {
    setUser(prev => {
      const currentPositions = prev.accessoryPositions || {};
      return {
        ...prev,
        accessoryPositions: {
          ...currentPositions,
          [item]: position
        }
      };
    });
  };

  const equipTitle = (title) => {
    setUser(prev => ({ ...prev, equippedTitle: title }));
    logEvent("TITLE_EQUIPPED", title);
  };

  const renameMochi = (newName) => {
    setUser(prev => ({ ...prev, petName: newName }));
    logEvent("MOCHI_RENAMED", newName);
  };

  const changePetType = (type) => {
    setUser(prev => ({ ...prev, petType: type }));
    logEvent("PET_TYPE_CHANGED", type);
  };

  const addSubject = (subject) => {
    if (!subject.trim()) return;
    setUser(prev => {
      if (prev.subjects.includes(subject.trim())) return prev;
      return { ...prev, subjects: [...prev.subjects, subject.trim()] };
    });
    logEvent("SUBJECT_ADDED", subject);
  };

  return (
    <AppContext.Provider value={{ tasks, user, analytics, addTask, toggleTask, deleteTask, equipCosmetic, equipTitle, renameMochi, changePetType, addSubject, updateAccessoryPosition }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}