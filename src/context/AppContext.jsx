import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);

  // 1. Check Auth State on Load
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Fetch Data when logged in
  useEffect(() => {
    if (!session) return;

    const fetchData = async () => {
      // Fetch Tasks
      const { data: tasksData } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
      if (tasksData) setTasks(tasksData);

      // Fetch Profile
      const { data: profileData, error } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
      
      if (profileData) {
        setUser(profileData);
      } else if (error && error.code === 'PGRST116') { 
        // PGRST116 means "no rows found", so we create a new profile
        const newUser = {
          id: session.user.id,
          name: "Student",
          level: 1,
          xp: 0,
          streak: 0,
          pet_name: "Mochi",
          pet_type: "cat",
          streak_freezes: 1,
          inventory: [],
          equipped: "default",
          equipped_title: "Beginner",
          theme: "cute",
          is_setup_complete: false,
          accessory_positions: {},
          subjects: ["Math", "Science", "English", "Filipino"]
        };
        const { error: insertError } = await supabase.from('profiles').insert([newUser]);
        if (insertError) console.error("Error creating profile:", insertError);
        setUser(newUser);
      }
      setLoading(false);
    };

    fetchData();
  }, [session]);

  // Update Profile Helper
  const updateProfile = async (updates) => {
    setUser(prev => ({ ...prev, ...updates }));
    if (session) {
      await supabase.from('profiles').update(updates).eq('id', session.user.id);
    }
  };

  const completeSetup = async (realName, petName) => {
    const { error } = await supabase.from('profiles').update({ 
      name: realName, 
      pet_name: petName, 
      is_setup_complete: true 
    }).eq('id', session.user.id);

    if (error) {
      console.error("Error saving setup:", error);
      alert("Failed to save your setup. Please try again.");
      return;
    }

    setUser(prev => ({ 
      ...prev, 
      name: realName, 
      pet_name: petName, 
      is_setup_complete: true 
    }));
  };

  const addTask = async (task) => {
    const { data, error } = await supabase.from('tasks').insert([{ ...task, user_id: session.user.id }]).select();
    if (data) setTasks(prev => [data[0], ...prev]);
  };

  const toggleTask = async (id) => {
    const taskToToggle = tasks.find(t => t.id === id);
    if (!taskToToggle) return;

    const isNowCompleted = !taskToToggle.is_completed;
    const xpChange = isNowCompleted ? taskToToggle.xp_value : -taskToToggle.xp_value;

    setTasks(prev => prev.map(t => t.id === id ? { ...t, is_completed: isNowCompleted, completed_at: isNowCompleted ? new Date().toISOString() : null } : t));
    
    const newXp = Math.max(0, user.xp + xpChange);
    const newLevel = Math.floor(newXp / 100) + 1;
    updateProfile({ xp: newXp, level: newLevel });

    await supabase.from('tasks').update({ 
      is_completed: isNowCompleted, 
      completed_at: isNowCompleted ? new Date().toISOString() : null 
    }).eq('id', id);
  };

  const deleteTask = async (id) => {
    const taskToDelete = tasks.find(t => t.id === id);
    if (taskToDelete?.is_completed) {
      const newXp = Math.max(0, user.xp - taskToDelete.xp_value);
      const newLevel = Math.floor(newXp / 100) + 1;
      updateProfile({ xp: newXp, level: newLevel });
    }
    setTasks(prev => prev.filter(t => t.id !== id));
    await supabase.from('tasks').delete().eq('id', id);
  };

  const equipCosmetic = (item) => updateProfile({ equipped: item });
  const equipTitle = (title) => updateProfile({ equipped_title: title });
  const renameMochi = (newName) => updateProfile({ pet_name: newName });
  const changePetType = (type) => updateProfile({ pet_type: type });
  const changeTheme = (themeId) => updateProfile({ theme: themeId });
  
  const updateAccessoryPosition = (item, position) => {
    updateProfile({ accessory_positions: { ...user.accessory_positions, [item]: position } });
  };

  const addSubject = (subject) => {
    if (!subject.trim()) return;
    const newSubjects = user.subjects.includes(subject) ? user.subjects : [...user.subjects, subject];
    updateProfile({ subjects: newSubjects });
  };

  const logOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setTasks([]);
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '24px', fontWeight: 'bold', color: '#5b8def' }}>Loading StudyLevel...</div>;
  }

  return (
    <AppContext.Provider value={{ 
      session, user, tasks, 
      addTask, toggleTask, deleteTask, 
      equipCosmetic, equipTitle, renameMochi, changePetType, changeTheme, 
      completeSetup, updateAccessoryPosition, addSubject, logOut 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}