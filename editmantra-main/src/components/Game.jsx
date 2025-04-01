import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Quiz from '../components/Quiz';

const Gamification = () => {
  const [showQuestions, setShowQuestions] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(1);

  const handleStartQuiz = () => {
    setShowQuestions(true);
    setCurrentQuestion(1);
  };

  const handleNextQuestion = () => {
    setCurrentQuestion((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-blue-300">
      <Header />
      <div className="flex-grow flex flex-col justify-center items-center text-center p-6">
        
        {!showQuestions && (
          <div>
            <h1 className="text-4xl font-bold mb-4">Improve Learning with MCQ Type Questions</h1>
            <p className="text-lg max-w-3xl mb-8">
              Test your knowledge for Correct Answer +4 Points for Wrong Answer -1 Point 
            </p>

            <Link
              onClick={handleStartQuiz}
              className="bg-green-200 text-red-600 px-6 py-2 rounded-full text-xl font-semibold hover:bg-green-500 hover:scale-105 transition-transform duration-300 animate-pulse shadow-lg"
            >
              Click Here For Start Quiz →
            </Link>
          </div>
        )}

        {showQuestions && (
          <div className="flex justify-center items-center w-full h-full">
            {/* Center the Quiz box */}
            <div className="bg-green-500 shadow-2xl rounded-lg text-black">
              <Quiz onNextQuestion={handleNextQuestion} questionNumber={currentQuestion} />
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Gamification;
