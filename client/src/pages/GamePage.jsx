import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/Navbar';
import MonopolyBoard from '../components/MonopolyBoard';
import { updateUserStats } from '../services/mockFirebase';

const GamePage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [gameId, setGameId] = useState(`game-${Date.now()}`);
  const [gameStarted, setGameStarted] = useState(false);
  const [players, setPlayers] = useState([]);
  const [gameState, setGameState] = useState(null);
  
  useEffect(() => {
    // Initialize a new game
    if (!gameStarted) {
      initializeGame();
    }
  }, [gameStarted]);
  
  const initializeGame = () => {
    // For now, we're just creating a simple 2-player game with the current user and an AI
    const newPlayers = [
      {
        id: 1,
        name: currentUser?.displayName || 'You',
        isCurrentUser: true,
        position: 0,
        money: 1500,
        properties: [],
        color: 'red'
      },
      {
        id: 2,
        name: 'Computer',
        isAI: true,
        position: 0,
        money: 1500,
        properties: [],
        color: 'blue'
      }
    ];
    
    setPlayers(newPlayers);
    setGameState({
      id: gameId,
      currentPlayer: 0,
      status: 'active',
      startedAt: new Date().toISOString()
    });
    
    setGameStarted(true);
  };
  
  const handlePlayerAction = (action) => {
    console.log('Player action:', action);
    // Here you would implement the game logic based on player actions
    // This is where you'd integrate with your backend
  };
  
  const endGame = (winner) => {
    // Update game state
    setGameState({
      ...gameState,
      status: 'ended',
      winner: winner,
      endedAt: new Date().toISOString()
    });
    
    // Update user stats
    if (currentUser) {
      const userWon = winner.isCurrentUser;
      updateUserStats(currentUser.uid, {
        gamesPlayed: (currentUser.stats?.gamesPlayed || 0) + 1,
        wins: (currentUser.stats?.wins || 0) + (userWon ? 1 : 0),
        losses: (currentUser.stats?.losses || 0) + (userWon ? 0 : 1)
      });
    }
  };
  
  const exitGame = () => {
    navigate('/home');
  };
  
  return (
    <div className="min-h-screen bg-blue-50">
      <Navbar />
      
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Game #{gameId}</h1>
          <button
            onClick={exitGame}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Exit Game
          </button>
        </div>
        
        {gameStarted ? (
          <div>
            <MonopolyBoard 
              gameState={gameState} 
              onPlayerAction={handlePlayerAction} 
            />
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-lg">Loading game...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamePage;