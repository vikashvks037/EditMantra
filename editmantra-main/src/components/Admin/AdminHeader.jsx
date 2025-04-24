import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

function AdminHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminInfo, setAdminInfo] = useState({ name: "A" }); // Default fallback

  const isActive = (path) => location.pathname.split("?")[0] === path;

  // Fetch admin info on component mount
  useEffect(() => {
    fetch("https://editmantra-backend.onrender.com/api/admin/profile")
      .then((res) => res.json())
      .then((data) => setAdminInfo(data))
      .catch((err) => console.error("Failed to fetch admin profile", err));
  }, []);

  return (
    <header className="w-full p-4 bg-cyan-50 shadow-md flex justify-between items-center relative z-10">
      {/* Logo */}
      <Link
        to="/Dashboard"
        className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 text-transparent bg-clip-text hover:from-cyan-500 hover:to-purple-500 transition duration-300 ease-in-out"
      >
        EditMantra
      </Link>

      {/* Hamburger Menu */}
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
        } flex-col absolute top-16 left-0 w-full bg-cyan-50 shadow-md md:relative md:flex md:flex-row md:space-x-10 md:top-0 md:bg-transparent md:shadow-none md:w-auto items-center`}
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

        {/* Profile Avatar */}
        <div
          onClick={() => {
            setMenuOpen(false);
            navigate("/Dashboard/AdminProfile");
          }}
          className="cursor-pointer flex items-center justify-center px-4 py-2 md:py-0 md:px-0"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-lg font-semibold shadow-md hover:scale-105 transition-transform duration-200 ease-in-out">
            {adminInfo.name?.charAt(0).toUpperCase() || "A"}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default AdminHeader;
