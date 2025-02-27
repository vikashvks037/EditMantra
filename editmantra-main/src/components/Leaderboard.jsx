import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("https://editmantra-backend.onrender.com/api/users");
        if (!response.ok) throw new Error("Failed to fetch leaderboard data");

        const data = await response.json();
        setLeaderboardData(data);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-300">
      <Header />
      <div className="flex flex-col items-center flex-grow p-6">

        {/* Leaderboard Table */}
        <div className="w-full max-w-4xl bg-white p-6 shadow-2xl rounded-lg border-t-4 border-yellow-500">
        <h1 className="text-3xl font-semibold text-center text-blue-700 mb-4">Leaderboard</h1>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-700">
                <th className="p-3 text-left">Rank</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-center">Stars</th>
                <th className="p-3 text-center">Points</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((user, index) => (
                <tr key={index} className="border-t text-gray-700">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{user.name}</td>
                  <td className="p-3 text-center">{user.stars} ⭐</td>
                  <td className="p-3 text-center">{user.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Leaderboard;
