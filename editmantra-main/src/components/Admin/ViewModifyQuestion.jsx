import React, { useEffect, useState } from "react";
import AdminHeader from "./AdminHeader";
import Footer from "../Footer";
import axios from "axios";

const ViewModifyQuestion = () => {
  const [mcqQuestions, setMcqQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);

  // Backend URL
  const BACKEND_URL = "https://editmantra-backend.onrender.com";

  // Fetch MCQ and Coding Questions
  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/mcqquestions`)
      .then((res) => setMcqQuestions(res.data))
      .catch((err) => console.error("Error fetching MCQ Questions:", err));

    axios
      .get(`${BACKEND_URL}/api/questions`)
      .then((res) => setQuestions(res.data))
      .catch((err) => console.error("Error fetching Coding Questions:", err));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-300">
      {/* Header */}
      <AdminHeader />

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Coding Questions */}
          <div className="bg-blue-300 p-6 rounded-xl shadow-lg border border-gray-300">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-3">
              Coding Questions
            </h2>
            {questions.length > 0 ? (
              questions.map((q) => (
                <div
                  key={q._id}
                  className="p-4 mb-4 bg-gray-100 rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <h3 className="text-xl font-bold text-gray-700">{q.title}</h3>
                  <p className="text-gray-600 mt-2">{q.description}</p>
                  <p className="text-sm text-indigo-500 font-medium mt-1">
                    Difficulty: {q.difficulty}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No coding questions available.</p>
            )}
          </div>

          {/* MCQ Questions */}
          <div className="bg-blue-300 p-6 rounded-xl shadow-lg border border-gray-300">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 border-b pb-3">
              MCQ Questions
            </h2>
            {mcqQuestions.length > 0 ? (
              mcqQuestions.map((q) => (
                <div
                  key={q._id}
                  className="p-4 mb-4 bg-gray-100 rounded-lg shadow hover:shadow-md transition-shadow"
                >
                  <h3 className="text-xl font-bold text-gray-700">{q.question}</h3>
                  <ul className="list-disc pl-6 text-gray-600 mt-2">
                    {q.options.map((opt, index) => (
                      <li key={index}>{opt}</li>
                    ))}
                  </ul>
                  <p className="text-sm text-green-600 font-medium mt-2">
                    Answer: {q.correctAnswer}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No MCQ questions available.</p>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ViewModifyQuestion;
