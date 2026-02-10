import React, { useState, useEffect } from 'react';

interface SnakeGameProps {
  onExit: () => void;
}

export const SnakeGame: React.FC<SnakeGameProps> = ({ onExit }) => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const restart = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection({ x: 1, y: 0 });
    setGameOver(false);
    setScore(0);
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        onExit();
        return;
      }
      if (gameOver) {
        if (e.key === ' ') {
          restart();
        }
        return;
      }
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameOver, direction]);

  useEffect(() => {
    if (gameOver) return;
    const gameLoop = setInterval(() => {
      setSnake(prev => {
        const head = { x: prev[0].x + direction.x, y: prev[0].y + direction.y };
        if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20 || prev.some(seg => seg.x === head.x && seg.y === head.y)) {
          setGameOver(true);
          return prev;
        }
        const newSnake = [head, ...prev];
        if (head.x === food.x && head.y === food.y) {
          setFood({ x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) });
          setScore(s => s + 1);
          return newSnake;
        }
        return newSnake.slice(0, -1);
      });
    }, 200);

    return () => clearInterval(gameLoop);
  }, [direction, food, gameOver]);

  return (
    <div className="text-zinc-700 dark:text-zinc-300">
      <div className="mb-2">Score: {score}</div>
      <div className="mb-2 text-xs text-zinc-600 dark:text-zinc-400">
        Arrow keys to move. SPACE to restart when game over. Ctrl+C to exit.
      </div>
      {gameOver && <div className="mb-2 text-red-400">Game Over! Press SPACE to restart.</div>}
      <div className="flex flex-col gap-0 w-80 h-80 border border-zinc-700">
        {Array.from({ length: 20 }).map((_, row) => (
          <div key={row} className="flex gap-0">
            {Array.from({ length: 20 }).map((_, col) => {
              const x = col;
              const y = row;
              const isSnake = snake.some(seg => seg.x === x && seg.y === y);
              const isFood = food.x === x && food.y === y;
              return (
                <div
                  key={`${row}-${col}`}
                  className={`w-4 h-4 ${isSnake ? 'bg-green-500' : isFood ? 'bg-red-500' : 'bg-zinc-800'}`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
