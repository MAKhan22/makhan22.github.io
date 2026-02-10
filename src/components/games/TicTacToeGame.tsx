import React, { useCallback, useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface TicTacToeGameProps {
  onExit: () => void;
}

// Minimax for TTT - returns best move index for O (AI)
function getBestMove(squares: Array<'X' | 'O' | null>): number {
  const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
  const empty = (i: number) => !squares[i];

  for (const [a, b, c] of lines) {
    const arr = [squares[a], squares[b], squares[c]];
    const os = arr.filter(x => x === 'O').length;
    const xs = arr.filter(x => x === 'X').length;
    if (os === 2 && xs === 0) {
      if (!squares[a]) return a; if (!squares[b]) return b; if (!squares[c]) return c;
    }
    if (xs === 2 && os === 0) {
      if (!squares[a]) return a; if (!squares[b]) return b; if (!squares[c]) return c;
    }
  }
  if (empty(4)) return 4;
  const order = [0, 2, 6, 8, 1, 3, 5, 7];
  for (const i of order) if (empty(i)) return i;
  return 0;
}

export const TicTacToeGame: React.FC<TicTacToeGameProps> = ({ onExit }) => {
  const [board, setBoard] = useState<Array<'X' | 'O' | null>>(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [isAI, setIsAI] = useState(true);
  const [winner, setWinner] = useState<'X' | 'O' | 'Tie' | null>(null);
  const [winsX, setWinsX] = useState(0);
  const [winsO, setWinsO] = useState(0);
  const [winsTie, setWinsTie] = useState(0);

  const calculateWinner = (squares: Array<'X' | 'O' | null>): 'X' | 'O' | 'Tie' | null => {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
        return squares[a] as 'X' | 'O';
    }
    if (squares.every(s => s !== null)) return 'Tie';
    return null;
  };

  const applyAIMove = useCallback((currentBoard: Array<'X' | 'O' | null>) => {
    const move = getBestMove(currentBoard);
    const next = [...currentBoard];
    next[move] = 'O';
    setBoard(next);
    setIsXNext(true);
    const w = calculateWinner(next);
    if (w) {
      setWinner(w);
      if (w === 'X') setWinsX(x => x + 1);
      else if (w === 'O') setWinsO(o => o + 1);
      else setWinsTie(t => t + 1);
    }
  }, []);

  const handleMove = (index: number) => {
    if (board[index] || winner) return;
    if (isAI && !isXNext) return;

    const newBoard = [...board];
    const wasXTurn = isXNext;
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);

    const gameWinner = calculateWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      if (gameWinner === 'X') setWinsX(x => x + 1);
      else if (gameWinner === 'O') setWinsO(o => o + 1);
      else setWinsTie(t => t + 1);
      return;
    }
    if (newBoard.every(s => s !== null)) {
      setWinner('Tie');
      setWinsTie(t => t + 1);
      return;
    }
    if (isAI && wasXTurn) {
      setTimeout(() => applyAIMove(newBoard), 300);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
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
      <div className="w-[min(260px,90%)] bg-white dark:bg-zinc-900 rounded-lg shadow-xl border border-zinc-300 dark:border-zinc-700 overflow-hidden">
        {/* Title bar */}
        <div className="flex items-center justify-between px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
          <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Tic-Tac-Toe</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                setIsAI(!isAI);
                resetGame();
              }}
              className="text-xs px-2 py-1 rounded bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-300 dark:hover:bg-zinc-600"
            >
              {isAI ? 'P1 vs P2' : 'Player vs AI'}
            </button>
            <button
              type="button"
              onClick={resetGame}
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
        {/* Body */}
        <div className="p-3">
          <div className="flex justify-center gap-3 text-xs text-zinc-600 dark:text-zinc-400 mb-2">
            <span className="text-blue-600 dark:text-blue-400 font-semibold">X: {winsX}</span>
            <span className="text-yellow-500">Ties: {winsTie}</span>
            <span className="text-green-600 dark:text-green-400 font-semibold">O: {winsO}</span>
          </div>
          <div className="text-center text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-2">
            {winner === 'Tie' ? <span className="text-yellow-500">Tie!</span> : winner ? (
              <span className={winner === 'X' ? 'text-blue-500' : 'text-green-500'}>{winner} wins!</span>
            ) : isAI ? (
              isXNext ? 'Your turn (X)' : 'AI thinking...'
            ) : (
              isXNext ? "Player X's turn" : "Player O's turn"
            )}
          </div>
          <div className="grid grid-cols-3 gap-0.5 w-fit mx-auto bg-zinc-200 dark:bg-zinc-800 p-1 rounded">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => {
              const value = board[index];
              const disabled = !!value || !!winner || (isAI && !isXNext);
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleMove(index)}
                  disabled={disabled}
                  className={`w-14 h-14 rounded text-2xl font-bold transition-colors ${
                    value === 'X' ? 'text-blue-600 bg-blue-100 dark:bg-blue-900/40 dark:text-blue-400' : value === 'O' ? 'text-green-600 bg-green-100 dark:bg-green-900/40 dark:text-green-400' : 'bg-zinc-100 dark:bg-zinc-700'
                  } ${disabled ? 'cursor-default' : 'cursor-pointer hover:bg-zinc-300 dark:hover:bg-zinc-600'}`}
                >
                  {value ?? ''}
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500 text-center mt-2">Ctrl+C to exit</p>
        </div>
      </div>
    </div>
  );
};
