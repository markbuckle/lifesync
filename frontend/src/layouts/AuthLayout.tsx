import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { House, CalendarDays, ListTodo, FolderDot, BotMessageSquare, ChevronLeft, ChevronRight, Settings, Bell, UserRound } from 'lucide-react';

const AuthLayout: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: House },
    { name: 'Calendar', href: '/calendar', icon: CalendarDays },
    { name: 'Tasks', href: '/tasks', icon: ListTodo },
    { name: 'Projects', href: '/projects', icon: FolderDot },
    { name: 'AI Assistant', href: '/assistant', icon: BotMessageSquare },
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
            <Link to="/dashboard" className="flex text-xl font-bold text-primary">
              <img src="/logo.svg" alt="LifeSync Logo" className="w-auto h-6 mr-2 mt-0.5"/>
              <span className="font-bold text-2xl font-architects">
                LifeSync
              </span>
            </Link>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`
                  flex items-center px-3 py-2 rounded-lg transition-colors
                  ${isActive(item.href) 
                    ? 'bg-secondary text-primary-dark' 
                    : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                {!sidebarCollapsed && (
                  <span className="ml-3">{item.name}</span>
                )}
              </Link>
            );
          })}
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
            <Settings className="w-5 h-5" />
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
              <Bell className="w-5 h-5 text-gray-600" />
            </button>
            <button className="w-10 h-10 rounded-full bg-secondary text-primary-dark flex items-center justify-center">
              <UserRound className="w-5 h-5" />
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