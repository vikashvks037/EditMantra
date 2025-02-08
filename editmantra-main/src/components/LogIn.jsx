import { useState } from 'react';
import axios from 'axios';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [key, setKey] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    if (role === 'admin' && !key) {
      setMessage('Admin key is required');
      setIsLoading(false);
      return;
    }

    try {
      const requestData = { email, password, role, ...(role === 'admin' && { key }) };

      const response = await axios.post(
        role === 'admin' ? 'https://editmantra.onrender.com/admin-login' : 'https://editmantra.onrender.com/user-login',
        requestData
      );

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.user.role);

      setMessage('Login successful!');

      if (response.data.user.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/Home');
      }
    } catch (error) {
      setMessage(error.response ? error.response.data.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Header */}
      <header className="bg-cyan-50 py-4 px-8 flex items-center justify-between shadow-md">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 text-transparent bg-clip-text hover:from-cyan-500 hover:to-purple-500 transition duration-300 ease-in-out">EditMantra</h1>
      </header>

      {/* Main Content */}
      <div className="flex-grow flex items-center bg-blue-300 justify-center bg-cover bg-center p-3">
        
        {/* Single Card Container */}
        <div className="relative z-10 flex w-full max-w-4xl bg-white rounded-lg shadow-2xl p-8">

          {/* Left Side - Project Info */}
          <div className="w-1/2 flex flex-col justify-center p-6 bg-gray-100 rounded-l-lg">
            <h2 className="text-2xl font-bold text-blue-700 text-center mb-6">Welcome to EditMantra</h2>
            <p className="text-gray-700 text-md text-center">
              EditMantra is a platform for real-time collaborative coding and learning.
              Create a room, invite multiple users, solve quiz challenges, and improve your coding skills!
            </p>
            <ul className="list-disc pl-6 text-gray-600 mt-8 text-md">
              <li>🖥️ Live coding collaboration</li>
              <li>🏆 Quiz and coding Questions</li>
              <li>📚 Find best books for learning</li>
              <li>🔐 Secure login system</li>
            </ul>
          </div>

          {/* Right Side - Login Form */}
          <div className="w-1/2 p-4">
            <h2 className="text-3xl font-extrabold text-center text-purple-700 mb-6">Login</h2>
            <form onSubmit={handleLogin} className="space-y-6">
              
              {/* Role selection */}
              <div className="flex justify-center gap-8 text-yellow-700">
                <label className="font-semibold flex items-center">
                  <input type="radio" value="user" checked={role === 'user'} onChange={() => { setRole('user'); setKey(''); }} className="mr-2" />
                  Student
                </label>
                <label className="font-semibold flex items-center">
                  <input type="radio" value="admin" checked={role === 'admin'} onChange={() => setRole('admin')} className="mr-2" />
                  Educator
                </label>
              </div>

              {/* Email input */}
              <input type="email" placeholder="EMAIL" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400" />

              {/* Password input */}
              <input type="password" placeholder="PASSWORD" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400" />

              {/* Key input (only for Admin) */}
              {role === 'admin' && (
                <input type="text" placeholder="KEY" value={key} onChange={(e) => setKey(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400" />
              )}

              {/* Error or success message */}
              {message && (
                <p className={`text-center ${message.includes('successful') ? 'text-green-500' : 'text-red-500'}`}>
                  {message}
                </p>
              )}

              {/* Submit button */}
              <button type="submit" className="w-full bg-cyan-700 text-white p-2 font-bold rounded-lg hover:bg-cyan-900 hover:scale-105 transform transition-transform" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            {/* Signup link */}
            <div className="mt-4 text-center font-semibold text-xl">
              Don’t have an account? &nbsp;
              <a href="/signup" className="text-blue-600 underline hover:text-cyan-500">Click here</a>
            </div>
          </div>

        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;
