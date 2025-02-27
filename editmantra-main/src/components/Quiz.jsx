import { useState, useEffect } from "react";
import axios from "axios";

const Quiz = ({ onNextQuestion, questionNumber }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  useEffect(() => {
    axios
      .get("https://editmantra-backend.onrender.com/api/mcqquestions")
      .then((res) => setQuestions(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleAnswer = (option) => {
    if (!questions.length || isAnswering) return;

    setIsAnswering(true);
    setSelectedOption(option);
    setCorrectAnswer(questions[currentQuestionIndex].correctAnswer);

    const isCorrect = option === questions[currentQuestionIndex].correctAnswer;
    setMessage(isCorrect ? "Correct Answer!" : "Incorrect!");

    if (isCorrect) {
      const pointsEarned = Math.floor(Math.random() * 10) + 1; // Random points (1-10)
      setCorrectCount(correctCount + 1);
      setShowCongratulations(true);

      setTimeout(() => {
        setMessage("");
        setSelectedOption(null);
        setIsAnswering(false);
        setShowCongratulations(false);
        onNextQuestion(pointsEarned);
        setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
      }, 1000);
    } else {
      setTimeout(() => {
        setMessage("");
        setSelectedOption(null);
        setIsAnswering(false);
      }, 1000);
    }
  };

  if (!questions.length) {
    return <p className="text-xl text-gray-700 text-center">Loading questions...</p>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="flex flex-col w-full min-h-full">
      <div className="w-full max-w-3xl mx-auto rounded-lg p-6 bg-gray-500 shadow-xl flex-grow">
        <div className="bg-gray-400 p-3 rounded-lg shadow-lg">
          {showCongratulations ? (
            <div className="text-center mt-10">
              <h2 className="text-3xl font-semibold text-cyan-600">Congratulations!</h2>
              <p className="mt-4 text-lg text-gray-700">You answered correctly!</p>

              <button
                onClick={() => handleAnswer(null)}
                className="mt-6 py-3 px-8 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none transition duration-300"
              >
                Next Question →
              </button>
            </div>
          ) : (
            <div>
              <h2 className="text-4xl font-bold text-center mb-6 text-gray-800">
                Question {questionNumber}
              </h2>
              <h3 className="text-2xl font-medium text-gray-800 mb-4">{currentQuestion.question}</h3>
              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(option)}
                    disabled={isAnswering}
                    className={`w-full py-3 px-6 rounded-lg text-white text-lg font-semibold transition-colors duration-300 ${
                      isAnswering
                        ? "bg-gray-700 cursor-not-allowed"
                        : "bg-gray-900 hover:bg-cyan-800 focus:outline-none"
                    }`}
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
              {selectedOption && (
                <p className="mt-4 text-center text-lg text-gray-700">
                  {selectedOption === correctAnswer
                    ? `Correct Answer: ${correctAnswer}`
                    : `Incorrect! Correct Answer: ${correctAnswer}`}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
