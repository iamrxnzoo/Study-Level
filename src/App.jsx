import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './Layout';
import Dashboard from './Dashboard';
import Tasks from './Tasks';
import Calendar from './Calendar';
import Profile from './Profile';
import Rewards from './Rewards';
import Setup from './Setup'; // Import Setup

function AppContent() {
  const { user } = useApp();

  // If setup isn't complete, force the Setup screen
  if (!user.isSetupComplete) {
    return <Setup />;
  }

  return (
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
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}