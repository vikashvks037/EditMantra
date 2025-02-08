import React, { useState } from 'react';
import axios from 'axios';
import Footer from '../Footer';
import AdminHeader from './AdminHeader';

function EditGamification() {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmitCodingQuestion = async (e) => {
    e.preventDefault();

    // Validation for adding the question card
    if (!title || !description || !difficulty) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    // Submit card details
    try {
      await axios.post('https://editmantra-backend.onrender.com/api/questions/add', {
        title,
        description,
        difficulty,
      });
      setSuccessMessage('Coding question card added successfully!');
      setTitle('');
      setDescription('');
      setDifficulty('');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Failed to add coding question card. Please try again.');
      console.error('Error adding card:', error);
    }
  };

  const handleSubmitMCQQuestion = async (e) => {
    e.preventDefault();

    // Submit MCQ question
    const newQuestion = { question, options, correctAnswer };
    try {
      await axios.post("https://editmantra-backend.onrender.com/api/admin/add-question", newQuestion);
      alert("MCQ question added successfully");
      setQuestion("");
      setOptions(["", "", "", ""]);
      setCorrectAnswer("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 via-blue-100 to-blue-200 min-h-screen flex flex-col">
      <AdminHeader />
      <main className="flex-grow container mx-auto p-6">
        <section className="flex space-x-8">
          {/* Coding Question Card Section */}
          <div className="flex-1 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-3xl font-bold text-center mb-6 text-blue-800">Add Coding Question</h2>
            <form onSubmit={handleSubmitCodingQuestion}>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Title"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <textarea
                  placeholder="Description"
                  className="w-full h-72 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className='mb-4'>
                <select
                  className="w-full py-3 border bg-white font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option value="">Select Difficulty</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
                </div>
                <div >
                <button
                  type="submit"
                  className="w-full mb-2 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Add Coding Question
                </button>
              </div>
            </form>
            {/* Display success or error messages for coding question */}
            {successMessage && (
              <div className="text-green-600 font-semibold">{successMessage}</div>
            )}
            {errorMessage && (
              <div className="text-red-600 font-semibold">{errorMessage}</div>
            )}
          </div>

          {/* MCQ Question Section */}
          <div className="flex-1 p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-3xl font-bold text-center mb-6 text-blue-900">Add New MCQ Question</h2>
            <form onSubmit={handleSubmitMCQQuestion}>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Write Question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              {options.map((option, index) => (
                <div key={index} className="mb-4">
                  <input
                    type="text"
                    placeholder="Options"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              ))}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Correct Answer"
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                  className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full mt-1 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
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
