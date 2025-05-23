import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Questions from '../components/Questions';

const Gamification = () => {
  const [showQuestions, setShowQuestions] = useState(false);
  
  const handleClick = () => {
    setShowQuestions(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-cyan-500 to-blue-700">
      <Header />
      
      <div className="flex-grow flex flex-col justify-center items-center text-white text-center p-8">
        
        {!showQuestions && (
          <>
            <h1 className="text-4xl font-extrabold mb-6 drop-shadow-lg">
              Boost Your Techincal Skills 
            </h1>
            <p className="text-xl max-w-3xl mb-6 leading-relaxed">
              Solve coding problems and it helps you grow and become a better developer!
            </p>
            
            <Link
              onClick={handleClick}
              className="bg-blue-300 text-red-500 px-8 py-2 rounded-full text-lg font-semibold 
              hover:bg-blue-300 hover:text-blue-900 hover:scale-105 transition-transform 
              duration-300 ease-in-out animate-pulse shadow-2xl"
            >
              Click Here For Questions →
            </Link>
          </>
        )}

        {/* Questions Section */}
        {showQuestions && (
          <div className="w-full mt-8 p-4 bg-white rounded-lg shadow-xl text-gray-900">
            <h2 className="text-3xl font-bold mb-4">Solve These Challenges </h2>
            <Questions />
          </div>
        )}

      </div>

      <Footer />
    </div>
  );
};

export default Gamification;
