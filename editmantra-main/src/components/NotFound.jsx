import React from 'react';
import Footer from './Footer';

function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
    <header className="bg-cyan-50 py-2 px-8 flex items-center justify-between shadow-md">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 text-transparent bg-clip-text hover:from-cyan-500 hover:to-purple-500 transition duration-300 ease-in-out">EditMantra</h1>
      </header>
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
