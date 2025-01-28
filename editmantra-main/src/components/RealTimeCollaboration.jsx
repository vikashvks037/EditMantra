import { useState } from 'react';
import Footer from './Footer';
import Header from './Header';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function RealTimeCollaboration() {
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const createNewRoom = (e) => {
    e.preventDefault();
    const id = uuidv4();
    setRoomId(id);
    toast.success('Room created successfully');
  };

  // Function to verify the username from both User and Admin schemas
  const verifyUsername = async () => {
    try {
      const response = await axios.post('http://localhost:5000/verify-username', { username });

      if (response.data.message === 'Username verified successfully') {
        return true; // Username exists in User or Admin schema
      } else {
        toast.error('Username not found. Please register first.');
        return false; // Username doesn't exist
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error verifying username');
      return false; // If there is an error, assume username doesn't exist
    }
  };

  const joinRoom = async (e) => {
    e.preventDefault();

    if (!roomId || !username) {
      toast.error('Please enter both room ID and username');
      return;
    }

    // Verify if the username exists in the database
    const isUsernameValid = await verifyUsername();
    if (!isUsernameValid) {
      // If username verification fails, prevent join
      return;
    }

    // Proceed with navigation to the room if username is valid
    navigate(`/RealTimeCollaboration/Editor/${roomId}`, { state: { username } });
  };

  return (
    <div
      className="flex flex-col min-h-screen"
      style={{
        backgroundImage: 'url(/RealTime.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Header />
      <main className="flex flex-col items-center justify-center flex-grow bg-opacity-50">
        <div className="bg-transparent rounded-lg p-8 w-full max-w-xl">
          <h2 className="text-3xl font-bold text-cyan-400 text-center mb-10 underline">
            Paste Invitation Room ID
          </h2>
          <form onSubmit={joinRoom} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="ROOM ID"
                required
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                onChange={(e) => setRoomId(e.target.value)}
                value={roomId}
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="USERNAME"
                required
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-cyan-400 text-white py-3 rounded-lg hover:bg-purple-500 transition duration-300 disabled:opacity-50"
            >
              Join
            </button>
          </form>
          <div className="mt-6 text-center text-white font-bold text-xl">
            Don't have an invitation?&nbsp;
            <button
              onClick={createNewRoom}
              className="text-cyan-300 font-semibold hover:underline bg-transparent border-none p-0 cursor-pointer"
            >
              Create New Room
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default RealTimeCollaboration;
