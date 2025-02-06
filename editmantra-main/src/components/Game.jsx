import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Quiz from '../components/Quiz';

const Gamification = () => {
  const [showQuestions, setShowQuestions] = useState(false);
  
  const handleClick = () => {
    setShowQuestions(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700">
      <Header />
      <div className="flex-grow flex flex-col justify-center items-center text-white text-center p-6">
        
        {/* Hide title, description & button after click */}
        {!showQuestions && (
          <>
            <h1 className="text-4xl font-bold mb-4">Gamify Your Learning Experience 🎯</h1>
            <p className="text-lg max-w-3xl mb-8">
              Challenge yourself with interactive quizzes and improve your knowledge with fun !
            </p>

            <Link
              onClick={handleClick}
              className="bg-white text-blue-600 px-6 py-3 rounded-full text-xl font-semibold hover:bg-blue-200 hover:scale-105 transition-transform duration-300 animate-pulse shadow-lg"
            >
              Click to Start Quiz →
            </Link>
          </>
        )}

        {/* Questions Section */}
        <div className="w-full">
          {showQuestions && <Quiz />}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Gamification;
