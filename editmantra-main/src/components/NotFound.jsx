import React from 'react';
import Footer from './Footer';
import Header from './Header';

function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      
      <div className="flex-grow flex items-center justify-center bg-gradient-to-r from-blue-200 via-gray-200 to-blue-200">
        <h1 className="text-5xl font-extrabold text-center text-red-600 p-8">
          404 - Page Not Found
        </h1>
      </div>

      <Footer />
    </div>
  );
}

export default NotFound;
