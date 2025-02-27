import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';

const Home = () => {
  const { currentUser, isGuest } = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const startNewGame = () => {
    navigate('/game');
  };
  
  return (
    <div className="min-h-screen bg-blue-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Welcome, {currentUser?.displayName || 'Player'}
        </h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {isGuest && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded mb-6">
            <p className="font-bold">Playing as Guest</p>
            <p>Your game progress and stats won't be saved permanently. 
               <Link to="/signup" className="ml-2 text-blue-600 hover:underline">Create an account</Link> to track your stats and achievements.</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Game Stats Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Your Stats</h2>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-gray-600">Games Played</p>
                <p className="text-2xl font-bold text-blue-700">
                  {currentUser?.stats?.gamesPlayed || 0}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-gray-600">Wins</p>
                <p className="text-2xl font-bold text-green-700">
                  {currentUser?.stats?.wins || 0}
                </p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-gray-600">Losses</p>
                <p className="text-2xl font-bold text-red-700">
                  {currentUser?.stats?.losses || 0}
                </p>
              </div>
            </div>
            
            {isGuest && (
              <div className="mt-4 text-center text-gray-500 italic text-sm">
                Note: Guest stats are temporarily stored on this device only
              </div>
            )}
          </div>
          
          {/* Quick Start Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Start Playing</h2>
            <div className="flex flex-col space-y-4">
              <button
                onClick={startNewGame}
                className="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 flex items-center justify-center"
              >
                <span className="text-lg font-medium">Start New Game</span>
              </button>
              <button
                className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 flex items-center justify-center"
                disabled
              >
                <span className="text-lg font-medium">Join Game (Coming Soon)</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Recent Games - Empty placeholder for now */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Games</h2>
          <div className="text-center py-8 text-gray-500">
            <p>Your recent games will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;