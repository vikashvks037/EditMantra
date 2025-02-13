import React, { useState } from 'react';
import axios from 'axios';
import Footer from '../Footer';
import AdminHeader from './AdminHeader';

function EditGamification() {
  const [codingQuestion, setCodingQuestion] = useState({
    title: '',
    description: '',
    difficulty: '',
    testCases: [{ input: '', expectedOutput: '' }],
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [mcq, setMcq] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
  });

  const handleCodingChange = (e) => {
    setCodingQuestion({ ...codingQuestion, [e.target.name]: e.target.value });
  };

  const handleTestCaseChange = (index, field, value) => {
    const updatedTestCases = [...codingQuestion.testCases];
    updatedTestCases[index][field] = value;
    setCodingQuestion({ ...codingQuestion, testCases: updatedTestCases });
  };

  const addTestCase = () => {
    setCodingQuestion({
      ...codingQuestion,
      testCases: [...codingQuestion.testCases, { input: '', expectedOutput: '' }],
    });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...mcq.options];
    newOptions[index] = value;
    setMcq({ ...mcq, options: newOptions });
  };

  const handleMcqChange = (e) => {
    setMcq({ ...mcq, [e.target.name]: e.target.value });
  };

  const handleSubmitCodingQuestion = async (e) => {
    e.preventDefault();

    if (!codingQuestion.title || !codingQuestion.description || !codingQuestion.difficulty) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    if (codingQuestion.testCases.length === 0 || codingQuestion.testCases.some(tc => !tc.input || !tc.expectedOutput)) {
      setErrorMessage('Please provide at least one test case with both input and expected output.');
      return;
    }

    try {
      console.log("Sending data:", codingQuestion); // Debugging
      await axios.post('https://editmantra-backend.onrender.com/api/questions/add', codingQuestion);
      setSuccessMessage('Coding question added successfully!');
      setCodingQuestion({ title: '', description: '', difficulty: '', testCases: [{ input: '', expectedOutput: '' }] });
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Failed to add coding question. Please try again.');
      console.error('Error adding coding question:', error);
    }
  };

  const handleSubmitMCQQuestion = async (e) => {
    e.preventDefault();

    try {
      console.log("Sending MCQ data:", mcq); // Debugging
      await axios.post("https://editmantra-backend.onrender.com/api/admin/add-question", mcq);
      alert("MCQ question added successfully");
      setMcq({ question: '', options: ['', '', '', ''], correctAnswer: '' });
    } catch (err) {
      console.error('Error adding MCQ question:', err);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 via-blue-100 to-blue-200 min-h-screen flex flex-col">
      <AdminHeader />
      <main className="flex-grow container mx-auto p-6">
        <section className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-8">
          
          {/* Coding Question Section */}
          <div className="flex-1 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-3xl font-bold text-center mb-6 text-blue-800">Add Coding Question</h2>
            <form onSubmit={handleSubmitCodingQuestion}>
              <input
                type="text"
                name="title"
                placeholder="Title"
                className="w-full p-3 border rounded-lg mb-4"
                value={codingQuestion.title}
                onChange={handleCodingChange}
              />
              <textarea
                name="description"
                placeholder="Description"
                className="w-full h-40 p-3 border rounded-lg mb-4"
                value={codingQuestion.description}
                onChange={handleCodingChange}
              />
              <select
                name="difficulty"
                className="w-full py-3 border rounded-lg mb-4"
                value={codingQuestion.difficulty}
                onChange={handleCodingChange}
              >
                <option value="">Select Difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>

              {/* Test Cases Section */}
              <h3 className="text-xl font-semibold text-center mb-2">Test Cases</h3>
              {codingQuestion.testCases.map((testCase, index) => (
                <div key={index} className="mb-4">
                  <input
                    type="text"
                    placeholder="Input"
                    className="w-full p-2 border rounded-lg mb-2"
                    value={testCase.input}
                    onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Expected Output"
                    className="w-full p-2 border rounded-lg"
                    value={testCase.expectedOutput}
                    onChange={(e) => handleTestCaseChange(index, 'expectedOutput', e.target.value)}
                  />
                </div>
              ))}
              <button type="button" className="w-full py-2 bg-gray-500 text-white rounded-lg mb-4" onClick={addTestCase}>
                Add Test Case
              </button>

              <button type="submit" className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
                Add Coding Question
              </button>

              {successMessage && <p className="text-green-600 text-center mt-2">{successMessage}</p>}
              {errorMessage && <p className="text-red-600 text-center mt-2">{errorMessage}</p>}
            </form>
          </div>

          {/* MCQ Question Section */}
          <div className="flex-1 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-3xl font-bold text-center mb-6 text-blue-900">Add New MCQ Question</h2>
            <form onSubmit={handleSubmitMCQQuestion}>
              <input
                type="text"
                name="question"
                placeholder="Write Question"
                value={mcq.question}
                onChange={handleMcqChange}
                className="w-full p-3 border rounded-lg mb-4"
              />
              {mcq.options.map((option, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="w-full p-3 border rounded-lg mb-4"
                />
              ))}
              <input
                type="text"
                name="correctAnswer"
                placeholder="Correct Answer"
                value={mcq.correctAnswer}
                onChange={handleMcqChange}
                className="w-full p-3 border rounded-lg mb-4"
              />
              <button type="submit" className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
                Add MCQ Question
              </button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default EditGamification;
