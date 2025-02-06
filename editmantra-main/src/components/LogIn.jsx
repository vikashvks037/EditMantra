import { useState } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [key, setKey] = useState(''); // State for admin key
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // Admin key validation (required only for admin role)
    if (role === 'admin' && !key) {
      setMessage('Admin key is required');
      setIsLoading(false);
      return;
    }

    try {
      const requestData = {
        email,
        password,
        role,
        ...(role === 'admin' && { key }), // Include key only for admins
      };

      // Send the request to the correct API endpoint based on the role
      const response = await axios.post(
        role === 'admin' ? 'http://localhost:5000/admin-login' : 'http://localhost:5000/user-login',
        requestData
      );

      console.log(response.data); // Debugging log

      // Store user data in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.user.role);

      setMessage('Login successful!');

      // Redirect based on role
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
      <Header />
      <div className="relative flex-grow flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url(/LogIn.jpg)' }}>
        <div className="relative z-10 rounded-lg p-8 w-full max-w-xl ml-auto mr-20 bg--500 shadow-2xl shadow-gray-800">
          <h2 className="text-2xl font-bold text-orange-600 text-center mb-6">LOGIN</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            
            {/* Role selection */}
            <div className="flex justify-center gap-8 mb-6 text-yellow-700">
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
            <div>
              <input type="email" placeholder="EMAIL" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 hover:scale-105 transform transition-transform hover:shadow-2xl" />
            </div>

            {/* Password input */}
            <div>
              <input type="password" placeholder="PASSWORD" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 hover:scale-105 transform transition-transform hover:shadow-2xl" />
            </div>

            {/* Key input (only for Admin) */}
            {role === 'admin' && (
              <div>
                <input type="text" placeholder="KEY" value={key} onChange={(e) => setKey(e.target.value)} required={role === 'admin'} className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 hover:scale-105 transform transition-transform hover:shadow-2xl" />
              </div>
            )}

            {/* Error or success message */}
            {message && (
              <p className={`text-center ${message.includes('successful') ? 'text-green-200' : 'text-red-300'}`}>
                {message}
              </p>
            )}

            {/* Submit button */}
            <button type="submit" className="w-full bg-orange-400 text-white p-2 font-bold rounded-lg hover:bg-cyan-400 text-xl duration-300 disabled:opacity-50 hover:scale-105 transform transition-transform cursor-pointer hover:shadow-2xl" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Signup link */}
          <div className="mt-4 text-center font-bold text-xl">
            Don’t have an account? &nbsp;
            <a href="/signup" className="text-orange-600 underline hover:text-cyan-500">Click here</a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
