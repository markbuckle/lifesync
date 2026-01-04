import React, { useState } from 'react';
import SettingsSection from '../../components/settings/SettingsSection';
import { User, Bell, Palette, Lock } from 'lucide-react';

const SettingsPage: React.FC = () => {

  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    timezone: 'America/New_York',
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    taskReminders: true,
    appointmentReminders: true,
    weeklyDigest: false,
  });

  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'en',
    startOfWeek: 'sunday',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key],
    });
  };

  const handlePreferenceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPreferences({
      ...preferences,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save to backend
    console.log('Saving profile:', profile);
    alert('Profile saved!');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="space-y-6">
        {/* Profile Section */}
        <SettingsSection
          title="Profile"
          description="Manage your personal information"
        >
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleProfileChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Timezone
              </label>
              <select
                name="timezone"
                value={profile.timezone}
                onChange={handleProfileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="America/Halifax">Atlantic Time (AT)</option>
              </select>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
              >
                Save Changes
              </button>
            </div>
          </form>
        </SettingsSection>

        {/* Notifications Section */}
        <SettingsSection
          title="Notifications"
          description="Manage how you receive updates"
        >
          <div className="space-y-4">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between py-2">
                <div>
                  <h3 className="font-medium text-gray-800">
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {key === 'emailNotifications' && 'Receive notifications via email'}
                    {key === 'pushNotifications' && 'Receive push notifications in browser'}
                    {key === 'taskReminders' && 'Get reminders for upcoming tasks'}
                    {key === 'appointmentReminders' && 'Get reminders for appointments'}
                    {key === 'weeklyDigest' && 'Receive a weekly summary email'}
                  </p>
                </div>
                <button
                  onClick={() => handleNotificationToggle(key as keyof typeof notifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? 'bg-primary' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        </SettingsSection>

        {/* Preferences Section */}
        <SettingsSection
          title="Preferences"
          description="Customize your experience"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Theme
              </label>
              <select
                name="theme"
                value={preferences.theme}
                onChange={handlePreferenceChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select
                name="language"
                value={preferences.language}
                onChange={handlePreferenceChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start of Week
              </label>
              <select
                name="startOfWeek"
                value={preferences.startOfWeek}
                onChange={handlePreferenceChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="sunday">Sunday</option>
                <option value="monday">Monday</option>
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Format
                </label>
                <select
                  name="dateFormat"
                  value={preferences.dateFormat}
                  onChange={handlePreferenceChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time Format
                </label>
                <select
                  name="timeFormat"
                  value={preferences.timeFormat}
                  onChange={handlePreferenceChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="12h">12-hour</option>
                  <option value="24h">24-hour</option>
                </select>
              </div>
            </div>
          </div>
        </SettingsSection>

        {/* Security Section */}
        <SettingsSection
          title="Security"
          description="Manage your account security"
        >
          <div className="space-y-4">
            <button className="w-full md:w-auto px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:border-primary hover:text-primary transition-colors">
              Change Password
            </button>
            <div className="pt-4 border-t border-gray-200">
              <h3 className="font-medium text-gray-800 mb-2">Delete Account</h3>
              <p className="text-sm text-gray-600 mb-4">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </SettingsSection>
      </div>
    </div>
  );
};

export default SettingsPage;