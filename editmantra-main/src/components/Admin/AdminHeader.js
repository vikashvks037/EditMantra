import { Link, useLocation, useNavigate } from 'react-router-dom';

function AdminHeader() {
  const location = useLocation(); // Get the current route
  const navigate = useNavigate(); // Hook to programmatically navigate to routes

  // Define isActive function to check if the path is active
  const isActive = (path) => location.pathname.split('?')[0] === path;

  // Function to handle login button click
  const handleLogin = () => {
    navigate('/login'); // Redirect to the login page
  };

  return (
    <header className="w-full p-4 bg-cyan-50 shadow-md flex justify-between items-center">
      <Link
        to="/Dashboard"
        className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 text-transparent bg-clip-text hover:from-cyan-500 hover:to-purple-500 transition duration-300 ease-in-out"
      >
        EditMantra
      </Link>
      <nav className="hidden md:flex space-x-10 mr-6">
      <Link
          to="/Dashboard"
          className={`text-xl font-semibold ${
            isActive('/Dashboard')
              ? 'text-blue-600 underline'
              : 'text-cyan-900 hover:text-blue-400 hover:underline'
          }`}
        >
          Home
        </Link>
        <Link
          to="/Dashboard/AdminProfile"
          className={`text-xl font-semibold ${
            isActive('/Dashboard/AdminProfile')
              ? 'text-blue-600 underline'
              : 'text-cyan-900 hover:text-blue-400 hover:underline'
          }`}
        >
          Profile
        </Link>
        <Link
          to="/Dashboard/AdminAbout"
          className={`text-xl font-semibold ${
            isActive('/Dashboard/AdminAbout') ? 'text-blue-600 underline' : 'text-cyan-900 hover:text-blue-400 hover:underline'
          }`}
        >
          About Us
        </Link>
      </nav>
      <button
        onClick={handleLogin} // Call the handleLogin function on click
        className="bg-gradient-to-r from-blue-500 to-blue-500 text-white font-bold py-2 px-8 rounded-md shadow-md hover:from-blue-300 hover:to-blue-600 transition duration-300 ease-in-out transform hover:scale-105"
      >
        LogIn
      </button>
    </header>
  );
}

export default AdminHeader;
