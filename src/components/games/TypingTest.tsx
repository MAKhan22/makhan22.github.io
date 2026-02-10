import React, { useEffect, useRef, useState } from 'react';

interface TypingTestProps {
  onExit: () => void;
}

// Typing speed test
const TYPING_PHRASES = [
  'Computer Science and Engineering student at Sabanci University.',
  'Built with React TypeScript and Tailwind CSS.',
  'Deep learning and machine learning projects.',
  'Portfolio website with dark mode and smooth animations.',
];

export const TypingTest: React.FC<TypingTestProps> = ({ onExit }) => {
  const [phrase, setPhrase] = useState(() => TYPING_PHRASES[Math.floor(Math.random() * TYPING_PHRASES.length)]);
  const [input, setInput] = useState('');
  const startTimeRef = useRef<number | null>(null);
  const [done, setDone] = useState(false);
  const [wpm, setWpm] = useState<number | null>(null);
  const [cmd, setCmd] = useState('');
  const cmdRef = useRef<HTMLInputElement>(null);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (startTimeRef.current === null && v.length > 0) startTimeRef.current = Date.now();
    setInput(v);
    if (v === phrase && startTimeRef.current !== null) {
      setDone(true);
      const elapsed = (Date.now() - startTimeRef.current) / 60000;
      setWpm(Math.round(phrase.split(' ').length / elapsed));
    }
  };

  const restart = () => {
    setPhrase(TYPING_PHRASES[Math.floor(Math.random() * TYPING_PHRASES.length)]);
    setInput('');
    startTimeRef.current = null;
    setDone(false);
    setWpm(null);
    setCmd('');
    setTimeout(() => cmdRef.current?.focus(), 0);
  };

  const onCmdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cmd.trim().toLowerCase() === 'new' || cmd.trim().toLowerCase() === 'reset') {
      restart();
    }
    setCmd('');
  };

  return (
    <div className="text-zinc-700 dark:text-zinc-300">
      <p className="text-sm mb-2">Type this phrase as fast as you can:</p>
      <p className="bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 p-2 rounded mb-2 text-sm font-mono">{phrase}</p>
      <input
        type="text"
        value={input}
        onChange={handleChange}
        disabled={done}
        placeholder="Start typing..."
        className="w-full px-3 py-2 bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded text-sm mb-2 text-zinc-900 dark:text-zinc-100"
      />
      {done && wpm !== null && <p className="text-green-500 font-semibold mb-2">Done! ~{wpm} WPM</p>}
      <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">Type <span className="text-zinc-800 dark:text-zinc-300">new</span> and Enter for another phrase. Ctrl+C to exit.</p>
      <form onSubmit={onCmdSubmit} className="flex items-baseline gap-2 mt-1">
        <span className="text-blue-600 dark:text-blue-400 shrink-0 text-sm">&gt;</span>
        <input
          ref={cmdRef}
          type="text"
          value={cmd}
          onChange={(e) => setCmd(e.target.value)}
          placeholder="new"
          className="flex-1 min-w-0 bg-transparent outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-sm border-b border-zinc-400 dark:border-zinc-500"
          autoComplete="off"
        />
      </form>
    </div>
  );
};
