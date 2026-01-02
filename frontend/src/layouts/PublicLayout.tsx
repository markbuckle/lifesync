import React, { useEffect, useState } from 'react';
import { Outlet, Link } from 'react-router-dom';

const PublicLayout: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkBackground, setIsDarkBackground] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 0);

       // Calculate hero section height dynamically
      const heroSection = document.querySelector('section'); // First section element
      const heroHeight = heroSection?.offsetHeight || window.innerHeight;
      
      setIsDarkBackground(scrollY <= heroHeight - 100); // Subtract 100px for smoother transition
    };

    handleScroll(); // Check on mount
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll); // Recalculate on resize

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav 
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-400 ease-in-out
          ${isScrolled 
            ? 'backdrop-blur-[40px] bg-white/5 shadow-sm' 
            : 'bg-white'
          }
        `}
      >
        <div className={`
          mx-auto px-4 sm:px-6 lg:px-8
          transition-all duration-400 ease-in-out
          ${isScrolled ? 'max-w-7xl rounded-xl' : 'max-w-7xl'}
        `}>
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <img src="/logo.svg" alt="LifeSync Logo" className="h-8 w-auto" />
                <span className="text-2xl font-bold text-primary font-architects [transform:scaleY(1.1)] mt-0.5">
                  LifeSync
                </span>
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/features" 
              className={`transition-colors ${
                isScrolled && isDarkBackground 
                  ? 'text-white hover:text-gray-200' 
                  : 'text-gray-700 hover:text-primary'
              }`}
            >
              Features
            </Link>
            <Link 
              to="/pricing" 
              className={`transition-colors ${
                isScrolled && isDarkBackground 
                  ? 'text-white hover:text-gray-200' 
                  : 'text-gray-700 hover:text-primary'
              }`}
            >
              Pricing
            </Link>
            <Link 
              to="/login" 
              className="bg-primary text-white px-6 py-2.5 rounded-full hover:bg-primary-dark transition-colors font-medium"
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
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img src="/logo.svg" alt="LifeSync Logo" className="h-6 w-auto" />
            <span className="font-semibold text-gray-800 font-architects">LifeSync</span>
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