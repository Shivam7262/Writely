import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar: React.FC = () => {
  const { state, logout } = useAuth();
  const navigate = useNavigate();
  const { isAuthenticated, user } = state;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const authLinks = (
    <div className="flex items-center space-x-4">
      {user && (
        <span className="text-gray-300 hidden md:inline">
          Welcome, <span className="font-bold">{user.email}</span>
        </span>
      )}
      <button
        onClick={handleLogout}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition duration-300"
      >
        Logout
      </button>
    </div>
  );

  const guestLinks = (
    <div className="flex items-center space-x-4">
      <Link
        to="/login"
        className="text-white hover:text-gray-300 transition duration-300"
      >
        Login
      </Link>
      <Link
        to="/register"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-300"
      >
        Register
      </Link>
    </div>
  );

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-blue-500 text-white p-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center text-2xl font-extrabold tracking-tight hover:scale-105 transition-transform">
          <svg className="w-8 h-8 mr-2 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Knowledge Base
        </Link>
        {isAuthenticated ? authLinks : guestLinks}
      </div>
    </nav>
  );
};

export default Navbar;