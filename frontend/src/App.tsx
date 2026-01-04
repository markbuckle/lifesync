import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AuthLayout from './layouts/AuthLayout';

// Public pages
import HomePage from './pages/public/HomePage';
import FeaturesPage from './pages/public/FeaturesPage';
import PricingPage from './pages/public/PricingPage';
import LoginPage from './pages/public/LoginPage';
import SignupPage from './pages/public/SignupPage';

// Authenticated pages
import DashboardPage from './pages/auth/DashboardPage';
import CalendarPage from './pages/auth/CalendarPage';
import TasksPage from './pages/auth/TasksPage';
import ProjectsPage from './pages/auth/ProjectsPage';
import ProjectDetailPage from './pages/auth/ProjectDetailPage';
import AIAssistantPage from './pages/auth/AIAssistantPage';
import SettingsPage from './pages/auth/SettingsPage';

// Styles
import './styles/fonts.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        {/* Authenticated routes */}
        <Route element={<AuthLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/assistant" element={<AIAssistantPage />} />
          <Route path="/settings" element={<SettingsPage />} /> 
        </Route>
      </Routes>
    </Router>
  );
}

export default App;