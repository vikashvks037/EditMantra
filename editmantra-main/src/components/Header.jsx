import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react'; // Icon for mobile menu

function Header() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false); // State for menu toggle

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

      {/* Hamburger Menu Button (Mobile View) */}
      <button
        className="md:hidden block text-cyan-900 mr-6 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Navigation Links */}
      <nav
        className={`absolute top-16 left-0 w-full bg-cyan-50 p-4 shadow-md md:shadow-none md:static md:w-auto md:flex md:items-center space-x-8 transition-all duration-300 ease-in-out ${
          isOpen ? 'block' : 'hidden'
        } md:block`}
      >
        <div className="md:flex md:space-x-8 flex flex-col md:flex-row text-center md:text-left">
          <Link
            to="/Home"
            className={`text-xl font-semibold ${
              isActive('/') ? 'text-blue-600 underline' : 'text-cyan-900 hover:text-blue-400 hover:underline'
            }`}
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/Home/profile"
            className={`text-xl font-semibold ${
              isActive('/profile') ? 'text-blue-600 underline' : 'text-cyan-900 hover:text-blue-400 hover:underline'
            }`}
            onClick={() => setIsOpen(false)}
          >
            Profile
          </Link>
          <Link
            to="/Home/About"
            className={`text-xl font-semibold ${
              isActive('/About') ? 'text-blue-600 underline' : 'text-cyan-900 hover:text-blue-400 hover:underline'
            }`}
            onClick={() => setIsOpen(false)}
          >
            About Us
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Header;
