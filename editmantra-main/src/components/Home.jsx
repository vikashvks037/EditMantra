import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';

function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      navigate('/login'); // Redirect to login if not logged in
    }
  }, [navigate]);

  const handleRedirect = (path) => {
    if (isLoggedIn) {
      navigate(path);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 via-blue-100 to-blue-200 min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-6 mt-10">
        <p className="text-lg sm:text-xl text-center text-gray-500 mb-20 md:px-0 font-semibold">
          Unlock the potential of your coding skills with our online code compiler. Write, compile, and run code instantly while collaborating with peers in real time. Whether you’re learning or building projects, our platform offers a streamlined, interactive, and gamified experience.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Real-Time Collaboration Card */}
          <div 
            onClick={() => handleRedirect('/RealTimeCollaboration')} 
            className="bg-white p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform cursor-pointer hover:shadow-xl flex flex-col items-center text-center">
            <img src="/Home-1.jpg" alt="Real-Time Collaboration" className="w-24 h-24 rounded-full border-4 border-purple-400 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-800">Collaborative Coding</h3>
            <p className="text-gray-600 mt-2">Join with multiple user</p>
          </div>

          {/* Gamification Card */}
          <div 
            onClick={() => handleRedirect('/Gamification')} 
            className="bg-white p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform cursor-pointer hover:shadow-xl flex flex-col items-center text-center">
            <img src="/Gamification.jpg" alt="Coding Questions" className="w-24 h-24 rounded-full border-4 border-blue-400 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-800">Coding Questions</h3>
            <p className="text-gray-600 mt-2">Solve problems and Improve Skills</p>
          </div>

          {/* MCQ Questions Card */}
          <div 
            onClick={() => handleRedirect('/game')} 
            className="bg-white p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform cursor-pointer hover:shadow-xl flex flex-col items-center text-center">
            <img src="/Learning.jpg" alt="MCQ" className="w-24 h-24 rounded-full border-4 border-gray-500 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-800"> Quiz</h3>
            <p className="text-gray-600 mt-2">Test your knowledge with fun</p>
          </div>

          {/* Learning Resources Card */}
          <div 
            onClick={() => handleRedirect('/LearningResources')} 
            className="bg-white p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform cursor-pointer hover:shadow-xl flex flex-col items-center text-center">
            <img src="/library-img.jpg" alt="Search Books" className="w-24 h-24 rounded-full border-4 border-red-400 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-800">Search Books</h3>
            <p className="text-gray-600 mt-2">Find books for Improve yourself.</p>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Home;
