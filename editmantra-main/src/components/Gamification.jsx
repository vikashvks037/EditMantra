import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Questions from '../components/Questions';

const Gamification = () => {
  const [showQuestions, setShowQuestions] = useState(false); // State to control visibility of Questions
  const [showLink, setShowLink] = useState(true); // State to control visibility of the link

  const handleClick = () => {
    setShowQuestions(true); // Show Questions when the link is clicked
    setShowLink(false); // Hide the link after it is clicked
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow flex flex-col justify-center items-center bg-gradient-to-b from-[#8d27ae] via-[#8d27ae] to-transparent">
        <div className="animate-blink text-center">
          {showLink && (
            <Link
              onClick={handleClick} // Trigger the state update on click
              className="text-uppercase text-3xl font-semibold tracking-widest relative flex items-center hover:scale-105 transform transition-transform cursor-pointer flex-col text-cyan-300"
            >
              <span className="animate-pulse">Click for Solve Questions →</span> {/* Blinking "Click me" */}
            </Link>
          )}
        </div>
        <div className="w-full p-3">
          {showQuestions && <Questions />} {/* Conditionally render Questions */}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Gamification;
