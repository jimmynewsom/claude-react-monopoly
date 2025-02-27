import React from 'react';
import { useState, useEffect } from 'react';
import gameData from '../data/data.json';

const MonopolyBoard = ({ gameState, onPlayerAction }) => {
  const [boardData, setBoardData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, this would load data from the server
    // For now, we're using the local game data
    setBoardData(gameData);
    setLoading(false);
  }, []);
  
  // Sample players data (in a real app this would come from props)
  const [players, setPlayers] = useState([
    { id: 1, name: 'Player 1', position: 0, money: 1500, properties: [], color: 'red' },
    { id: 2, name: 'Player 2', position: 0, money: 1500, properties: [], color: 'blue' }
  ]);
  
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [diceRoll, setDiceRoll] = useState([]);
  
  const rollDice = () => {
    if (!boardData) return;
    
    const die1 = Math.floor(Math.random() * 6) + 1;
    const die2 = Math.floor(Math.random() * 6) + 1;
    setDiceRoll([die1, die2]);
    
    // Move player logic would go here
    const newPlayers = [...players];
    const player = newPlayers[currentPlayer];
    const oldPosition = player.position;
    const newPosition = (player.position + die1 + die2) % boardData.spaces.length;
    player.position = newPosition;
    
    // Check if passed GO
    if (newPosition < oldPosition && !(oldPosition === 39 && newPosition === 0)) {
      player.money += 200;
    }
    
    setPlayers(newPlayers);
    onPlayerAction && onPlayerAction({ type: 'MOVE', player: currentPlayer, diceRoll: [die1, die2], newPosition });
    
    // Move to next player after 1.5 seconds
    setTimeout(() => {
      setCurrentPlayer((currentPlayer + 1) % players.length);
    }, 1500);
  };
  
  if (loading) {
    return <div>Loading board data...</div>;
  }
  
  // Helper function to convert color names to Tailwind classes
  const getBgColor = (color) => {
    switch(color) {
      case 'brown': return 'bg-yellow-800';
      case 'lightblue': return 'bg-blue-200';
      case 'purple': return 'bg-purple-400';
      case 'orange': return 'bg-orange-400';
      case 'red': return 'bg-red-500';
      case 'yellow': return 'bg-yellow-300';
      case 'green': return 'bg-green-500';
      case 'blue': return 'bg-blue-700';
      default: return 'bg-gray-100';
    }
  };
  
  // Rotated board with GO in bottom left
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-4xl bg-green-100 p-4 rounded-lg">
        {/* Game board */}
        <div className="relative border-4 border-gray-800 rounded-lg overflow-hidden">
          {/* Board grid */}
          <div className="grid grid-cols-11 grid-rows-11 bg-green-200">
            {/* Bottom Row (0-10) */}
            <div className="col-start-1 row-start-11 h-16 w-16 bg-gray-200 border border-gray-400 flex items-center justify-center text-center text-xs p-1 font-bold">
              GO
            </div>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(idx => {
              const space = boardData.spaces[idx];
              const bgColor = getBgColor(space.color);
              return (
                <div key={idx} className={`col-start-${idx+1} row-start-11 h-16 border border-gray-400 ${space.type === 'card' ? 'bg-gray-200' : bgColor} flex flex-col`}>
                  {space.type === 'property' && (
                    <div className={`h-3 w-full ${bgColor} border-b border-gray-400`}></div>
                  )}
                  <div className="flex-grow p-1 text-center text-xs flex items-center justify-center">
                    {space.name}
                  </div>
                </div>
              );
            })}
            <div className="col-start-11 row-start-11 h-16 w-16 bg-gray-200 border border-gray-400 flex items-center justify-center text-center text-xs p-1 font-bold">
              JAIL
            </div>
            
            {/* Right column (11-19) */}
            {[11, 12, 13, 14, 15, 16, 17, 18, 19].map((idx, i) => {
              const space = boardData.spaces[idx];
              const bgColor = getBgColor(space.color);
              return (
                <div key={idx} className={`col-start-11 row-start-${10-i} h-16 border border-gray-400 ${space.type === 'card' ? 'bg-gray-200' : bgColor} flex flex-row`}>
                  {space.type === 'property' && (
                    <div className={`w-3 h-full ${bgColor} border-r border-gray-400`}></div>
                  )}
                  <div className="flex-grow p-1 text-center text-xs flex items-center justify-center">
                    {space.name}
                  </div>
                </div>
              );
            })}
            
            {/* Top row (20-30) */}
            <div className="col-start-11 row-start-1 h-16 w-16 bg-gray-200 border border-gray-400 flex items-center justify-center text-center text-xs p-1 font-bold">
              FREE PARKING
            </div>
            {[21, 22, 23, 24, 25, 26, 27, 28, 29].map((idx, i) => {
              const space = boardData.spaces[idx];
              const bgColor = getBgColor(space.color);
              return (
                <div key={idx} className={`col-start-${10-i} row-start-1 h-16 border border-gray-400 ${space.type === 'card' ? 'bg-gray-200' : bgColor} flex flex-col`}>
                  {space.type === 'property' && (
                    <div className={`h-3 w-full ${bgColor} border-b border-gray-400`}></div>
                  )}
                  <div className="flex-grow p-1 text-center text-xs flex items-center justify-center">
                    {space.name}
                  </div>
                </div>
              );
            })}
            <div className="col-start-1 row-start-1 h-16 w-16 bg-gray-200 border border-gray-400 flex items-center justify-center text-center text-xs p-1 font-bold">
              GO TO JAIL
            </div>
            
            {/* Left column (31-39) */}
            {[31, 32, 33, 34, 35, 36, 37, 38, 39].map((idx, i) => {
              const space = boardData.spaces[idx];
              const bgColor = getBgColor(space.color);
              return (
                <div key={idx} className={`col-start-1 row-start-${i+2} h-16 border border-gray-400 ${space.type === 'card' ? 'bg-gray-200' : bgColor} flex flex-row`}>
                  {space.type === 'property' && (
                    <div className={`w-3 h-full ${bgColor} border-r border-gray-400`}></div>
                  )}
                  <div className="flex-grow p-1 text-center text-xs flex items-center justify-center">
                    {space.name}
                  </div>
                </div>
              );
            })}
            
            {/* Center area with Monopoly text and card decks */}
            <div className="col-start-2 col-span-9 row-start-2 row-span-9 flex items-center justify-center p-4 relative">
              {/* Monopoly title - centered */}
              <h1 className="text-5xl font-bold text-green-800 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                MONOPOLY
              </h1>
              
              {/* Community Chest card deck */}
              <div className="absolute top-8 left-8 w-24 h-32 bg-blue-100 border-2 border-blue-600 rounded-md flex items-center justify-center text-center text-xs font-bold rotate-12 shadow-lg">
                COMMUNITY CHEST
              </div>
              
              {/* Chance card deck */}
              <div className="absolute bottom-8 right-8 w-24 h-32 bg-orange-100 border-2 border-orange-600 rounded-md flex items-center justify-center text-center text-xs font-bold -rotate-12 shadow-lg">
                CHANCE
              </div>
            </div>
          </div>
          
          {/* Player tokens */}
          {players.map((player, index) => {
            const position = player.position;
            let top = 0;
            let left = 0;
            
            // Calculate position based on board space
            if (position <= 10) {
              // Bottom row
              top = 'calc(100% - 16px)';
              left = `calc(${position === 0 ? 0 : position * 9.09}% + ${position === 0 ? 8 : 16}px)`;
            } else if (position <= 20) {
              // Right column
              top = `calc(${(20 - position) * 9.09}% + 16px)`;
              left = 'calc(100% - 16px)';
            } else if (position <= 30) {
              // Top row
              top = '16px';
              left = `calc(${(30 - position) * 9.09}% + 16px)`;
            } else {
              // Left column
              top = `calc(${(position - 30) * 9.09}% + 16px)`;
              left = '16px';
            }
            
            return (
              <div 
                key={player.id}
                className="absolute w-8 h-8 rounded-full flex items-center justify-center text-white font-bold"
                style={{
                  backgroundColor: player.color,
                  top,
                  left,
                  transform: `translate(${index * 5}px, ${index * 5}px)`,
                  zIndex: 10 + index,
                  border: player.id - 1 === currentPlayer ? '3px solid gold' : '1px solid black'
                }}
              >
                P{player.id}
              </div>
            );
          })}
        </div>
        
        {/* Player info and controls */}
        <div className="mt-8 flex justify-between">
          {players.map((player) => (
            <div 
              key={player.id} 
              className={`p-4 bg-white rounded-lg shadow-md ${player.id - 1 === currentPlayer ? 'ring-4 ring-yellow-400' : ''}`}
            >
              <h3 className="font-bold" style={{color: player.color}}>{player.name}</h3>
              <p>Cash: ${player.money}</p>
              <p>Position: {boardData.spaces[player.position].name}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-6 flex justify-center">
          <button 
            onClick={rollDice} 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow"
            disabled={loading}
          >
            Roll Dice
          </button>
        </div>
        
        {diceRoll.length > 0 && (
          <div className="mt-4 flex justify-center items-center space-x-4">
            <div className="w-12 h-12 bg-white rounded-lg shadow-md flex items-center justify-center text-2xl font-bold">
              {diceRoll[0]}
            </div>
            <div className="w-12 h-12 bg-white rounded-lg shadow-md flex items-center justify-center text-2xl font-bold">
              {diceRoll[1]}
            </div>
            <div className="text-lg font-bold">
              = {diceRoll[0] + diceRoll[1]}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonopolyBoard;