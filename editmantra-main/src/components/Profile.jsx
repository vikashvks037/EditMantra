import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Profile = () => {
  const [userInfo, setUserInfo] = useState(null); // To store the user data
  const [error, setError] = useState(null); // To store error messages
  const navigate = useNavigate();

  // Fetch user info when the component mounts
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch('https://editmantra-backend.onrender.com/api/user/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assuming JWT for authorization
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user info');
        }

        const data = await response.json();
        setUserInfo(data); // Store the fetched user data in state
      } catch (error) {
        setError(error.message); // Set error if fetch fails
      }
    };

    fetchUserInfo();
  }, []); // Run only on component mount

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token to log out
    navigate('/login'); // Redirect to login page
  };

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-r from-indigo-100 to-purple-200">
        <div className="container mx-auto p-6 mt-20 text-center">
          <h1 className="text-3xl text-red-600 font-semibold">Error: {error}</h1>
        </div>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-r from-indigo-100 to-purple-200">
        <div className="container mx-auto p-6 mt-20 text-center">
          <h1 className="text-3xl font-semibold text-purple-600">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-blue-300">
      <Header />
      <div className="flex justify-center items-start flex-grow p-6">
        <div className="flex w-full max-w-6xl space-x-6">
          {/* Left Side: User Profile */}
          <div className="bg-cyan-500 shadow-lg rounded-lg w-1/3 p-6 space-y-4">
            <h1 className="text-4xl font-extrabold text-center text-purple-900 mb-6">Profile Details</h1>

            <div className="space-y-4 p-4 text-lg shadow-md rounded-lg border-2 border-blue-300">
              {[ 
                { label: 'Name', value: userInfo.name },
                { label: 'Username', value: userInfo.username },
                { label: 'Email', value: userInfo.email },
                { label: 'Role', value: userInfo.role },
                { label: 'Stars', value: userInfo.stars },
                { label: 'Feedback', value: userInfo.feedback },
                { label: 'Review', value: userInfo.review || 'No review available' }, // Added Review field
              ].map((field, index) => (
                <div key={index} className="flex items-center justify-between text-gray-800">
                  <span className="font-bold text-lg">{field.label}:</span>
                  <span className="text-gray-600">{field.value}</span>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-800 to-pink-700 text-white font-bold py-3 px-10 rounded-full shadow-lg hover:from-red-600 hover:to-pink-700 transition duration-300 ease-in-out transform hover:scale-105"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Right Side: Additional Fake Information */}
          <div className="flex-1 bg-blue-400 shadow-lg rounded-lg p-8 space-y-6">
            <h2 className="text-3xl text-purple-800 font-semibold mb-4">Prize Leaderboard</h2>
            <div className="space-y-3 text-lg font-medium text-gray-700">
              <div className="flex justify-between">
                <span>1st Place</span>
                <span>$50</span>
              </div>
              <div className="flex justify-between">
                <span>2nd Place</span>
                <span>$30</span>
              </div>
              <div className="flex justify-between">
                <span>3rd Place</span>
                <span>$10</span>
              </div>
            </div>

            <h2 className="text-3xl text-purple-800 font-semibold mb-4">More Information</h2>
            <div className="space-y-4 text-lg font-medium text-gray-700">
              <div className="flex justify-between">
                <span>Completed Challenges</span>
                <span>10</span>
              </div>
              <div className="flex justify-between">
                <span>Pending Challenges</span>
                <span>2</span>
              </div>
              <div className="flex justify-between">
                <span>Achievements</span>
                <span>1</span>
              </div>
              <div className="flex justify-between">
                <span>Rank</span>
                <span>Silver</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
