// App.js
import React, { useState } from 'react';
import './App.css';

const TicTacToe = () => {
  const [n, setN] = useState(3); // Board size: 3x3
  const [m, setM] = useState(3); // Win condition: 3 marks in a row
  const [board, setBoard] = useState(Array(n * n).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // Initialize the board with empty values
  const initializeBoard = () => Array(n * n).fill(null);

  // Handle start game logic
  const handleStartGame = () => {
    setBoard(initializeBoard());
    setIsXNext(true);
    setWinner(null);
    setGameStarted(true);
    setGameOver(false);
  };

  // Handle click logic
  const handleClick = (index) => {
    if (board[index] || gameOver) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);

    const currentPlayer = isXNext ? 'X' : 'O';
    const opponent = isXNext ? 'O' : 'X';

    const playerWin = checkWin(newBoard, currentPlayer);
    const opponentCanStillWin = canStillWin(newBoard, opponent);

    if (playerWin) {
      setWinner(currentPlayer);
      setGameOver(true);
    } else if (!opponentCanStillWin) {
      setWinner(currentPlayer); // opponent cannot win anymore
      setGameOver(true);
    } else if (newBoard.every((cell) => cell !== null)) {
      setWinner('Draw');
      setGameOver(true);
    } else {
      setIsXNext(!isXNext);
    }
  };

  // Check if a player has won
  const checkWin = (squares, player) => {
    const directions = [
      [0, 1],  // Horizontal
      [1, 0],  // Vertical
      [1, 1],  // Diagonal (Top-Left to Bottom-Right)
      [1, -1], // Diagonal (Top-Right to Bottom-Left)
    ];

    for (let row = 0; row < n; row++) {
      for (let col = 0; col < n; col++) {
        for (let [dx, dy] of directions) {
          let count = 0;
          for (let k = 0; k < m; k++) {
            const r = row + k * dx;
            const c = col + k * dy;
            if (r >= 0 && r < n && c >= 0 && c < n && squares[r * n + c] === player) {
              count++;
            } else {
              break;
            }
          }
          if (count === m) return true;
        }
      }
    }
    return false;
  };

  // Check if the opponent can still win
  const canStillWin = (squares, player) => {
    const directions = [
      [0, 1],  // Horizontal
      [1, 0],  // Vertical
      [1, 1],  // Diagonal (Top-Left to Bottom-Right)
      [1, -1], // Diagonal (Top-Right to Bottom-Left)
    ];

    for (let row = 0; row < n; row++) {
      for (let col = 0; col < n; col++) {
        for (let [dx, dy] of directions) {
          let count = 0;
          let empty = 0;
          for (let k = 0; k < m; k++) {
            const r = row + k * dx;
            const c = col + k * dy;
            if (r >= 0 && r < n && c >= 0 && c < n) {
              const value = squares[r * n + c];
              if (value === player) {
                count++;
              } else if (value === null) {
                empty++;
              } else {
                break;
              }
            } else {
              break;
            }
          }
          if (count + empty >= m) return true;
        }
      }
    }
    return false;
  };

  // Handle reset of the game
  const handleReset = () => {
    setBoard(initializeBoard());
    setIsXNext(true);
    setWinner(null);
    setGameStarted(false);
    setGameOver(false);
  };

  return (
    <div className="game-container">
      <div className="game">
        <h1>Tic-Tac-Toe</h1>

        {!gameStarted && (
          <div className="settings">
            <div>
              <label>Board Size (N): </label>
              <input
                type="number"
                value={n}
                onChange={(e) => setN(Math.max(3, parseInt(e.target.value) || 3))}
                min="3"
              />
            </div>
            <div>
              <label>Win Length (M): </label>
              <input
                type="number"
                value={m}
                onChange={(e) => setM(Math.max(3, parseInt(e.target.value) || 3))}
                min="3"
              />
            </div>
            <button onClick={handleStartGame}>Start Game</button>
          </div>
        )}

        {gameStarted && (
          <>
            <div className="status">
              {winner
                ? winner === 'Draw'
                  ? "It's a Draw!"
                  : `Winner: ${winner}`
                : `Next Player: ${isXNext ? 'X' : 'O'}`}
            </div>

            <div
              className="board"
              style={{
                gridTemplateColumns: `repeat(${n}, minmax(40px, 1fr))`,
                gridTemplateRows: `repeat(${n}, minmax(40px, 1fr))`,
              }}
            >
              {board.map((square, index) => (
                <button
                  key={index}
                  className="square"
                  onClick={() => handleClick(index)}
                >
                  {square}
                </button>
              ))}
            </div>

            <button className="reset" onClick={handleReset}>
              Reset Game
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TicTacToe;
