import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import Footer from '../Footer';

const AdminProfile = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [adminInfo, setAdminInfo] = useState(null);
  const [error, setError] = useState(null);
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
        setAdminInfo(data);
      } catch (error) {
        setError(error.message);
      }
    };
    fetchAdminInfo();
  }, []);

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
      <div className="flex-grow container mx-auto mt-4 mb-4">
        {/* Flex container for left and right sections */}
        <div className="flex space-x-8">
          {/* Admin Info Section - Left side */}
          <div className="bg-blue-400 shadow-lg rounded-lg w-1/3 p-6 space-y-4">
            <h2 className="text-4xl font-extrabold text-center text-purple-900 mb-10">
              Profile Details
            </h2>
            <div className="space-y-6 p-6 text-gray-700 text-lg shadow-md rounded-lg border border-gray-200">
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
                className="bg-gradient-to-r from-red-800 to-pink-700 text-white font-bold py-3 px-10 rounded-full shadow-md hover:from-red-600 hover:to-pink-600 transition duration-300 ease-in-out transform hover:scale-105"
              >
                {isLoggedIn ? 'Logout' : 'Login'}
              </button>
            </div>
          </div>

          {/* Educator Achievements - Right side */}
          <div className="flex-1 bg-cyan-500 shadow-lg rounded-lg p-8 space-y-6">
            <div className="space-y-6 p-6 text-gray-700 mb-6 text-lg shadow-md rounded-lg border border-gray-200">
            <h2 className="text-3xl text-purple-800 font-semibold mb-4">
              Educator Achievements
            </h2>
              <div className="flex items-center space-x-4">
                <span className="font-bold text-gray-900 w-40">Achievement 1:</span>
                <span className="text-lg italic text-gray-800">Excellence in Educational Leadership</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="font-bold text-gray-900 w-40">Achievement 2:</span>
                <span className="text-lg italic text-gray-800">Published Research on Student-Centered Learning</span>
              </div>

                {/* Additional Educator Contributions */}
                <h2 className="text-3xl text-purple-800 font-semibold mb-4">
                Educator Achievements
                </h2>
                <div className="flex items-center space-x-4">
                  <span className="font-bold text-gray-900 w-40">Contribution 1:</span>
                  <span className="text-lg italic text-gray-800">Developed a Digital Curriculum for Coding Classes</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-bold text-gray-900 w-40">Contribution 2:</span>
                  <span className="text-lg italic text-gray-800">Hosted Workshops on Effective Online Teaching</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-bold text-gray-900 w-40">Contribution 3:</span>
                  <span className="text-lg italic text-gray-800">Mentored Educators in Integrating Technology into Classrooms</span>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AdminProfile;
