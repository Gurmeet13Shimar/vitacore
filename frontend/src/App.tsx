import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Health from './pages/Health';
import Finance from './pages/Finance';
import Career from './pages/Career';
import Goals from './pages/Goals';
import Achievements from './pages/Achievements';
import Settings from './pages/Settings';
import HomePage from './pages/HomePage';
import NotFound from './pages/not-found';
import Notifications from './pages/Notifications';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ThemeProvider>
          <Router>
            <div className="min-h-screen bg-background text-foreground font-sans">
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/health" element={<Health />} />
                <Route path="/finance" element={<Finance />} />
                <Route path="/career" element={<Career />} />
                <Route path="/goals" element={<Goals />} />
                <Route path="/achievements" element={<Achievements />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </Router>
        </ThemeProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;