import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';

function Home() {
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
    <div className="bg-gradient-to-r from-blue-50 via-blue-100 to-blue-200 min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-6 mt-8 mb-6">
        {/* Paragraph with a short intro */}
        <p className="text-lg sm:text-xl text-center text-gray-500 mb-12 px-4 md:px-0 font-semibold"> Unlock the potential of your coding skills with our online code compiler. Write, compile, and run code instantly while collaborating with peers in real time. Whether you’re learning or building projects, our platform offers a streamlined, interactive, and gamified experience.</p>
        {/* Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Learning Resources Card */}
          <div onClick={() => handleRedirect('/LearningResources')} className="bg-gradient-to-r from-indigo-300 to-purple-400 p-6 rounded-lg shadow-xl hover:scale-105 transform transition-transform cursor-pointer hover:shadow-2xl flex flex-col items-center">
            <div className="mb-6"><img src="/Learning.jpg" alt="Learning Resources" className="w-28 h-28 rounded-full border-4 border-blue-400"/>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3 text-center">Search Books for Learning</h3>
            <p className="text-gray-700 text-center font-semibold">Discover books to boost your technical skills and knowledge.</p>
          </div>
          {/* Real-Time Collaboration Card */}
          <div onClick={() => handleRedirect('/RealTimeCollaboration')} className="bg-gradient-to-r from-cyan-300 to-blue-400  p-6 rounded-lg shadow-xl hover:scale-105 transform transition-transform cursor-pointer hover:shadow-2xl flex flex-col items-center">
            <div className="mb-6"><img src="/Home-1.jpg" alt="Real-Time Collaboration" className="w-28 h-28 rounded-full border-4 border-purple-400"/>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3 text-center">Real-Time Collaboration</h3>
            <p className="text-gray-700 text-center font-semibold ">Work on coding projects together with your friends in real time.</p>
            </div>
          {/* Gamification Card */}
          <div onClick={() => handleRedirect('/Gamification')} className="bg-gradient-to-r from-teal-400 to-green-400 p-6 rounded-lg shadow-xl hover:scale-105 transform transition-transform cursor-pointer hover:shadow-2xl flex flex-col items-center" >
            <div className="mb-6"> <img src="/Gamification.jpg" alt="Gamification" className="w-28 h-28 rounded-full border-4 border-green-500" /></div>
            <h3 className="text-2xl font-semibold text-white mb-3 text-center"> Solve Questions </h3>
            <p className="text-gray-700 text-center font-semibold"> Interactive coding problems that push your skills to the next level. </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Home;



