import { useState, useEffect } from "react";
import axios from "axios";

const Quiz = ({ onNextQuestion, questionNumber }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [isAnswering, setIsAnswering] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [score, setScore] = useState(0); // State for score

  useEffect(() => {
    axios
      .get("https://editmantra-backend.onrender.com/api/mcqquestions")
      .then((res) => setQuestions(res.data))
      .catch((err) => console.log(err));
  }, []);

  const getRandomQuestionIndex = () => {
    const randomIndex = Math.floor(Math.random() * questions.length);
    return randomIndex;
  };

  const handleAnswer = (option) => {
    if (!questions.length || isAnswering) return;

    setIsAnswering(true);

    const isCorrect = option === questions[currentQuestionIndex].correctAnswer;
    setMessage(isCorrect ? "Correct Answer!" : "Incorrect!");

    // Update score based on the answer
    if (isCorrect) {
      setScore(score + 4); // Add 4 points for correct answer
      setShowCongratulations(true);
      setTimeout(() => {
        setMessage("");
        setIsAnswering(false);
        setShowCongratulations(false);
        onNextQuestion();
        setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
      }, 1000);
    } else {
      setScore(score - 1); // Subtract 1 point for incorrect answer
      const nextQuestionIndex = getRandomQuestionIndex(); // Get a random question on wrong answer
      setTimeout(() => {
        setMessage("");
        setIsAnswering(false);
        setCurrentQuestionIndex(nextQuestionIndex); // Change to random question
      }, 1000);
    }
  };

  const handleNextQuestion = () => {
    const nextQuestionIndex = (currentQuestionIndex + 1) % questions.length;
    setCurrentQuestionIndex(nextQuestionIndex);
  };

  const handlePreviousQuestion = () => {
    const previousQuestionIndex =
      (currentQuestionIndex - 1 + questions.length) % questions.length;
    setCurrentQuestionIndex(previousQuestionIndex);
  };

  if (!questions.length) {
    return <p className="text-xl text-blue-500 text-center">Loading questions...</p>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="flex flex-col w-full min-h-full">
      {/* Score Box */}
      <div className="top-4 right-4 bg-green-500 px-4 py-2 rounded-lg shadow-lg">
        <p className="font-semibold text-lg sm:text-sm md:text-md lg:text-lg">
          Gave Correct Answer +4 Points for Wrong Answer -1 Point 
          <span className="ml-8 font-bold text-red-500">Current Score: {score}</span>
        </p>
      </div>

      <div className="w-full max-w-3xl mx-auto rounded-lg bg-blue-500 shadow-xl flex-grow">
        <div className="bg-gray-400 p-3 rounded-lg shadow-lg">
          {showCongratulations ? (
            <div className="text-center mt-10">
              <p className="mt-4 text-3xl text-blue-500">Correct Answer</p>

              <button
                onClick={() => handleAnswer(null)}
                className="mt-6 py-3 px-8 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none transition duration-300 text-sm sm:text-base md:text-lg"
              >
                Next Question →
              </button>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-medium mb-4 sm:text-lg">
                Q. {currentQuestion.question}
              </h2>

              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(option)}
                    disabled={isAnswering}
                    className={`w-full py-3 px-6 rounded-lg text-white text-lg font-semibold transition-colors duration-300 ${isAnswering ? "bg-gray-700 cursor-not-allowed" : "bg-gray-900 hover:bg-cyan-800 focus:outline-none text-sm sm:text-md md:text-lg"}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {message && (
                <p className={`mt-4 text-center text-lg ${message === "Correct Answer!" ? "text-green-600" : "text-red-600"}`}>
                  {message}
                </p>
              )}

              <div className="flex justify-between mt-6">
                <button
                  onClick={handlePreviousQuestion}
                  className="py-2 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none text-sm sm:text-base md:text-lg"
                >
                  Previous
                </button>
                <button
                  onClick={handleNextQuestion}
                  className="py-2 px-8 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none text-sm sm:text-base md:text-lg"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
