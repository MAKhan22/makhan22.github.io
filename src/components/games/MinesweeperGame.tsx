import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface MinesweeperGameProps {
  onExit: () => void;
}

// Minesweeper 5x5, 3 mines — GUI popup with clickable grid
export const MinesweeperGame: React.FC<MinesweeperGameProps> = ({ onExit }) => {
  const size = 5;
  const mineCount = 3;
  const createBoard = () => {
    const mines: boolean[][] = Array(size).fill(null).map(() => Array(size).fill(false));
    let placed = 0;
    while (placed < mineCount) {
      const r = Math.floor(Math.random() * size);
      const c = Math.floor(Math.random() * size);
      if (!mines[r][c]) { mines[r][c] = true; placed++; }
    }
    return mines;
  };

  const [mines, setMines] = useState<boolean[][]>(() => createBoard());
  const [revealed, setRevealed] = useState<boolean[][]>(Array(size).fill(null).map(() => Array(size).fill(false)));
  const [flagged, setFlagged] = useState<boolean[][]>(Array(size).fill(null).map(() => Array(size).fill(false)));
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const countAdjacent = (r: number, c: number) => {
    let n = 0;
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < size && nc >= 0 && nc < size && mines[nr][nc]) n++;
    }
    return n;
  };

  const reveal = (r: number, c: number) => {
    if (gameOver || revealed[r][c] || flagged[r][c]) return;
    if (mines[r][c]) {
      setGameOver(true);
      // Reveal all mines
      const allRevealed = Array(size).fill(null).map(() => Array(size).fill(true));
      setRevealed(allRevealed);
      return;
    }
    const next = revealed.map(row => [...row]);
    const flood = (rr: number, cc: number) => {
      if (rr < 0 || rr >= size || cc < 0 || cc >= size || next[rr][cc] || mines[rr][cc]) return;
      next[rr][cc] = true;
      if (countAdjacent(rr, cc) === 0) {
        for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) flood(rr + dr, cc + dc);
      }
    };
    flood(r, c);
    setRevealed(next);
    const safe = size * size - mineCount;
    const rev = next.flat().filter(Boolean).length;
    if (rev >= safe) {
      setWon(true);
      // Reveal all mines on win
      const allRevealed = next.map((row, rr) => row.map((cell, cc) => cell || mines[rr][cc]));
      setRevealed(allRevealed);
    }
  };

  const toggleFlag = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameOver || revealed[r][c]) return;
    setFlagged(prev => {
      const n = prev.map(row => [...row]);
      n[r][c] = !n[r][c];
      return n;
    });
  };

  const reset = () => {
    setMines(createBoard());
    setRevealed(Array(size).fill(null).map(() => Array(size).fill(false)));
    setFlagged(Array(size).fill(null).map(() => Array(size).fill(false)));
    setGameOver(false);
    setWon(false);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && (e.key === 'c' || e.key === 'C')) {
        e.preventDefault();
        onExit();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onExit]);

  return (
    <div className="text-zinc-700 dark:text-zinc-300 relative h-full min-h-0 flex items-center justify-center">
      {/* GUI window centered in the terminal panel */}
      <div className="w-[min(280px,85%)] bg-white dark:bg-zinc-900 rounded-lg shadow-xl border border-zinc-300 dark:border-zinc-700 overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center justify-between px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
          <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Minesweeper</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={reset}
              className="text-xs px-2 py-1 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-600"
            >
              New
            </button>
            <button
              type="button"
              onClick={onExit}
              className="p-1 rounded hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-600 dark:text-zinc-300"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        {/* Grid */}
        <div className="p-3">
          <div className="text-center text-xs text-zinc-500 dark:text-zinc-400 mb-2">
            {gameOver ? <span className="text-red-500 font-medium">Game Over</span> : won ? <span className="text-green-500 font-medium">You Win!</span> : '5×5, 3 mines'}
          </div>
          <div className="inline-grid grid-cols-5 gap-0.5 w-fit mx-auto bg-zinc-200 dark:bg-zinc-800 p-1 rounded">
            {Array.from({ length: size * size }, (_, i) => {
              const r = Math.floor(i / size), c = i % size;
              const rev = revealed[r][c];
              const isMine = mines[r][c];
              const flag = flagged[r][c];
              const n = countAdjacent(r, c);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => reveal(r, c)}
                  onContextMenu={(e) => toggleFlag(e, r, c)}
                  className={`w-10 h-10 rounded text-sm font-bold select-none ${
                    rev ? (isMine ? 'bg-red-500 text-white' : 'bg-zinc-300 dark:bg-zinc-600 text-zinc-900 dark:text-zinc-100') : flag ? 'bg-amber-400 dark:bg-amber-600 text-zinc-900' : 'bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 text-transparent'
                  }`}
                >
                  {rev ? (isMine ? '💣' : n || '') : flag ? '🚩' : ''}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
