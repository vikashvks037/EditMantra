import { Link, useLocation, useNavigate } from 'react-router-dom';

function Header() {
  const location = useLocation(); // Get the current location (route)
  const navigate = useNavigate(); // Hook to navigate programmatically

  // Function to handle logout
  const handleLogout = () => {
    // Clear authentication tokens or user session (example: from localStorage)
    localStorage.removeItem('authToken'); // Example of clearing a token
    // Redirect to the login page
    navigate('/login'); // Change the path to your login route
  };

  // Function to check if a route is active
  const isActive = (path) => location.pathname.split('?')[0] === path;

  return (
    <header className="bg-cyan-50 w-full p-4 shadow-md flex justify-between items-center">
      <div className="flex items-center ml-6">
        <Link
          to="/"
          className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 text-transparent bg-clip-text hover:from-cyan-500 hover:to-purple-500 transition duration-300 ease-in-out"
        >
          EditMantra
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="hidden md:flex space-x-8 mr-5">
      <Link
          to="/"
          className={`text-xl font-semibold ${
            isActive('/') ? 'text-blue-600 underline' : 'text-cyan-900 hover:text-blue-400 hover:underline'
          }`}
        >
          Home
        </Link>
        <Link
          to="/profile"
          className={`text-xl font-semibold ${
            isActive('/profile') ? 'text-blue-600 underline' : 'text-cyan-900 hover:text-blue-400 hover:underline'
          }`}
        >
          Profile
        </Link>
        <Link
          to="/About"
          className={`text-xl font-semibold ${
            isActive('/About') ? 'text-blue-600 underline' : 'text-cyan-900 hover:text-blue-400 hover:underline'
          }`}
        >
          About Us
        </Link>
      </nav>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="bg-gradient-to-r from-blue-500 to-blue-500 text-white font-bold py-2 px-8 rounded-md shadow-md hover:from-blue-300 hover:to-blue-600 transition duration-300 ease-in-out transform hover:scale-105"
      >
        LogIn
      </button>
    </header>
  );
}

export default Header;
