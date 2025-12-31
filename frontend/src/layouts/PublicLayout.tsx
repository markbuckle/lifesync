import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <img src="/logo.svg" alt="LifeSync Logo" className="h-8 w-auto" />
                <span className="text-2xl font-bold text-primary">LifeSync</span>
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/features" className="text-gray-700 hover:text-primary">
                Features
              </Link>
              <Link to="/pricing" className="text-gray-700 hover:text-primary">
                Pricing
              </Link>
              <Link 
                to="/login" 
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Page content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img src="/logo.svg" alt="LifeSync Logo" className="h-6 w-auto" />
            <span className="font-semibold text-gray-800">LifeSync</span>
          </div>
          <p className="text-center text-gray-600">
            © 2025 LifeSync. Built as a portfolio project.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;