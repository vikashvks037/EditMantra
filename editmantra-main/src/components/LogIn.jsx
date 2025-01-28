import { useState } from 'react';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:5000/login', { 
        email,
        password,
        role,
      });

      // Log the response for debugging
      console.log(response.data);

      // Store the token and role in localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.user.role);

      setMessage('Login successful!');

      // Log role and exact comparison
      console.log(`User role: ${response.data.user.role}`);
      console.log(`Expected role: admin`);

      // Compare the role value explicitly
      if (response.data.user.role === 'admin') {
        console.log('Redirecting to /dashboard');
        navigate('/dashboard');
      } else if (response.data.user.role === 'user') {
        console.log('Redirecting to /');
        navigate('/');
      } else {
        console.log('Redirecting to default page');
        navigate('/');  // Redirect to a default page for other roles if any
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
      <div
        className="relative flex-grow flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: 'url(/LogIn.jpg)' }}
      >
        <div className="relative z-10 rounded-lg p-8 w-full max-w-xl ml-auto mr-20 bg--500 shadow-2xl shadow-gray-800 ">
          <h2 className="text-2xl font-bold text-orange-600 text-center mb-6 ">LOGIN</h2>
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Role selection */}
            <div className="flex justify-center gap-8 mb-6 text-yellow-700 ">
              <label className=" font-semibold flex items-center ">
                <input
                  type="radio"
                  value="user"
                  checked={role === 'user'}
                  onChange={() => setRole('user')}
                  className="mr-2"
                />
                Student
              </label>
              <label className=" font-semibold flex items-center ">
                <input
                  type="radio"
                  value="admin"
                  checked={role === 'admin'}
                  onChange={() => setRole('admin')}
                  className="mr-2"
                />
                Educator
              </label>
            </div>

            {/* Email input */}
            <div>
              <input
                type="email"
                placeholder="EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 hover:scale-105 transform transition-transform hover:shadow-2xl flex flex-col items-center"
              />
            </div>

            {/* Password input */}
            <div>
              <input
                type="password"
                placeholder="PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 hover:scale-105 transform transition-transform hover:shadow-2xl flex flex-col items-center"
              />
            </div>

            {/* Error or success message */}
            {message && (
              <p
                className={`text-center ${message.includes('successful') ? 'text-green-200' : 'text-red-300'}`}
              >
                {message}
              </p>
            )}

            {/* Submit button */}
            <button
              type="submit"
              className="w-full bg-orange-400 text-white p-2 font-bold rounded-lg hover:bg-cyan-400 text-xl duration-300 disabled:opacity-50 hover:scale-105 transform transition-transform cursor-pointer hover:shadow-2xl flex flex-col items-center"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-4 text-center font-bold text-xl">
            Don’t have an account ? &nbsp;
            <a href="/signup" className="text-orange-600 underline hover:text-cyan-500 hover:scale-105 transform transition-transform cursor-pointer hover:shadow-2xl flex flex-col items-center">
              Click here
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
