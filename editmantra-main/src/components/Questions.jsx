import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Questions() {
  const navigate = useNavigate();
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = await axios.get('https://editmantra-backend.onrender.com/api/questions');
        setChallenges(response.data || []);
      } catch (err) {
        console.error('Error fetching challenges:', err);
      }
    };
    fetchChallenges();
  }, []);

  const handleCardClick = (challenge) => {
    navigate('/Gamification/Collaboration', { state: { challenge } });
  };

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {challenges.map((challenge) => (
          <div
            key={challenge._id}
            className="p-6 rounded-lg shadow-lg cursor-pointer bg-blue-400 hover:scale-105 transition"
            onClick={() => handleCardClick(challenge)}
          >
            <h3 className="text-xl font-semibold">{challenge.title}</h3>
            <p>{challenge.difficulty}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Questions;
