import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [error, setError] = useState('');
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    setError('');
    
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      setError('Failed to log out');
      console.error(error);
    }
  };
  
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-4">
            <Link to="/home" className="text-xl font-bold">
              Monopoly Online
            </Link>
            
            <div className="hidden md:flex space-x-4">
              <Link to="/home" className="hover:text-blue-200">
                Dashboard
              </Link>
              <Link to="/game" className="hover:text-blue-200">
                Play Game
              </Link>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              Hello, {currentUser?.displayName || 'Player'}
            </div>
            <button
              onClick={handleLogout}
              className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded text-sm"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-600 text-white text-center py-2">
          {error}
        </div>
      )}
    </nav>
  );
};

export default Navbar;