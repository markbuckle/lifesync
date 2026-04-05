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
import PasswordResetPage from './pages/public/PasswordResetPage';
import SetNewPasswordPage from './pages/public/SetNewPasswordPage';

// Authenticated pages
import DashboardPage from './pages/auth/DashboardPage';
import CalendarPage from './pages/auth/CalendarPage';
import TasksPage from './pages/auth/TasksPage';
// import ProjectsPage from './pages/auth/ProjectsPage';
// import ProjectDetailPage from './pages/auth/ProjectDetailPage';
import AIAssistantPage from './pages/auth/AIAssistantPage';
import SettingsPage from './pages/auth/SettingsPage';
import ProfilePage from './pages/auth/ProfilePage';
import HelpPage from './pages/auth/HelpPage';
import UpgradePage from './pages/auth/UpgradePage';

// Styles
import './styles/fonts.css';

function App() {
  return (
      <Routes>
        {/* Public routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
        </Route>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/reset-password" element={<PasswordResetPage />} />
          <Route path="/reset-password/:token" element={<SetNewPasswordPage />} />

        {/* Authenticated routes */}
        <Route element={<AuthLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          {/* Projects routes - uncomment to re-enable:
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          */}
          <Route path="/assistant" element={<AIAssistantPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/upgrade" element={<UpgradePage />} />
        </Route>
      </Routes>
  );
}

export default App;