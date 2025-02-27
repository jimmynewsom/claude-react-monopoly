import { 
    collection, 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc, 
    query, 
    where, 
    getDocs,
    serverTimestamp,
    onSnapshot 
  } from "firebase/firestore";
  import { db } from "../firebase";
  
  // Create a new game
  export const createGame = async (creatorId, creatorName) => {
    const gamesRef = collection(db, "games");
    const gameId = `game-${Date.now()}`;
    const gameRef = doc(gamesRef, gameId);
    
    const gameData = {
      id: gameId,
      createdBy: creatorId,
      players: [
        {
          id: creatorId,
          name: creatorName,
          position: 0,
          money: 1500,
          properties: [],
          color: "red",
          isActive: true
        }
      ],
      status: "waiting",
      currentPlayer: 0,
      createdAt: serverTimestamp()
    };
    
    await setDoc(gameRef, gameData);
    return gameId;
  };
  
  // Get game data
  export const getGame = async (gameId) => {
    const gameRef = doc(db, "games", gameId);
    const gameSnap = await getDoc(gameRef);
    
    if (gameSnap.exists()) {
      return gameSnap.data();
    }
    
    return null;
  };
  
  // Join a game
  export const joinGame = async (gameId, playerId, playerName) => {
    const gameRef = doc(db, "games", gameId);
    const gameDoc = await getDoc(gameRef);
    
    if (!gameDoc.exists()) {
      throw new Error("Game not found");
    }
    
    const gameData = gameDoc.data();
    
    if (gameData.status !== "waiting") {
      throw new Error("Game already started");
    }
    
    if (gameData.players.length >= 4) {
      throw new Error("Game is full");
    }
    
    // Check if player already in game
    if (gameData.players.some(player => player.id === playerId)) {
      throw new Error("You are already in this game");
    }
    
    // Define player colors
    const colors = ["red", "blue", "green", "yellow"];
    const usedColors = gameData.players.map(player => player.color);
    const availableColors = colors.filter(color => !usedColors.includes(color));
    
    // Add player to the game
    const updatedPlayers = [
      ...gameData.players, 
      {
        id: playerId,
        name: playerName,
        position: 0,
        money: 1500,
        properties: [],
        color: availableColors[0],
        isActive: true
      }
    ];
    
    await updateDoc(gameRef, {
      players: updatedPlayers
    });
    
    return gameData.id;
  };
  
  // Start game
  export const startGame = async (gameId) => {
    const gameRef = doc(db, "games", gameId);
    
    await updateDoc(gameRef, {
      status: "active",
      startedAt: serverTimestamp()
    });
    
    return true;
  };
  
  // Make a move (e.g., roll dice)
  export const makeMove = async (gameId, playerId, action) => {
    const gameRef = doc(db, "games", gameId);
    const gameDoc = await getDoc(gameRef);
    
    if (!gameDoc.exists()) {
      throw new Error("Game not found");
    }
    
    const gameData = gameDoc.data();
    
    // Simple validation to ensure it's the player's turn
    const currentPlayerIndex = gameData.currentPlayer;
    const currentPlayer = gameData.players[currentPlayerIndex];
    
    if (currentPlayer.id !== playerId) {
      throw new Error("Not your turn");
    }
    
    // Process different actions based on action.type
    switch (action.type) {
      case "ROLL_DICE":
        // Generate dice roll
        const die1 = Math.floor(Math.random() * 6) + 1;
        const die2 = Math.floor(Math.random() * 6) + 1;
        const diceTotal = die1 + die2;
        
        // Update player position
        const oldPosition = currentPlayer.position;
        const newPosition = (oldPosition + diceTotal) % 40;
        
        // Check if passed GO
        let moneyChange = 0;
        if (newPosition < oldPosition && !(oldPosition === 39 && newPosition === 0)) {
          moneyChange = 200;
        }
        
        // Update the player in the players array
        const updatedPlayers = [...gameData.players];
        updatedPlayers[currentPlayerIndex] = {
          ...currentPlayer,
          position: newPosition,
          money: currentPlayer.money + moneyChange
        };
        
        // Next player's turn
        const nextPlayerIndex = (currentPlayerIndex + 1) % gameData.players.length;
        
        // Update game state
        await updateDoc(gameRef, {
          players: updatedPlayers,
          currentPlayer: nextPlayerIndex,
          lastAction: {
            type: "ROLL_DICE",
            playerId,
            dice: [die1, die2],
            oldPosition,
            newPosition,
            passedGo: moneyChange > 0,
            timestamp: serverTimestamp()
          }
        });
        
        return {
          dice: [die1, die2],
          newPosition,
          passedGo: moneyChange > 0
        };
        
      // Add other action types as needed
      
      default:
        throw new Error("Unknown action type");
    }
  };
  
  // Subscribe to game updates
  export const subscribeToGame = (gameId, callback) => {
    const gameRef = doc(db, "games", gameId);
    
    return onSnapshot(gameRef, (doc) => {
      if (doc.exists()) {
        callback(doc.data());
      } else {
        callback(null);
      }
    });
  };
  
  // Get user's active games
  export const getUserGames = async (userId) => {
    const gamesRef = collection(db, "games");
    const q = query(
      gamesRef, 
      where("players", "array-contains", { id: userId })
    );
    
    const querySnapshot = await getDocs(q);
    const games = [];
    
    querySnapshot.forEach((doc) => {
      games.push(doc.data());
    });
    
    return games;
  };