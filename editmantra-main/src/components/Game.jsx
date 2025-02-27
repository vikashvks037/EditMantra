import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Quiz from '../components/Quiz';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Gamification = () => {
  const [showQuestions, setShowQuestions] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [chartData, setChartData] = useState([]);
  const [lastPoints, setLastPoints] = useState(null); // Store last points

  const handleStartQuiz = () => {
    setShowQuestions(true);
    setCurrentQuestion(1);
    setChartData([]);
    setLastPoints(null);
  };

  const generatePoints = () => {
    let newPoints;
    if (lastPoints === null) {
      // First question, generate a random score between 1 and 10
      newPoints = Math.floor(Math.random() * 10) + 1;
    } else {
      // Keep new points within ±3 of last points
      const minPoints = Math.max(1, lastPoints - 3);
      const maxPoints = Math.min(10, lastPoints + 3);
      newPoints = Math.floor(Math.random() * (maxPoints - minPoints + 1)) + minPoints;
    }
    setLastPoints(newPoints); // Store last points
    return newPoints;
  };

  const handleNextQuestion = () => {
    const earnedPoints = generatePoints(); // Generate points with controlled variation
    setChartData((prevData) => [
      ...prevData,
      { day: `Q${currentQuestion}`, points: earnedPoints },
    ]);

    setCurrentQuestion((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-700">
      <Header />
      <div className="flex-grow flex flex-col justify-center items-center text-white text-center p-6">
        
        {!showQuestions && (
          <div>
            <h1 className="text-4xl font-bold mb-4">Gamify Your Learning Experience 🎯</h1>
            <p className="text-lg max-w-3xl mb-8">
              Challenge yourself with interactive quizzes and improve your knowledge with fun!
            </p>

            <Link
              onClick={handleStartQuiz}
              className="bg-white text-blue-600 px-6 py-3 rounded-full text-xl font-semibold hover:bg-blue-200 hover:scale-105 transition-transform duration-300 animate-pulse shadow-lg"
            >
              Click to Start Quiz →
            </Link>
          </div>
        )}

        {showQuestions && (
          <div className="w-full flex flex-col md:flex-row gap-6 mt-6">
            {/* Questions Section */}
            <div className="w-full md:w-1/2 bg-white p-6 shadow-2xl rounded-lg text-black">
              <Quiz onNextQuestion={handleNextQuestion} questionNumber={currentQuestion} />
            </div>

            {/* Chart Section */}
            <div className="w-full md:w-1/2 bg-white p-6 shadow-2xl rounded-lg border-t-4 border-green-500">
              <h2 className="text-xl font-semibold text-center text-green-700 mb-4">
                Quiz Points Trend
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="points" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Gamification;
