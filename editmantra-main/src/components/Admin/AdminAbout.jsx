import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import Footer from '../Footer';

const AdminAbout = () => {
  const navigate = useNavigate();  // Initialize the navigate hook

  const handleGetStarted = () => {
    navigate('/Dashboard');  // Navigate to the '/admin' page
  };

  return (
    <div className='flex flex-col min-h-screen bg-gradient-to-r from-blue-400 via-blue-00 to-cyan-500'>
      <AdminHeader />
      <div className="max-w-5xl mx-auto p-8 rounded-lg mt-6">
        <h3 className="text-4xl font-bold text-blue-900 text-center tracking-wide">
          Empowering the Next Generation of Learning
        </h3>
        <p className="text-lg text-gray-800 leading-relaxed text-justify">
          Join us today and become part of a growing network of passionate learners, educators, and forward-thinking 
          innovators.We are building a dynamic,supportive community that thrives on collaboration coding, and gamified learning 
          experiences. Together, we'll break barriers, build meaningful solutions, and push the boundaries of what’s 
          possible all while having fun along the way.<strong>We believe learning should ignite curiosity and be as enjoyable as it is effective!</strong> 🚀
        </p>
      </div>
      {/* Call to Action Section */}
      <div className="max-w-3xl mx-auto text-center my-8 px-6">
        <p className="text-3xl font-semibold text-white mb-4">
          Ready to take your coding skills to the next level?
        </p>
        <p className="text-xl text-white mb-8">
          <strong>Let's code, collaborate, and create something extraordinary!</strong>
        </p>
        <button
          onClick={handleGetStarted}  // On click, navigate to the homepage
          className="bg-blue-800 text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Get Started
        </button>
      </div>

      {/* Footer at the bottom */}
      <Footer />
    </div>
  );
};

export default AdminAbout;
