import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null); // Updated state variable

  const isActive = (path) => location.pathname.split("?")[0] === path;

  // Fetch user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await fetch("https://editmantra-backend.onrender.com/api/user/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user info");
        }

        const data = await response.json();
        setUserInfo(data);
      } catch (error) {
        console.error("Failed to fetch user info", error);
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header className="w-full p-4 bg-cyan-50 shadow-md flex justify-between items-center">
      <Link
        to="/Home"
        className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 text-transparent bg-clip-text hover:from-cyan-500 hover:to-purple-500 transition duration-300 ease-in-out"
      >
        EditMantra
      </Link>

      <button
        className="md:hidden text-cyan-900"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={32} /> : <Menu size={32} />}
      </button>

      <nav
        className={`${
          menuOpen ? "flex" : "hidden"
        } flex-col absolute top-16 left-0 w-full bg-cyan-50 shadow-md md:relative md:flex md:flex-row md:space-x-10 md:top-0 md:bg-transparent md:shadow-none md:w-auto`}
      >
        <Link
          to="/Home"
          className={`text-xl font-semibold px-4 py-2 md:px-0 ${
            isActive("/Home")
              ? "text-blue-600 underline"
              : "text-cyan-900 hover:text-blue-400 hover:underline"
          }`}
          onClick={() => setMenuOpen(false)}
        >
          Home
        </Link>
        <Link
          to="/Home/About"
          className={`text-xl font-semibold px-4 py-2 md:px-0 ${
            isActive("/Home/About")
              ? "text-blue-600 underline"
              : "text-cyan-900 hover:text-blue-400 hover:underline"
          }`}
          onClick={() => setMenuOpen(false)}
        >
          About Us
        </Link>

        {/* Profile Click Area */}
        <div
          onClick={() => {
            setMenuOpen(false);
            navigate("/Home/profile");
          }}
          className="cursor-pointer flex items-center justify-center px-4 py-2 md:py-0 md:px-0"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-lg font-semibold shadow-md hover:scale-105 transition-transform duration-200 ease-in-out">
            {userInfo?.name?.charAt(0)}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
