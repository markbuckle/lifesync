import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const AuthLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '🏠' },
    { name: 'Calendar', href: '/calendar', icon: '📅' },
    { name: 'Tasks', href: '/tasks', icon: '📋' },
    { name: 'Projects', href: '/projects', icon: '📊' },
    { name: 'AI Assistant', href: '/assistant', icon: '✨' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside 
        className={`${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          {!sidebarCollapsed && (
            <Link to="/dashboard" className="text-xl font-bold text-primary">
              LifeSync
            </Link>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`
                flex items-center px-3 py-2 rounded-lg transition-colors
                ${isActive(item.href) 
                  ? 'bg-primary-light text-primary-dark' 
                  : 'text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <span className="text-xl">{item.icon}</span>
              {!sidebarCollapsed && (
                <span className="ml-3">{item.name}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* Settings */}
        <div className="px-3 py-4 border-t border-gray-200">
          <Link
            to="/settings"
            className={`
              flex items-center px-3 py-2 rounded-lg transition-colors
              ${isActive('/settings')
                ? 'bg-primary-light text-primary-dark'
                : 'text-gray-700 hover:bg-gray-100'
              }
            `}
          >
            <span className="text-xl">⚙️</span>
            {!sidebarCollapsed && <span className="ml-3">Settings</span>}
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div className="flex-1 max-w-2xl">
            <input
              type="text"
              placeholder="Search everything..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          
          <div className="flex items-center space-x-4 ml-6">
            <button className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark">
              + New
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100">
              🔔
            </button>
            <button className="w-10 h-10 rounded-full bg-primary-light text-primary-dark flex items-center justify-center font-semibold">
              U
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AuthLayout;