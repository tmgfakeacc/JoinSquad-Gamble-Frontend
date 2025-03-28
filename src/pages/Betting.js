import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Betting = () => {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [betAmount, setBetAmount] = useState(0);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/games');
        setGames(response.data);
      } catch (error) {
        console.error('Failed to fetch games', error);
      }
    };
    fetchGames();
  }, []);

  const handlePlaceBet = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/bets', {
        userId: 1, // Replace with dynamic user ID
        gameId: selectedGame,
        amount: betAmount,
      });
      alert('Bet placed successfully!');
    } catch (error) {
      console.error('Failed to place bet', error);
    }
  };

  return (
    <div>
      <h1>Betting</h1>
      <div>
        <label>Select Game:</label>
        <select onChange={(e) => setSelectedGame(e.target.value)}>
          <option value="">Select a game</option>
          {games.map((game) => (
            <option key={game.id} value={game.id}>
              {game.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Bet Amount:</label>
        <input
          type="number"
          value={betAmount}
          onChange={(e) => setBetAmount(e.target.value)}
        />
      </div>
      <button onClick={handlePlaceBet}>Place Bet</button>
    </div>
  );
};

export default Betting;