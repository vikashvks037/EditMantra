import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import Footer from '../Footer';

const AdminProfile = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Assuming the user is logged in for this simple scenario
  const [adminInfo, setAdminInfo] = useState(null);  // State to store admin info
  const [error, setError] = useState(null);          // State to store error message
  const navigate = useNavigate();

  // Fetch admin info from the backend when the component is mounted
  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/profile');
        if (!response.ok) {
          throw new Error('Failed to fetch admin info');
        }
        const data = await response.json();
        setAdminInfo(data); // Set the fetched admin data to the state
      } catch (error) {
        setError(error.message); // Handle the error
      }
    };
    fetchAdminInfo();
  }, []); // Only run once on component mount

  // Handle login/logout logic
  const handleAuth = () => {
    if (isLoggedIn) {
      localStorage.removeItem('token'); // Remove token for logout
      setIsLoggedIn(false); // Update state to reflect logout
      navigate('/login'); // Redirect to login page
    } else {
      navigate('/login'); // Navigate to login page if not logged in
    }
  };

  // Show loading or error while fetching admin data
  if (!adminInfo && !error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <AdminHeader />
        <div className="flex-grow container mx-auto p-6">
          <h1 className="text-4xl font-extrabold text-center text-blue-600 mb-8">Loading Admin Info...</h1>
        </div>
        <Footer />
      </div>
    );
  }

  // If there's an error while fetching
  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <AdminHeader />
        <div className="flex-grow container mx-auto p-6">
          <h1 className="text-4xl font-extrabold text-center text-red-600 mb-8">Error: {error}</h1>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-blue-100">
      {/* Header */}
      <AdminHeader />

      {/* Main Content */}
      <div className="flex-grow container mx-auto mt-11  p-6">
        {/* Admin Info Section */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 shadow-lg rounded-lg p-8 mb-8 border border-blue-200">
          <h2 className="text-3xl font-bold underline text-blue-700 mb-6 text-center">
            Admin Information
          </h2>
          <div className="space-y-6 p-6 text-gray-700 mb-6 text-lg shadow-md rounded-lg border border-gray-200">
            <div className="flex items-center">
              <span className="font-bold text-gray-900 w-40">Name:</span>
              <span className="text-lg">{adminInfo.name}</span>
            </div>
            <div className="flex items-center">
              <span className="font-bold text-gray-900 w-40">Email:</span>
              <span className="text-lg">{adminInfo.email}</span>
            </div>
            <div className="flex items-center">
              <span className="font-bold text-gray-900 w-40">Username:</span>
              <span className="text-lg">@{adminInfo.username}</span>
            </div>
          </div>
          {/* Logout Button */}
        <div className="flex justify-center">
          <button
            onClick={handleAuth}
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-3 px-10 rounded-full shadow-md hover:from-red-600 hover:to-pink-600 transition duration-300 ease-in-out transform hover:scale-105"
          >
            {isLoggedIn ? 'Logout' : 'Login'}
          </button>
        </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AdminProfile;
