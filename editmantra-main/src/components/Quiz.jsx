import { useState, useEffect } from "react";
import axios from "axios";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [isAnswering, setIsAnswering] = useState(false);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/mcqquestions")
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
      const newCorrectCount = correctCount + 1;
      setCorrectCount(newCorrectCount);
      setShowCongratulations(true);

      // Show level-up message if user reaches 5 correct answers
      if (newCorrectCount % 5 === 0) {
        setShowLevelUp(true);
      }
    } else {
      setShowCongratulations(false);
      setTimeout(() => {
        setCurrentQuestionIndex(0);
      }, 1000);
    }

    setTimeout(() => {
      setMessage("");
      setSelectedOption(null);
      setIsAnswering(false);
    }, 1000);
  };

  const handleNext = () => {
    if (currentQuestionIndex + 1 >= questions.length) {
      setCurrentQuestionIndex(0);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
    setShowCongratulations(false);
    setShowLevelUp(false); // Reset level-up message when moving to the next question
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="flex flex-col w-full min-h-full">
      <div className="w-full max-w-3xl mx-auto p-6 bg-blue-100 shadow-xl flex-grow">
        {!questions.length ? (
          <p className="text-xl text-gray-700 text-center">Loading questions...</p>
        ) : (
          <div className="bg-cyan-100 p-6 mt-6 rounded-lg shadow-lg">
            {showCongratulations ? (
              <div className="text-center mt-10">
                <h2 className="text-3xl font-semibold text-green-600">
                  Congratulations!
                </h2>
                <p className="mt-4 text-lg text-gray-700">
                  You answered correctly!
                </p>

                {/* Show Level-Up Message */}
                {showLevelUp && (
                  <div className="mt-4">
                    <h2 className="text-3xl font-semibold text-purple-600">
                      🎉 Level Up! 🎉
                    </h2>
                    <p className="text-lg text-gray-700">
                      You've reached a milestone! Keep going!
                    </p>
                  </div>
                )}

                <button
                  onClick={handleNext}
                  className="mt-6 py-3 px-8 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none transition duration-300"
                >
                  Next
                </button>
              </div>
            ) : (
              <div>
                <h2 className="text-3xl font-semibold text-center mb-4 text-gray-800">
                  Question
                </h2>
                <h3 className="text-2xl font-medium text-gray-700 mb-6">
                  {currentQuestion.question}
                </h3>
                <div className="space-y-3">
                  {currentQuestion.options.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleAnswer(option)}
                      disabled={isAnswering}
                      className={`w-full py-3 px-6 rounded-lg text-white text-lg font-semibold transition-colors duration-300 ${
                        isAnswering
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600 focus:outline-none"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                {message && (
                  <p
                    className={`mt-4 text-center text-lg ${
                      message === "Correct Answer!"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
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
        )}
      </div>
    </div>
  );
};

export default Quiz;
