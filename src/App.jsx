import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import ThemeWrapper from './ThemeWrapper'; // <-- IMPORT THIS
import Layout from './Layout';
import Dashboard from './Dashboard';
import Tasks from './Tasks';
import Calendar from './Calendar';
import Profile from './Profile';
import Rewards from './Rewards';
import Setup from './Setup';

function AppContent() {
  const { user } = useApp();

  if (!user.isSetupComplete) {
    return <ThemeWrapper><Setup /></ThemeWrapper>;
  }

  return (
    <ThemeWrapper> {/* <-- WRAP EVERYTHING */}
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