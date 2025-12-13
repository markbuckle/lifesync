import React from 'react';

const SettingsPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-primary">Profile</h2>
            <p className="text-gray-600">Profile settings coming soon...</p>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4 text-primary">Preferences</h2>
            <p className="text-gray-600">Preferences coming soon...</p>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4 text-primary">Notifications</h2>
            <p className="text-gray-600">Notification settings coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;