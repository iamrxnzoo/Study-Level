import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './Layout';
import Dashboard from './Dashboard';
import Tasks from './Tasks';
import Calendar from './Calendar';
import Profile from './Profile';
import Rewards from './Rewards';



export default function App() {
  return (
    <AppProvider>
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
    </AppProvider>
  );
  }
