import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Questions() {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/questions');
        setChallenges(response.data || []);
      } catch (err) {
        console.error('Error fetching challenges:', err.message);
        setError('Failed to load challenges. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  const handleCardClick = (challenge) => {
    // Navigate to /Gamification/Collaboration and pass the challenge data
    navigate('/Gamification/Collaboration', { state: { challenge } });
  };

  return (
    <div className="flex flex-col">
      {loading ? (
        <p className="text-center text-gray-500">Loading challenges...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : challenges.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {challenges.map((challenge) => (
            <div
              key={challenge._id}
              className={`flex flex-col justify-center items-center p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out
                ${challenge.difficulty === 'Easy' ? 'bg-green-300' : ''} 
                ${challenge.difficulty === 'Medium' ? 'bg-yellow-300' : ''} 
                ${challenge.difficulty === 'Hard' ? 'bg-red-300' : ''}`}
              onClick={() => handleCardClick(challenge)}
              role="button"
              tabIndex={0}
              onKeyPress={() => handleCardClick(challenge)}
              aria-label={`View details of challenge ${challenge.title}`}
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                {challenge.title}
              </h3>
              {/* <p className="text-gray-700 mb-3 text-center">{challenge.description}</p> */}
              <p className="text-lg text-black text-center">{challenge.difficulty}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No challenges available.</p>
      )}
    </div>
  );
}

export default Questions;
