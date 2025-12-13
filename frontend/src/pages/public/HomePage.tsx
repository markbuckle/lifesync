import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div>
      {/* Hero Section - to test background colors */}
      <section className="bg-gradient-to-br from-gray-800 via-gray-600 to-[#b97e6789] text-white py-20">
      {/* <section className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white py-20"> */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Your life, automated
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Testing the colors and layout
          </p>
        </div>
      </section>

      {/* Content Section - to test cream/terracotta colors */}
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