import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { github, logo2 } from "../../assets";
import { useToast } from "@/components/ui/toaster";

const Navbar = () => {
  const { success } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogOut = () => {
    localStorage.removeItem("token");
    success("Logged out successfully");
    navigate("/login");
    setIsMenuOpen(false);
  };

  const token = localStorage.getItem("token");
  const checkToken = token && token.length > 0;

  const isActive = (path) => location.pathname === path;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navLinks = [
    { path: "/home", label: "Home", show: checkToken },
    { path: "/profile", label: "Profile", show: checkToken },
    { path: "/create-post", label: "Create", show: checkToken },
  ];

  return (
    <nav className="fixed w-full top-0 z-50 border-b border-white/10 bg-gradient-to-b from-[#0f1020]/90 to-[#0b0d1a]/80 backdrop-blur-md shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/home" className="flex-shrink-0" onClick={closeMenu}>
            <img src={logo2} alt="Logo" className="w-14 h-14 object-contain" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map(
              (link) =>
                link.show && (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`relative px-4 py-2 rounded-md font-inter font-medium transition-all duration-300 ease-in-out group text-gray-200 hover:text-white}`}
                  >
                    {/* Active indicator - green dot */}
                    {isActive(link.path) && (
                      <span className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-md"></span>
                    )}

                    {/* Hover underline */}
                    <span className="relative">
                      {link.label}
                      <span
                        className={`absolute bottom-0 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full ${
                          isActive(link.path) ? "bg-cyan-400 w-full" : ""
                        }`}
                      ></span>
                    </span>
                  </Link>
                )
            )}

            {/* Logout Button */}
            {checkToken && (
              <button
                className="relative px-4 py-2 ml-2 text-white font-inter font-medium rounded-lg transition-all duration-300 group bg-white/10 hover:bg-white/15 ring-1 ring-white/10"
                onClick={handleLogOut}
              >
                <span className="relative">
                  Logout
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-400 transition-all duration-300 group-hover:w-full"></span>
                </span>
              </button>
            )}

            {/* Auth Buttons when logged out */}
            {!checkToken && (
              <div className="flex items-center gap-2 ml-2">
                <Link
                  to="/login"
                  className="ml-2 flex items-center border border-white/10 text-gray-200 px-3 py-2 rounded-md font-medium transition-all duration-300 hover:text-white hover:border-white/20 hover:shadow-md group"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="mx-3 flex items-center border border-white/10 text-gray-200 px-3 py-2 rounded-md font-medium transition-all duration-300 hover:text-white hover:border-white/20 hover:shadow-md group"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* GitHub Link */}
            <Link
              to="https://github.com/AmanChandra1c/AI_Morph"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 flex items-center border border-white/10 text-gray-200 px-3 py-2 rounded-md font-medium transition-all duration-300 hover:text-white hover:border-white/20 hover:shadow-md group"
            >
              <img
                src={github}
                alt="GitHub"
                className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:scale-110"
              />
              <span className="hidden lg:inline">GitHub</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* GitHub Link - Mobile */}
            <Link
              to="https://github.com/AmanChandra1c/AI_Morph"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center border border-white/10 text-gray-200 p-2 rounded-md transition-all duration-300 hover:text-white hover:border-white/20"
            >
              <img src={github} alt="GitHub" className="w-5 h-5" />
            </Link>

            {/* Hamburger Menu Button */}
            {checkToken ? (
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-200 hover:text-white transition-all duration-300"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <div className="relative w-6 h-6">
                  <span
                    className={`absolute block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${
                      isMenuOpen ? "rotate-45 translate-y-2" : "translate-y-1"
                    }`}
                  ></span>
                  <span
                    className={`absolute block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${
                      isMenuOpen ? "opacity-0" : "translate-y-2.5"
                    }`}
                  ></span>
                  <span
                    className={`absolute block h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${
                      isMenuOpen ? "-rotate-45 translate-y-2" : "translate-y-4"
                    }`}
                  ></span>
                </div>
              </button>
            ) : (
              <div className="flex items-center gap-1">
                <Link
                  to="/login"
                  className=" flex items-center border border-white/10 text-gray-200 px-3 py-2 rounded-md font-medium transition-all duration-300 hover:text-white hover:border-white/20 hover:shadow-md group"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex items-center border border-white/10 text-gray-200 px-3 py-2 rounded-md font-medium transition-all duration-300 hover:text-white hover:border-white/20 hover:shadow-md group"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMenu}
        ></div>
      )}

      {/* Mobile menu panel */}
      <div
        className={`fixed top-0 right-0 h-screen w-full shadow-2xl transform transition-transform duration-300 ease-in-out z-50 md:hidden backdrop-blur-sm bg-gradient-to-b from-[#0f1020] to-[#0b0d1a] ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile menu header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <img src={logo2} alt="Logo" className="w-10 h-10 object-contain" />
            <button
              onClick={closeMenu}
              className="p-2 rounded-md text-gray-300 hover:text-white transition-colors duration-200"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Mobile menu items */}
          <div className="flex-1 px-4 py-6 space-y-3">
            {navLinks.map(
              (link) =>
                link.show && (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={closeMenu}
                    className={`relative flex items-center px-4 py-3 rounded-lg font-inter font-medium transition-all duration-300 ${
                      isActive(link.path)
                        ? "bg-white/10 text-white ring-1 ring-white/10"
                        : "text-gray-200 hover:text-white"
                    }`}
                  >
                    {/* Active indicator - green dot */}
                    {isActive(link.path) && (
                      <span className="absolute left-1 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                    )}
                    <span className={`${isActive(link.path) ? "ml-4" : ""}`}>
                      {link.label}
                    </span>
                  </Link>
                )
            )}

            {/* Mobile Logout Button */}
            {checkToken && (
              <button
                onClick={handleLogOut}
                className="w-full flex items-center px-4 py-3 text-gray-200 font-inter font-medium rounded-lg transition-all duration-300 hover:bg-red-600/80 hover:shadow-lg"
              >
                Logout
              </button>
            )}

            {/* Mobile Auth Buttons when logged out */}
            {!checkToken && (
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="w-full flex items-center justify-center px-4 py-3 rounded-lg bg-cyan-500 text-white font-medium shadow-lg shadow-cyan-500/20"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="w-full flex items-center justify-center px-4 py-3 rounded-lg bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-500/20"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu footer */}
          <div className="p-4 border-t border-gray-200">
            <Link
              to="https://github.com/AmanChandra1c/AI_Morph"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="flex items-center justify-center w-full px-4 py-3 border-2 border-gray-700 text-gray-700 rounded-lg font-medium transition-all duration-300 hover:border-gray-900"
            >
              <img src={github} alt="GitHub" className="w-5 h-5 mr-2" />
              View on GitHub
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
