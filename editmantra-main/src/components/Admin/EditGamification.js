import React, { useState } from 'react';
import axios from 'axios';
import Footer from '../Footer';
import AdminHeader from './AdminHeader';
import Questions from '../Questions';

function EditGamification() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || !difficulty) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/questions/add', {
        title,
        description,
        difficulty,
      });

      setSuccessMessage('Question added successfully!');
      setTitle('');
      setDescription('');
      setDifficulty('');
      setErrorMessage('');
    } catch (error) {
      setErrorMessage('Failed to add question. Please try again.');
      console.error('Error adding question:', error);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 via-blue-100 to-blue-200 min-h-screen flex flex-col">
      <AdminHeader />
      <main className="flex-grow container mx-auto p-6">
        {/* Gamification Cards Section */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-4 text-blue-800">Add Question</h2>
          
          <div className="mb-6 space-y-6"> {/* Added space between form elements */}
            <input
              type="text"
              placeholder="Title"
              className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              placeholder="Description"
              className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="flex flex-col sm:flex-row sm:space-x-4 w-full"> {/* Flexbox for button and select */}
              <select
                className="p-3 border border-gray-300 rounded-lg w-full sm:w-3/4 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="">Select Difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              <button
                className="bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out w-full sm:w-1/4 mt-4 sm:mt-0"
                onClick={handleSubmit}
              >
                Add Card
              </button>
            </div>
          </div>
          
          {/* Display success or error messages */}
          {successMessage && (
            <div className="text-green-600 font-semibold">{successMessage}</div>
          )}
          {errorMessage && (
            <div className="text-red-600 font-semibold">{errorMessage}</div>
          )}
          
          <div>
            <Questions />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default EditGamification;
