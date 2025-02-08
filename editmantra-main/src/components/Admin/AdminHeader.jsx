import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // Import icons

function AdminHeader() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false); // State for menu toggle

  const isActive = (path) => location.pathname.split("?")[0] === path;

  return (
    <header className="w-full p-4 bg-cyan-50 shadow-md flex justify-between items-center">
      {/* Logo */}
      <Link
        to="/"
        className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 text-transparent bg-clip-text hover:from-cyan-500 hover:to-purple-500 transition duration-300 ease-in-out"
      >
        EditMantra
      </Link>

      {/* Hamburger Menu for Small Screens */}
      <button
        className="md:hidden text-cyan-900"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={32} /> : <Menu size={32} />}
      </button>

      {/* Navigation Links */}
      <nav
        className={`${
          menuOpen ? "flex" : "hidden"
        } flex-col absolute top-16 left-0 w-full bg-cyan-50 shadow-md md:relative md:flex md:flex-row md:space-x-10 md:top-0 md:bg-transparent md:shadow-none md:w-auto`}
      >
        <Link
          to="/Dashboard"
          className={`text-xl font-semibold px-4 py-2 md:px-0 ${
            isActive("/Dashboard")
              ? "text-blue-600 underline"
              : "text-cyan-900 hover:text-blue-400 hover:underline"
          }`}
          onClick={() => setMenuOpen(false)}
        >
          Home
        </Link>
        <Link
          to="/Dashboard/AdminProfile"
          className={`text-xl font-semibold px-4 py-2 md:px-0 ${
            isActive("/Dashboard/AdminProfile")
              ? "text-blue-600 underline"
              : "text-cyan-900 hover:text-blue-400 hover:underline"
          }`}
          onClick={() => setMenuOpen(false)}
        >
          Profile
        </Link>
        <Link
          to="/Dashboard/AdminAbout"
          className={`text-xl font-semibold px-4 py-2 md:px-0 ${
            isActive("/Dashboard/AdminAbout")
              ? "text-blue-600 underline"
              : "text-cyan-900 hover:text-blue-400 hover:underline"
          }`}
          onClick={() => setMenuOpen(false)}
        >
          About Us
        </Link>
      </nav>
    </header>
  );
}

export default AdminHeader;
