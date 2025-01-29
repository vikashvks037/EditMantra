import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../Footer';
import AdminHeader from './AdminHeader';

function Dashboard() {
  const navigate = useNavigate();

  // Check if the user is logged in (i.e., if there's a token in localStorage)
  const checkLoginStatus = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login'); // Redirect to login page if not logged in
      return false; // User is not logged in
    }
    return true; // User is logged in
  };

  // Redirect to the specified path if the user is logged in, otherwise go to login page
  const handleRedirect = (path) => {
    if (!checkLoginStatus()) {
      return; // If not logged in, stop execution here
    }
    navigate(path); // Redirect to the desired path
  };

  return (
    <div className="bg-gradient-to-r from-indigo-100 via-blue-200 to-cyan-300 min-h-screen flex flex-col">
      <AdminHeader />
      <main className="flex-grow container mx-auto p-6">
        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-5xl font-extrabold text-center mt-8 mb-12 tracking-tight bg-blue-500 text-transparent bg-clip-text">
          Admin
        </h1>

        {/* Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Real-Time Collaboration Card */}
          <div
            onClick={() => handleRedirect('/Dashboard/AdminRealTimeCollaboration')}
            className="bg-gradient-to-r from-indigo-300 to-purple-400 p-6 rounded-lg shadow-xl hover:scale-105 transform transition-transform cursor-pointer hover:shadow-2xl flex flex-col items-center">
            <div className="mb-6">
              <img
                src="/Home-1.jpg"
                alt="Real-Time Collaboration"
                className="w-28 h-28 rounded-full border-4 border-purple-500"
              />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3 text-center leading-tight">Real-Time Collaboration</h3>
            <p className="text-gray-600 text-center font-medium text-1x1">Work on coding projects together with your friends in real time.</p>
          </div>

          {/* User Details Card */}
          <div
            onClick={() => handleRedirect('/Dashboard/UserManagement')}
            className="bg-gradient-to-r from-cyan-400 to-blue-400  p-6 rounded-lg shadow-xl hover:scale-105 transform transition-transform cursor-pointer hover:shadow-2xl flex flex-col items-center">
            <div className="mb-6">
              <img
                src="/Learning.jpg"
                alt="Learning Resources"
                className="w-28 h-28 rounded-full border-4 border-cyan-600"
              />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3 text-center leading-tight">User Details</h3>
            <p className="text-gray-600 text-center font-medium text-1x1">Information of user activity and Update or Delete user.</p>
          </div>

          {/* Add Question Card */}
          <div
            onClick={() => handleRedirect('/Dashboard/EditGamification')}
            className="bg-gradient-to-r from-teal-400 to-green-400 p-6 rounded-lg shadow-xl hover:scale-105 transform transition-transform cursor-pointer hover:shadow-2xl flex flex-col items-center">
            <div className="mb-6">
              <img
                src="/AddQuestions.jpg"
                alt="EditGamification"
                className="w-28 h-28 rounded-full border-4 border-green-500"
              />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3 text-center leading-tight">Add Question</h3>
            <p className="text-gray-600 text-center font-medium text-1x1">Create interactive coding problems that push your skills to the next level.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Dashboard;
