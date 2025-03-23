import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, User, ChevronDown } from "lucide-react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/config";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const isActiveAIDetection = 
    location.pathname === "/face-recognition" || 
    location.pathname === "/fall-detection";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-black/80 backdrop-blur-sm" : "bg-black"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <div className="text-white text-4xl font-extrabold tracking-wide">
          <Link
            to="/"
            className="relative group transition duration-300 ease-in-out"
          >
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              CarePulse
            </span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Replace NavLink with <a> for external link */}
          <a
            href="http://localhost:3000"
            className="text-white hover:text-yellow-400 transition duration-300"
          >
            Appointments
          </a>
          <NavLink to="/blog" isActive={location.pathname === "/blog"}>
            Community
          </NavLink>
          <NavLink to="/contact-us" isActive={location.pathname === "/contact-us"}>
            FirstAid Guides
          </NavLink>
          <NavLink to="/accident-detection" isActive={location.pathname === "/accident-detection"}>
            Accident Detection
          </NavLink>
          
          {/* AI Detections Dropdown */}
          <div 
            className="relative group" 
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button 
              className={`flex items-center text-white hover:text-yellow-400 transition duration-300 ${
                isActiveAIDetection ? "text-yellow-400" : ""
              }`}
            >
              AI Detections <ChevronDown size={16} className="ml-1" />
            </button>
            
            {/* Dropdown Menu */}
            <div 
              className={`absolute left-0 mt-2 w-48 bg-black/90 shadow-lg rounded-md py-1 z-10 transition-all duration-200 ${
                dropdownOpen ? "opacity-100 visible" : "opacity-0 invisible"
              }`}
            >
              <Link 
                to="/face-recognition" 
                className="block px-4 py-2 text-sm text-white hover:text-yellow-400 hover:bg-black/70"
              >
                Face Recognition
              </Link>
              <Link 
                to="/fall-detection" 
                className="block px-4 py-2 text-sm text-white hover:text-yellow-400 hover:bg-black/70"
              >
                Fall Detection
              </Link>
            </div>
          </div>
          
          <NavLink to="/mental-health" isActive={location.pathname === "/mental-health"}>
            Mental Health Support
          </NavLink>
        </div>

        {/* Logout and Profile Button */}
        <div className="hidden md:flex items-center">
          {loading ? (
            <span className="text-white opacity-70">Loading...</span>
          ) : user ? (
            <div className="flex items-center space-x-4">
              <Link 
                to="/dashboard" 
                className="flex items-center text-white hover:text-yellow-400 transition duration-300"
              >
                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                  <User size={20} color="black" />
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="text-white bg-transparent hover:text-yellow-400 transition duration-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <NavLink to="/login" isActive={location.pathname === "/login"}>
              Login
            </NavLink>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-black text-white flex flex-col space-y-4 p-4 absolute top-16 left-0 right-0 z-40">
          <a
            href="http://localhost:3000"
            className="text-white hover:text-yellow-400 transition duration-300"
            onClick={() => setMenuOpen(false)}
          >
            Appointments
          </a>
          <NavLink to="/blog" onClick={() => setMenuOpen(false)} isActive={location.pathname === "/blog"}>
            Community
          </NavLink>
          <NavLink to="/contact-us" onClick={() => setMenuOpen(false)} isActive={location.pathname === "/contact-us"}>
            FirstAid Guides
          </NavLink>
          <NavLink to="/accident-detection" onClick={() => setMenuOpen(false)} isActive={location.pathname === "/accident-detection"}>
            Accident Detection
          </NavLink>
          
          {/* Mobile AI Detections - Displayed as separate links */}
          <div className="border-l-2 border-yellow-400/30 pl-2">
            <div className="text-yellow-400 mb-2">AI Detections</div>
            <NavLink 
              to="/face-recognition" 
              onClick={() => setMenuOpen(false)} 
              isActive={location.pathname === "/face-recognition"}
              className="block pl-2 mb-2"
            >
              Face Recognition
            </NavLink>
            <NavLink 
              to="/fall-detection" 
              onClick={() => setMenuOpen(false)} 
              isActive={location.pathname === "/fall-detection"}
              className="block pl-2"
            >
              Fall Detection
            </NavLink>
          </div>
          
          <NavLink to="/mental-health" onClick={() => setMenuOpen(false)} isActive={location.pathname === "/mental-health"}>
            Mental Health Support
          </NavLink>
          
          {loading ? (
            <span className="text-white opacity-70">Loading...</span>
          ) : user ? (
            <div className="flex flex-col space-y-4">
              <NavLink to="/dashboard" onClick={() => setMenuOpen(false)} isActive={location.pathname === "/dashboard"}>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    <User size={20} color="black" />
                  </div>
                  <span>Dashboard</span>
                </div>
              </NavLink>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="text-white hover:text-yellow-400 transition duration-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <NavLink to="/login" onClick={() => setMenuOpen(false)} isActive={location.pathname === "/login"}>
              Login
            </NavLink>
          )}
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ to, children, isActive, onClick, className }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`text-white hover:text-yellow-400 transition duration-300 ${
        isActive ? "text-yellow-400" : ""
      } ${className || ""}`}
    >
      {children}
    </Link>
  );
};

export default Header;