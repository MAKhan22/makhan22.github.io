import React, { useEffect, useMemo, useRef, useState } from 'react';

interface HangmanGameProps {
  onExit: () => void;
}

// Words from portfolio content (uppercase, no spaces)
const HANGMAN_WORDS = ['PYTHON', 'REACT', 'PORTFOLIO', 'PYTORCH', 'ISTANBUL', 'SABANCI', 'DEEPLEARNING', 'TYPESCRIPT', 'MACHINE', 'RESEARCH', 'TURKEY', 'GITHUB', 'FRAMER', 'TAILWIND', 'NLP', 'VISION', 'UNET', 'TRANSFORMERS', 'FASTAPI', 'MONGODB', 'EXPRESS', 'NODEJS', 'JAVASCRIPT', 'TENSORFLOW', 'KERAS', 'OPENCV', 'GRADUATION', 'SEMEVAL', 'MEDICAL', 'SEGMENTATION', 'SYSTEMATIC', 'MAPPING', 'GRAPH', 'DATABASE'];

const getRandomWord = () => HANGMAN_WORDS[Math.floor(Math.random() * HANGMAN_WORDS.length)];

export const HangmanGame: React.FC<HangmanGameProps> = ({ onExit }) => {
  const [word, setWord] = useState(getRandomWord);
  const [guessed, setGuessed] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState(0);
  const maxWrong = 6;
  const [cmd, setCmd] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const display = useMemo(
    () => word.split('').map(c => guessed.has(c) ? c : '_').join(' '),
    [word, guessed]
  );
  const won = word.split('').every(c => guessed.has(c));
  const lost = wrong >= maxWrong;

  const handleGuess = (letter: string) => {
    if (won || lost || guessed.has(letter)) return;
    setGuessed(prev => new Set([...prev, letter]));
    if (!word.includes(letter)) setWrong(w => w + 1);
  };

  const newWord = () => {
    setWord(getRandomWord());
    setGuessed(new Set());
    setWrong(0);
    setCmd('');
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = cmd.trim().toUpperCase();
    if (!v) return;
    if (v === 'NEW' || v === 'RESET') {
      newWord();
      return;
    }
    if (v.length === 1 && v >= 'A' && v <= 'Z') {
      handleGuess(v);
    }
    setCmd('');
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  return (
    <div className="text-zinc-700 dark:text-zinc-300">
      <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-2">
        Type a letter and press Enter. Type <span className="text-zinc-800 dark:text-zinc-300">new</span> to reset. Ctrl+C to exit.
      </div>
      <div className="text-lg font-mono mb-1 text-center">{display}</div>
      <div className="text-xs text-center mb-3">Wrong: {wrong}/{maxWrong}</div>
      {(won || lost) && (
        <p className="mb-2 text-center">
          {won ? <span className="text-green-500">You won! Word: {word}</span> : <span className="text-red-500">You lost. Word: {word}</span>}
        </p>
      )}

      <form onSubmit={submit} className="flex items-baseline gap-2 max-w-sm mx-auto mt-2">
        <span className="text-blue-600 dark:text-blue-400 shrink-0">{won || lost ? '&gt;' : 'guess&gt;'}</span>
        <input
          ref={inputRef}
          value={cmd}
          onChange={(e) => setCmd(e.target.value)}
          placeholder={won || lost ? 'Type new and Enter to play again' : ''}
          className="flex-1 min-w-0 bg-transparent outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
          autoComplete="off"
          spellCheck={false}
        />
      </form>
    </div>
  );
};
