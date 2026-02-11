import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface MinesweeperGameProps {
  onExit: () => void;
}

type SizeMode = 'small' | 'medium' | 'big';

const MODES: Record<SizeMode, { rows: number; cols: number; mines: number; label: string }> = {
  small: { rows: 9, cols: 9, mines: 10, label: 'Small' },
  medium: { rows: 16, cols: 16, mines: 40, label: 'Medium' },
  big: { rows: 16, cols: 30, mines: 99, label: 'Big' },
};

// Mark: 0 = none, 1 = flag, 2 = question mark. Right-click cycles 0 → 1 → 2 → 0.
export const MinesweeperGame: React.FC<MinesweeperGameProps> = ({ onExit }) => {
  const [mode, setMode] = useState<SizeMode>('small');
  const { rows, cols, mines: mineCount } = MODES[mode];

  const createBoard = () => {
    const grid: boolean[][] = Array(rows).fill(null).map(() => Array(cols).fill(false));
    let placed = 0;
    while (placed < mineCount) {
      const r = Math.floor(Math.random() * rows);
      const c = Math.floor(Math.random() * cols);
      if (!grid[r][c]) { grid[r][c] = true; placed++; }
    }
    return grid;
  };

  const [mines, setMines] = useState<boolean[][]>(() => createBoard());
  const [revealed, setRevealed] = useState<boolean[][]>(() => Array(rows).fill(null).map(() => Array(cols).fill(false)));
  const [mark, setMark] = useState<number[][]>(() => Array(rows).fill(null).map(() => Array(cols).fill(0)));
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [triggeredMineCoords, setTriggeredMineCoords] = useState<[number, number][]>([]);

  // Re-init state when mode/dimensions change
  useEffect(() => {
    const newMines = createBoard();
    setMines(newMines);
    setRevealed(Array(rows).fill(null).map(() => Array(cols).fill(false)));
    setMark(Array(rows).fill(null).map(() => Array(cols).fill(0)));
    setGameOver(false);
    setWon(false);
    setTriggeredMineCoords([]);
  }, [mode, rows, cols, mineCount]);

  const countAdjacent = (m: boolean[][], r: number, c: number) => {
    const rows = m.length;
    const cols = m[0]?.length ?? 0;
    let n = 0;
    for (let dr = -1; dr <= 1; dr++)
      for (let dc = -1; dc <= 1; dc++) {
        const nr = r + dr, nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && m[nr]?.[nc]) n++;
      }
    return n;
  };

  const reveal = (r: number, c: number) => {
    const stateRows = revealed.length;
    const stateCols = revealed[0]?.length ?? 0;
    if (gameOver || r >= stateRows || r < 0 || c >= stateCols || c < 0) return;
    // Don't reveal on flag or question mark
    if (mark[r]?.[c] === 1 || mark[r]?.[c] === 2) return;
    if (revealed[r]?.[c]) {
      // Chord: click on revealed number when adjacent flags === number
      const n = countAdjacent(mines, r, c);
      if (n === 0) return;
      let flagCount = 0;
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          const rr = r + dr, cc = c + dc;
          if (rr >= 0 && rr < stateRows && cc >= 0 && cc < stateCols && mark[rr]?.[cc] === 1) flagCount++;
        }
      if (flagCount !== n) return;
      // Reveal all adjacent unrevealed, non-flagged cells
      const next = revealed.map(row => [...row]);
      let hitMine = false;
      const flood = (rr: number, cc: number) => {
        if (rr < 0 || rr >= stateRows || cc < 0 || cc >= stateCols || next[rr]?.[cc] || mines[rr]?.[cc]) return;
        next[rr][cc] = true;
        if (countAdjacent(mines, rr, cc) === 0) {
          for (let ddr = -1; ddr <= 1; ddr++)
            for (let ddc = -1; ddc <= 1; ddc++) flood(rr + ddr, cc + ddc);
        }
      };
      const chordTriggered: [number, number][] = [];
      chord: for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          const rr = r + dr, cc = c + dc;
          if (rr < 0 || rr >= stateRows || cc < 0 || cc >= stateCols) continue;
          if (next[rr][cc] || mark[rr]?.[cc] === 1 || mark[rr]?.[cc] === 2) continue;
          if (mines[rr]?.[cc]) {
            chordTriggered.push([rr, cc]);
            hitMine = true;
          } else {
            flood(rr, cc);
          }
        }
      if (hitMine) {
        setTriggeredMineCoords(chordTriggered);
        setGameOver(true);
        setRevealed(prev => prev.map((row, rr) => row.map((cell, cc) => cell || !!mines[rr]?.[cc])));
      } else {
        setRevealed(next);
        const safe = stateRows * stateCols - mineCount;
        if (next.flat().filter(Boolean).length >= safe) {
          setWon(true);
          setRevealed(next.map((row, rr) => row.map((cell, cc) => cell || !!mines[rr]?.[cc])));
        }
      }
      return;
    }
    if (mines[r]?.[c]) {
      setTriggeredMineCoords([[r, c]]);
      setGameOver(true);
      setRevealed(prev => prev.map((row, rr) => row.map((cell, cc) => cell || !!mines[rr]?.[cc])));
      return;
    }
    const next = revealed.map(row => [...row]);
    const flood = (rr: number, cc: number) => {
      if (rr < 0 || rr >= stateRows || cc < 0 || cc >= stateCols || next[rr]?.[cc] || mines[rr]?.[cc]) return;
      next[rr][cc] = true;
      if (countAdjacent(mines, rr, cc) === 0) {
        for (let dr = -1; dr <= 1; dr++)
          for (let dc = -1; dc <= 1; dc++) flood(rr + dr, cc + dc);
      }
    };
    flood(r, c);
    setRevealed(next);
    const safe = stateRows * stateCols - mineCount;
    const rev = next.flat().filter(Boolean).length;
    if (rev >= safe) {
      setWon(true);
      const allRevealed = next.map((row, rr) => row.map((cell, cc) => cell || !!mines[rr]?.[cc]));
      setRevealed(allRevealed);
    }
  };

  const cycleRightClick = (e: React.MouseEvent, r: number, c: number) => {
    e.preventDefault();
    if (gameOver || revealed[r]?.[c]) return;
    setMark(prev => {
      if (r < 0 || r >= prev.length || c < 0 || c >= (prev[0]?.length ?? 0)) return prev;
      const n = prev.map(row => [...row]);
      n[r][c] = (n[r][c] + 1) % 3; // 0 → 1 → 2 → 0
      return n;
    });
  };

  const reset = () => {
    setMines(createBoard());
    setRevealed(Array(rows).fill(null).map(() => Array(cols).fill(false)));
    setMark(Array(rows).fill(null).map(() => Array(cols).fill(0)));
    setGameOver(false);
    setWon(false);
    setTriggeredMineCoords([]);
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

  const cellSize = 'w-8 h-8 text-xs';

  const gamePanel = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 dark:bg-black/60 p-4" onClick={(e) => e.target === e.currentTarget && onExit()}>
      <div className="text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-300 dark:border-zinc-700 overflow-hidden flex flex-col max-h-[90vh] max-w-[95vw]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700 shrink-0">
          <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Minesweeper</span>
          <div className="flex items-center gap-1 flex-wrap justify-end">
            <div className="flex rounded overflow-hidden border border-zinc-300 dark:border-zinc-600">
              {(Object.keys(MODES) as SizeMode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`px-2 py-1 text-xs ${mode === m ? 'bg-primary dark:bg-blue-600 text-white' : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-600'}`}
                >
                  {MODES[m].label}
                </button>
              ))}
            </div>
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
        <div className="p-3 overflow-auto">
          <div className="text-center text-xs text-zinc-500 dark:text-zinc-400 mb-2">
            {gameOver ? <span className="text-red-500 font-medium">Game Over</span> : won ? <span className="text-green-500 font-medium">You Win!</span> : `${rows}×${cols}, ${mineCount} mines`}
          </div>
          <div className="inline-grid gap-0.5 w-fit mx-auto bg-zinc-200 dark:bg-zinc-800 p-1 rounded" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
            {Array.from({ length: rows * cols }, (_, i) => {
              const r = Math.floor(i / cols), c = i % cols;
              const rev = revealed[r]?.[c] ?? false;
              const isMine = mines[r]?.[c] ?? false;
              const isTriggered = triggeredMineCoords.some(([rr, cc]) => rr === r && cc === c);
              const markState = mark[r]?.[c] ?? 0;
              const n = countAdjacent(mines, r, c);
              const flag = markState === 1;
              const question = markState === 2;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => reveal(r, c)}
                  onContextMenu={(e) => cycleRightClick(e, r, c)}
                  className={`${cellSize} rounded font-bold select-none flex items-center justify-center ${
                    rev
                      ? isMine
                        ? isTriggered
                          ? 'bg-red-500 text-white'
                          : 'bg-zinc-400 dark:bg-zinc-900 text-zinc-100'
                        : 'bg-zinc-300 dark:bg-zinc-600 text-zinc-900 dark:text-zinc-100'
                      : flag
                        ? 'bg-amber-400 dark:bg-amber-600 text-zinc-900'
                        : question
                          ? 'bg-zinc-200 dark:bg-zinc-600 text-zinc-600 dark:text-zinc-300'
                          : 'bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 text-transparent'
                  }`}
                >
                  {rev ? (isMine ? '💣' : n || '') : flag ? '🚩' : question ? '?' : ''}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(gamePanel, document.body);
};
