import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../Footer';
import AdminHeader from './AdminHeader';

function Dashboard() {
  const navigate = useNavigate();

  const checkLoginStatus = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return false;
    }
    return true;
  };

  const handleRedirect = (path) => {
    if (!checkLoginStatus()) return;
    navigate(path);
  };

  return (
    <div className="bg-gradient-to-r from-indigo-100 via-blue-200 to-cyan-300 min-h-screen flex flex-col">
      <AdminHeader />
      <main className="flex-grow container mx-auto p-6">
        <h1 className="text-5xl font-extrabold text-center mt-8 mb-10 text-blue-600">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 mt-20 lg:grid-cols-4 gap-6">
          {/** Real-Time Collaboration Card */}
          <div
            onClick={() => handleRedirect('/Dashboard/AdminRealTimeCollaboration')}
            className="bg-white p-6 rounded-2xl shadow-lg hover:scale-105 transform transition-transform cursor-pointer hover:shadow-2xl flex flex-col items-center border border-blue-300">
            <img src="/Home-1.jpg" alt="Real-Time Collaboration" className="w-28 h-28 rounded-full border-4 border-purple-500 mb-4" />
            <h3 className="text-2xl font-semibold text-blue-800 mb-2 text-center">Collaborative Coding</h3>
            <p className="text-gray-700 text-center px-4">Join with multiple users</p>
          </div>

          {/** User Details Card */}
          <div
            onClick={() => handleRedirect('/Dashboard/UserManagement')}
            className="bg-white p-6 rounded-2xl shadow-lg hover:scale-105 transform transition-transform cursor-pointer hover:shadow-2xl flex flex-col items-center border border-blue-300">
            <img src="/Learning.jpg" alt="User Details" className="w-28 h-28 rounded-full border-4 border-gray-600 mb-4" />
            <h3 className="text-2xl font-semibold text-blue-800 mb-2 text-center">User Details</h3>
            <p className="text-gray-700 text-center px-4">Manage users details.</p>
          </div>

          {/** Add Question Card */}
          <div
            onClick={() => handleRedirect('/Dashboard/EditGamification')}
            className="bg-white p-6 rounded-2xl shadow-lg hover:scale-105 transform transition-transform cursor-pointer hover:shadow-2xl flex flex-col items-center border border-blue-300">
            <img src="/AddQuestions.jpg" alt="Add Question" className="w-28 h-28 rounded-full border-4 border-blue-500 mb-4" />
            <h3 className="text-2xl font-semibold text-blue-800 mb-2 text-center">Add Question</h3>
            <p className="text-gray-700 text-center px-4">Create code and quiz</p>
          </div>

          {/** View Question and Quiz Card */}
          <div
            onClick={() => handleRedirect('/Dashboard/ViewModifyQuestion')}
            className="bg-white p-6 rounded-2xl shadow-lg hover:scale-105 transform transition-transform cursor-pointer hover:shadow-2xl flex flex-col items-center border border-blue-300">
            <img src="/EditProfile.png" alt="View Question" className="w-28 h-28 rounded-full border-4 border-gray-200 mb-4" />
            <h3 className="text-2xl font-semibold text-blue-800 mb-2 text-center">View Question</h3>
            <p className="text-gray-700 text-center px-4">View code and quiz.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Dashboard;
