import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Health from './pages/Health';
import Finance from './pages/Finance';
import Career from './pages/Career';
import Simulator from './pages/Simulator';
import Goals from './pages/Goals';
import Achievements from './pages/Achievements';
import Settings from './pages/Settings';
import AIAssistant from './pages/AIAssistant';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
      <div className="min-h-screen bg-slate-900 text-white font-sans">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/health" element={<Health />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/career" element={<Career />} />
          <Route path="/simulator" element={<Simulator />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/ai-assistant" element={<AIAssistant />} />
        </Routes>
      </div>
    </Router>
    </AuthProvider>
  );
}

export default App;