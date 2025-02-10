  import React, { useState, useEffect } from 'react';
  import { useNavigate } from 'react-router-dom';
  import Header from './Header';
  import Footer from './Footer';
  
  const Profile = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
  
    useEffect(() => {
      const fetchUserInfo = async () => {
        try {
          const response = await fetch('https://editmantra-backend.onrender.com/api/user/profile', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });
  
          if (!response.ok) {
            throw new Error('Failed to fetch user info');
          }
  
          const data = await response.json();
          setUserInfo(data);
        } catch (error) {
          setError(error.message);
        }
      };
  
      fetchUserInfo();
    }, []);
  
    const handleLogout = () => {
      localStorage.removeItem('token');
      navigate('/');
    };
  
    if (error) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-red-100">
          <h1 className="text-2xl text-red-600 font-semibold">{error}</h1>
        </div>
      );
    }
  
    if (!userInfo) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-blue-50">
          <div className="flex flex-col items-center">
            <div className="animate-spin h-10 w-10 border-t-4 border-blue-600 rounded-full"></div>
            <h1 className="text-xl font-semibold text-blue-600 mt-4">Fetching Profile...</h1>
          </div>
        </div>
      );
    }
  
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-200">
        <Header />
        <div className="flex justify-center items-center flex-grow p-6">
          <div className="bg-white shadow-2xl rounded-lg p-3 w-full max-w-md border-t-4 border-blue-500">
            <h1 className="text-3xl font-bold text-center text-indigo-700 mb-2">User Profile</h1>
            <div className="space-y-4 bg-gray-50 p-4 shadow rounded-lg">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto rounded-full bg-blue-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                {userInfo.name.charAt(0)}
              </div>
            </div>
              {[
                { label: 'Stars', value: userInfo.stars },
                { label: 'Feedback', value: userInfo.feedback },
                { label: 'Review', value: userInfo.review || 'No review available' },
              ].map((field, index) => (
                <div key={index} className="flex justify-between border-b pb-2">
                  <span className="font-semibold text-gray-700">{field.label}:</span>
                  <span className="text-gray-600">{field.value}</span>
                </div>
              ))}
            </div>
  
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleLogout}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-full shadow-md hover:scale-105 transition-transform duration-300"
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
  