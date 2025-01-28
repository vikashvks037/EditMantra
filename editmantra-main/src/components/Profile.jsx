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
        const response = await fetch('http://localhost:5000/api/user/profile', {
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
      <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="container mx-auto p-6 mt-20 text-center">
          <h1 className="text-3xl text-red-500 font-semibold">Error: {error}</h1>
        </div>
      </div>
    );
  }

  if (!userInfo) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="container mx-auto p-6 mt-20 text-center">
          <h1 className="text-3xl font-semibold text-blue-600">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-50 to-blue-100">
      <Header />
      <div className="flex justify-center items-center flex-grow">
        <div className="bg-cyan-50 shadow-xl rounded-lg max-w-4xl w-full p-8 mx-4 space-y-6">
          <h1 className="text-3xl font-semibold text-center text-indigo-600 mb-6">User Profile</h1>

          <div className="space-y-2 p-6 text-lg shadow-md rounded-lg border border-gray-200">
            {[ 
              { label: 'Name', value: userInfo.name },
              { label: 'Username', value: userInfo.username },
              { label: 'Email', value: userInfo.email },
              { label: 'Role', value: userInfo.role },
              { label: 'Stars', value: userInfo.stars },
              { label: 'Feedback', value: userInfo.feedback },
              { label: 'Review', value: userInfo.review || 'No review available' }, // Added Review field
            ].map((field, index) => (
              <div key={index} className="flex items-center">
                <span className="font-bold text-gray-900 w-36">{field.label}:</span>
                <span className="text-gray-700">{field.value}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={handleLogout}
              className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-3 px-10 rounded-full shadow-md hover:from-red-600 hover:to-pink-600 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
