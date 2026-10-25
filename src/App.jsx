import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import ThemeWrapper from './ThemeWrapper';
import Layout from './Layout';
import Dashboard from './Dashboard';
import Tasks from './Tasks';
import Calendar from './Calendar';
import Profile from './Profile';
import Rewards from './Rewards';
import Setup from './Setup';
import Auth from './Auth'; // <-- Import the new login page

function AppContent() {
  const { session, user } = useApp();

  // 1. If no session, show Login
  if (!session) {
    return <ThemeWrapper><Auth /></ThemeWrapper>;
  }

  // 2. If logged in but setup not complete, show Setup
  if (!user?.is_setup_complete) {
    return <ThemeWrapper><Setup /></ThemeWrapper>;
  }

  // 3. Otherwise, show the app
  return (
    <ThemeWrapper>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="rewards" element={<Rewards />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeWrapper>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}