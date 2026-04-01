import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-[#8B4328] text-white overflow-hidden min-h-screen flex items-center">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover opacity-20"
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-32">

          {/* Animated badge */}
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-sm font-medium text-white/90">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            AI-Powered Productivity
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
            Your life,{' '}
            <span className="text-primary-light">in sync.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
            LifeSync uses AI to unify your tasks, calendar, and projects — so you spend less time organizing and more time doing what matters.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="px-8 py-3.5 bg-primary hover:bg-primary-dark text-white font-semibold rounded-full transition-all duration-300 shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-0.5 text-base"
            >
              Get started free
            </Link>
            <Link
              to="/features"
              className="px-8 py-3.5 border border-white/30 hover:border-white/60 text-white font-semibold rounded-full transition-all duration-300 backdrop-blur-sm hover:bg-white/10 text-base"
            >
              See how it works
            </Link>
          </div>

          {/* Social proof stats */}
          <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 text-white/60 text-sm">
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-2xl font-bold text-white">10k+</span>
              <span>users synced</span>
            </div>
            <div className="hidden sm:block w-px h-8 bg-white/20"></div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-2xl font-bold text-white">98%</span>
              <span>satisfaction rate</span>
            </div>
            <div className="hidden sm:block w-px h-8 bg-white/20"></div>
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-2xl font-bold text-white">4.9★</span>
              <span>average rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-primary">
            Testing Terracotta Color
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-primary">
              <h3 className="text-xl font-semibold mb-3 text-primary">Card 1</h3>
              <p className="text-gray-600">Testing background colors</p>
            </div>

            <div className="bg-secondary p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Card 2</h3>
              <p className="text-gray-600">Testing secondary beige</p>
            </div>

            <div className="bg-primary text-white p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Card 3</h3>
              <p className="text-white opacity-90">Testing primary terracotta</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
