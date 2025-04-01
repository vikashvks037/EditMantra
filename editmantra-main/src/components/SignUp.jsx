import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";

const Signup = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      const endpoint =
        role === "admin"
          ? "https://editmantra-backend.onrender.com/signup/admin"
          : "https://editmantra-backend.onrender.com/signup/user";

      const response = await axios.post(endpoint, {
        name,
        username,
        email,
        password,
        role,
      });

      setMessage(response.data.message);
      setIsLoading(false);
      navigate("/");
    } catch (error) {
      setMessage(
        "Error creating user: " + (error.response?.data?.message || "Server error")
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-blue-300">
      {/* Header */}
      <header className="bg-cyan-50 py-2 px-8 flex items-center justify-between shadow-md">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 text-transparent bg-clip-text hover:from-cyan-500 hover:to-purple-500 transition duration-300 ease-in-out">
          EditMantra
        </h1>
      </header>

      <div className="flex-grow flex items-center justify-center p-4">
        <div className="relative z-10 bg-white rounded-lg p-5 w-full max-w-5xl flex flex-col md:flex-row shadow-2xl shadow-gray-800">
          {/* Left Side: Project Description */}
          <div className="w-full md:w-1/2 p-6 bg-gray-100 rounded-t-lg md:rounded-l-lg md:rounded-tr-none">
            <h2 className="text-2xl font-bold text-blue-700 text-center mb-6 mt-5">
              Welcome to EditMantra
            </h2>
            <ul className="list-disc pl-6 text-gray-600 mt-4 text-md">
              <li>🖥️ Live coding collaboration</li>
              <li>🏆 Quiz and coding Questions</li>
              <li>📚 Code Review Using AI</li>
              <li>🔐 Secure login system</li>
              <li>📚 Find best books for learning</li>
            </ul>
          </div>

          {/* Right Side: Signup Form */}
          <div className="w-full md:w-1/2 p-6 bg-white rounded-b-lg md:rounded-r-lg md:rounded-bl-none">
            <h2 className="text-3xl font-extrabold text-center text-purple-700 mb-6">
              Sign Up
            </h2>
            <form onSubmit={handleSignup} className="space-y-3">
              <div>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full p-2 font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 hover:scale-105 transform transition-transform cursor-pointer hover:shadow-2xl"
                >
                  <option value="user">Student</option>
                  <option value="admin">Educator</option>
                </select>
              </div>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <input
                type="email"
                placeholder="User@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <input
                type="password"
                placeholder="Password (8+ chars, uppercase & symbol required)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              />

              {message && (
                <p
                  className={`text-center ${
                    message.includes("successful") ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {message}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-cyan-700 text-white p-2 font-bold rounded-lg hover:bg-cyan-900 hover:scale-105 transform transition-transform"
                disabled={isLoading}
              >
                {isLoading ? "Signing up..." : "Signup"}
              </button>
            </form>

            <div className="mt-4 text-center font-medium text-xl">
              Already have an account? &nbsp;
              <a
                href="/"
                className="text-blue-600 font-semibold underline hover:text-cyan-500"
              >
                Click here
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Signup;
