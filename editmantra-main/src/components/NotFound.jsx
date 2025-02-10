import React from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";

function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-cyan-50 py-4 px-8 flex items-center justify-center shadow-md">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 text-transparent bg-clip-text hover:from-cyan-500 hover:to-purple-500 transition duration-300 ease-in-out">
          EditMantra 🚀
        </h1>
      </header>

      {/* 404 Content */}
      <div className="flex-grow flex flex-col items-center justify-center bg-gradient-to-r from-blue-200 via-gray-200 to-blue-200 text-center px-6">
        <span className="text-8xl">😕</span>
        <h1 className="text-6xl font-extrabold text-red-600 mt-4">
          404 - Page Not Found
        </h1>
        <p className="text-lg text-gray-700 mt-4">
          Oops! The page you're looking for doesn't exist.
        </p>

        {/* Back to Home Button */}
        <Link
          to="/Home"
          className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg font-bold rounded-lg shadow-md hover:from-purple-500 hover:to-blue-500 transform hover:scale-105 transition duration-300 ease-in-out"
        >
          🔙 Go to Homepage
        </Link>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default NotFound;
