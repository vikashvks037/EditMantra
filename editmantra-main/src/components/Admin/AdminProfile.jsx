import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import Footer from '../Footer';

const AdminProfile = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [adminInfo, setAdminInfo] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const response = await fetch('https://editmantra-backend.onrender.com/api/admin/profile');
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

  const handleAuth = () => {
    if (isLoggedIn) {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      navigate('/');
    } else {
      navigate('/');
    }
  };

  // 🎨 **Skeleton Loader** while fetching data
  if (!adminInfo && !error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <AdminHeader />
        <div className="flex-grow container mx-auto p-6 flex justify-center items-center">
          <div className="animate-pulse bg-gray-300 w-72 h-48 rounded-lg shadow-lg"></div>
        </div>
        <Footer />
      </div>
    );
  }

  // 🛑 **Error Message UI**
  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-100">
        <AdminHeader />
        <div className="flex-grow container mx-auto flex flex-col justify-center items-center p-6">
          <h1 className="text-3xl font-bold text-red-600">Error: {error}</h1>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-6 py-2 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition"
          >
            Retry
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      <AdminHeader />

      {/* 🌟 Profile Card */}
      <div className="flex-grow container mx-auto p-6 flex justify-center">
        <div className="bg-white shadow-2xl rounded-lg p-8 w-full max-w-md border-t-4 border-blue-500">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-blue-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
              {adminInfo.name.charAt(0)}
            </div>
            <h2 className="text-2xl font-bold text-blue-700 mt-4">{adminInfo.name}</h2>
          </div>

          {/* 📌 Admin Info List */}
          <div className="mt-6 space-y-4 text-gray-700">
            <div className="flex items-center">
              <span className="font-bold w-32">Email:</span>
              <span className="font-semibold">{adminInfo.email}</span>
            </div>
            <div className="flex items-center">
              <span className="font-bold w-32">Username:</span>
              <span className="font-semibold">{adminInfo.username}</span>
            </div>
          </div>

          {/* 🚀 Logout Button */}
          <div className="mt-20 flex justify-center">
            <button
              onClick={handleAuth}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold rounded-full shadow-lg transform hover:scale-105 transition duration-300"
            >
              {isLoggedIn ? 'Logout' : 'Login'}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminProfile;
