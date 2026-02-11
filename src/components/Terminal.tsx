import React, { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SnakeGame } from './games/SnakeGame';
import { TicTacToeGame } from './games/TicTacToeGame';
import { HangmanGame } from './games/HangmanGame';
import { TypingTest } from './games/TypingTest';
import { MinesweeperGame } from './games/MinesweeperGame';

interface TerminalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Terminal: React.FC<TerminalProps> = ({ isOpen, onClose }) => {
  const PROMPT = 'mak@linux:~$';
  const PASSWORD = 'incorrect';
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [history, setHistory] = useState<Array<{ type: 'command' | 'output' | 'error'; content: string }>>([
    { type: 'output', content: 'Welcome to the terminal! Type "help" for available commands.' }
  ]);
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState<'none' | 'snake' | 'tictactoe' | 'hangman' | 'typing' | 'minesweeper'>('none');
  const commandHistoryRef = useRef<string[]>([]);
  const historyIndexRef = useRef(-1);
  const draftRef = useRef('');

  const finishLoading = React.useCallback(() => {
    setIsLoading(false);
    setTimeout(() => {
      if (passwordInputRef.current) {
        passwordInputRef.current.focus();
      }
    }, 100);
  }, []);

  // Reset states when terminal opens/closes
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setIsAuthenticated(false);
      setPasswordInput('');
      setPasswordError(false);
      // Fallback: if progress never hits 100% (e.g. tab backgrounded), still transition
      const fallbackTimer = setTimeout(finishLoading, 15000);
      return () => clearTimeout(fallbackTimer);
    } else {
      setIsLoading(true);
      setIsAuthenticated(false);
      setPasswordInput('');
    }
  }, [isOpen, finishLoading]);

  useEffect(() => {
    if (isAuthenticated && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = (cmd: string) => {
    const raw = cmd.trim();
    if (raw) {
      const prev = commandHistoryRef.current;
      if (prev[prev.length - 1] !== raw) {
        commandHistoryRef.current = [...prev.slice(-49), raw];
      }
      historyIndexRef.current = -1;
    }
    const trimmedCmd = raw.toLowerCase();
    const parts = trimmedCmd.split(' ');
    const command = parts[0];

    setHistory(prev => [...prev, { type: 'command', content: `${PROMPT} ${cmd}` }]);

    switch (command) {
      case 'help':
        setHistory(prev => [...prev, {
          type: 'output',
          content: `Available commands:
  help          - Show this help message
  clear         - Clear the terminal
  about         - About this portfolio
  snake         - Play Snake game
  ttt           - Play Tic-Tac-Toe
  hangman       - Play Hangman (portfolio words)
  typing        - Typing speed test
  minesweeper   - Play Minesweeper (small)
  exit          - Close the terminal`
        }]);
        break;

      case 'clear':
        setHistory([{ type: 'output', content: 'Terminal cleared.' }]);
        setGameState('none');
        break;

      case 'about':
        setHistory(prev => [...prev, {
          type: 'output',
          content: `Musab Ahmed Khan - Computer Science Student
Portfolio Website - Built with React, TypeScript, and Tailwind CSS
GitHub: github.com/MAKhan22`
        }]);
        break;

      case 'snake':
        setGameState('snake');
        setHistory(prev => [...prev, {
          type: 'output',
          content: 'Starting Snake game... Use arrow keys to play. Type "exit" to quit.'
        }]);
        break;

      case 'ttt':
        setGameState('tictactoe');
        setHistory(prev => [...prev, {
          type: 'output',
          content: 'Starting TTT (you are X, AI is O). Type "exit" to quit.'
        }]);
        break;

      case 'hangman':
        setGameState('hangman');
        setHistory(prev => [...prev, {
          type: 'output',
          content: 'Starting Hangman... Guess the word from this portfolio!'
        }]);
        break;

      case 'typing':
        setGameState('typing');
        setHistory(prev => [...prev, {
          type: 'output',
          content: 'Starting typing speed test...'
        }]);
        break;

      case 'minesweeper':
        setGameState('minesweeper');
        setHistory(prev => [...prev, {
          type: 'output',
          content: 'Starting Minesweeper (5x5). Click to reveal, right-click to flag. Type "exit" to quit.'
        }]);
        break;

      case 'exit':
        setGameState('none');
        onClose();
        break;

      case '':
        break;

      default:
        setHistory(prev => [...prev, {
          type: 'error',
          content: `Command not found: ${command}. Type "help" for available commands.`
        }]);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError(false);
      setPasswordInput('');
    } else {
      setPasswordError(true);
      setPasswordInput('');
      setTimeout(() => {
        if (passwordInputRef.current) {
          passwordInputRef.current.focus();
        }
      }, 100);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      executeCommand(input);
      setInput('');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed top-16 right-0 w-96 h-[calc(100vh-4rem)] bg-white/95 dark:bg-background-dark/90 border-l border-blue-500/40 dark:border-blue-500/50 shadow-2xl z-40 flex flex-col"
        >
          {/* Terminal Header */}
          <div className="flex items-center justify-between px-4 py-2 bg-zinc-50/95 dark:bg-zinc-900/90 border-b border-blue-500/30 dark:border-blue-500/40">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-zinc-600 dark:text-zinc-300">
                {PROMPT}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Terminal Content — click anywhere in main phase to focus command input */}
          <div
            className={`flex-1 overflow-y-auto p-4 font-mono text-xs leading-relaxed ${isLoading || !isAuthenticated ? 'flex items-center justify-center' : ''} ${isAuthenticated && !isLoading && gameState === 'none' ? 'cursor-text' : ''}`}
            ref={terminalRef}
            onClick={() => {
              if (isAuthenticated && !isLoading && gameState === 'none') {
                inputRef.current?.focus();
              }
            }}
          >
            {isLoading ? (
              <LoadingScreen onComplete={finishLoading} />
            ) : !isAuthenticated ? (
              <PasswordScreen
                passwordInput={passwordInput}
                setPasswordInput={setPasswordInput}
                passwordError={passwordError}
                onSubmit={handlePasswordSubmit}
                inputRef={passwordInputRef}
              />
            ) : gameState === 'none' ? (
              <>
                {history.map((item, index) => (
                  <div key={index} className="mb-1">
                    {item.type === 'command' && (
                      <span className="text-blue-600 dark:text-blue-400">{item.content}</span>
                    )}
                    {item.type === 'output' && (
                      <span className="text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">{item.content}</span>
                    )}
                    {item.type === 'error' && (
                      <span className="text-red-500 dark:text-red-400">{item.content}</span>
                    )}
                  </div>
                ))}
                <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2">
                  <span className="text-blue-600 dark:text-blue-400 shrink-0 whitespace-nowrap">{PROMPT}</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      const hist = commandHistoryRef.current;
                      if (e.key === 'ArrowUp') {
                        e.preventDefault();
                        if (hist.length === 0) return;
                        if (historyIndexRef.current === -1) draftRef.current = input;
                        historyIndexRef.current = historyIndexRef.current - 1;
                        if (historyIndexRef.current < 0) historyIndexRef.current = hist.length - 1;
                        setInput(hist[historyIndexRef.current]);
                      } else if (e.key === 'ArrowDown') {
                        e.preventDefault();
                        if (historyIndexRef.current === -1) return;
                        historyIndexRef.current--;
                        if (historyIndexRef.current < 0) {
                          historyIndexRef.current = -1;
                          setInput(draftRef.current);
                        } else {
                          setInput(hist[historyIndexRef.current]);
                        }
                      }
                    }}
                    className="flex-1 min-w-0 bg-transparent text-zinc-900 dark:text-zinc-100 outline-none"
                    autoFocus
                  />
                </form>
              </>
            ) : gameState === 'snake' ? (
              <SnakeGame onExit={() => setGameState('none')} />
            ) : gameState === 'tictactoe' ? (
              <TicTacToeGame onExit={() => setGameState('none')} />
            ) : gameState === 'hangman' ? (
              <HangmanGame onExit={() => setGameState('none')} />
            ) : gameState === 'typing' ? (
              <TypingTest onExit={() => setGameState('none')} />
            ) : gameState === 'minesweeper' ? (
              <MinesweeperGame onExit={() => setGameState('none')} />
            ) : null}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Loading Screen Component – many logs; early ones stay longer, later ones cycle quickly
const logs = [
  '[INFO] Initializing kernel modules...',
  '[INFO] Loading kernel modules...',
  '[INFO] Kernel modules loaded.',
  '[INFO] Loading system libraries...',
  '[INFO] Loading system libraries...',
  '[INFO] Loading libc...',
  '[INFO] Loading system libraries...',
  '[INFO] System libraries loaded.',
  '[INFO] Mounting root filesystem...',
  '[INFO] Mounting filesystems...',
  '[INFO] Mounting /dev...',
  '[INFO] Mounting /proc...',
  '[INFO] Mounting /sys...',
  '[INFO] Filesystems mounted.',
  '[INFO] Starting udev...',
  '[INFO] Starting network services...',
  '[INFO] Bringing up loopback...',
  '[INFO] Starting network services...',
  '[INFO] Network services ready.',
  '[INFO] Loading user environment...',
  '[INFO] Reading /etc/profile...',
  '[INFO] Loading user environment...',
  '[INFO] Setting PATH...',
  '[INFO] User environment loaded.',
  '[INFO] Initializing shell...',
  '[INFO] Starting login shell...',
  '[INFO] Initializing shell...',
  '[INFO] Shell ready.',
  '[INFO] Loading terminal emulator...',
  '[INFO] Allocating pty...',
  '[INFO] Loading terminal emulator...',
  '[INFO] Setting term type...',
  '[INFO] Terminal emulator loaded.',
  '[INFO] Establishing secure connection...',
  '[INFO] TLS handshake...',
  '[INFO] Establishing secure connection...',
  '[INFO] Secure channel established.',
  '[INFO] Verifying system integrity...',
  '[INFO] Checksum verification...',
  '[INFO] Verifying system integrity...',
  '[INFO] Integrity check passed.',
  '[INFO] Loading keymap...',
  '[INFO] Loading locale...',
  '[INFO] Loading timezone...',
  '[INFO] Initializing display...',
  '[INFO] Loading fonts...',
  '[INFO] Setting up cursor...',
  '[INFO] Enabling echo...',
  '[INFO] Flushing buffers...',
  '[INFO] Finalizing...',
  '[INFO] Terminal ready.'
];

const LoadingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentLog, setCurrentLog] = useState('');
  const hasCalledComplete = useRef(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      const stutter = Math.random() < 0.22;
      const delay = stutter ? 380 + Math.random() * 320 : 160 + Math.random() * 100;
      const increment = stutter ? Math.random() * 0.7 + 0.1 : Math.random() * 2.5 + 1.5;
      setProgress(prev => {
        const next = Math.min(prev + increment, 100);
        // Non-linear: early progress = same log longer; late progress = logs fly by
        const t = next / 100;
        const logIndex = Math.min(
          Math.floor(Math.pow(t, 0.55) * logs.length),
          logs.length - 1
        );
        setCurrentLog(logs[logIndex]);
        return next;
      });
      timeoutRef.current = setTimeout(tick, delay);
    };
    timeoutRef.current = setTimeout(tick, 200);
    return () => {
      cancelled = true;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (progress >= 100 && !hasCalledComplete.current) {
      hasCalledComplete.current = true;
      const t = setTimeout(onComplete, 400);
      return () => clearTimeout(t);
    }
  }, [progress, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full px-4">
      <p className="text-sm font-mono text-zinc-500 dark:text-zinc-400 mb-3">Initializing...</p>
      <div className="w-full max-w-xs h-2 bg-zinc-700 dark:bg-zinc-800 rounded overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.15, ease: 'linear' }}
          className="h-full bg-blue-600 dark:bg-blue-500"
        />
      </div>
      <p className="text-xs font-mono text-zinc-500 dark:text-zinc-500 mt-2 tabular-nums">{Math.round(progress)}%</p>
      <p className="text-xs font-mono text-green-500 dark:text-green-400 text-left w-full max-w-md mt-4 tabular-nums">
        {currentLog || logs[0]}
      </p>
    </div>
  );
};

// Password Screen Component
interface PasswordScreenProps {
  passwordInput: string;
  setPasswordInput: (value: string) => void;
  passwordError: boolean;
  onSubmit: (e: React.FormEvent) => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

const PasswordScreen: React.FC<PasswordScreenProps> = ({
  passwordInput,
  setPasswordInput,
  passwordError,
  onSubmit,
  inputRef,
}) => {
  return (
    <div className="w-full font-mono text-sm leading-relaxed">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-left max-w-md mx-auto"
      >
        <p className="text-zinc-500 dark:text-zinc-400 mb-2 text-base">
          login: mak
        </p>
        <form onSubmit={onSubmit} className="space-y-3">
          <div className="flex items-baseline gap-2 text-zinc-500 dark:text-zinc-400 text-base">
            <span className="shrink-0">Password:</span>
            <input
              ref={inputRef}
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder=""
              className={`flex-1 min-w-0 bg-transparent border-none outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 focus:ring-0 p-0 text-base ${
                passwordError ? 'text-red-500 dark:text-red-400' : ''
              }`}
              autoFocus
              autoComplete="current-password"
            />
          </div>
          {passwordError && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-500 dark:text-red-400 text-sm mt-1"
            >
              Your password is incorrect
            </motion.p>
          )}
        </form>
      </motion.div>
    </div>
  );
};
