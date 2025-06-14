import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md border-b border-orange-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between  items-center py-3">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3">
            <img src="/esec logo.png" alt="ESEC Logo" className="h-10 w-auto" />
            <span className="text-gray-800 text-sm md:text-lg  font-semibold">
              ERODE SENGUNTHAR ENGINEERING COLLEGE
            </span>
          </Link>

          {/* Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-700 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Links */}
          <div className={`w-full md:flex md:items-center md:w-auto ${isOpen ? 'block' : 'hidden'}`}>
            <ul className="flex flex-col md:flex-row items-center md:space-x-6 mt-4 md:mt-0">
              {token ? (
                <>
                  <li>
                    <Link to="/dashboard" className="text-gray-800 hover:text-orange-500 text-sm font-medium">
                      <i className="fas fa-th-large mr-2"></i>Dashboard
                    </Link>
                  </li>
                  {(role === 'admin' || role === 'faculty') && (
                    <li>
                      <Link to="/upload" className="text-gray-800 hover:text-orange-500 text-sm font-medium">
                        <i className="fas fa-upload mr-2"></i>Upload
                      </Link>
                    </li>
                  )}
                  {role === 'admin' && (
                    <li>
                      <Link to="/role-management" className="text-gray-800 hover:text-orange-500 text-sm font-medium">
                        <i className="fas fa-user-cog mr-2"></i>Roles
                      </Link>
                    </li>
                  )}
                  <li>
                    <button
                      onClick={handleLogout}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 rounded-md text-sm font-medium transition"
                    >
                      <i className="fas fa-sign-out-alt mr-2"></i>Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" className="text-gray-800 hover:text-orange-500 text-sm font-medium">
                      <i className="fas fa-sign-in-alt mr-2"></i>Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className="text-gray-800 hover:text-orange-500 text-sm font-medium">
                      <i className="fas fa-user-plus mr-2"></i>Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
