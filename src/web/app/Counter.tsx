'use client';

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(count + 1);
  };

  const reset = () => {
    setCount(0);
  };

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 mb-8">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">
        Click Counter
      </h2>
      <div className="flex items-center justify-between">
        <div className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
          {count}
        </div>
        <div className="flex gap-2">
          <button
            onClick={increment}
            className="rounded-lg bg-blue-600 hover:bg-blue-700 px-6 py-3 font-medium text-white transition-colors"
          >
            Click Me!
          </button>
          <button
            onClick={reset}
            className="rounded-lg bg-zinc-300 dark:bg-zinc-600 hover:bg-zinc-400 dark:hover:bg-zinc-500 px-6 py-3 font-medium text-zinc-900 dark:text-zinc-50 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
      <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
        {count === 0 && "Click the button to start counting!"}
        {count === 1 && "Great! You've clicked once."}
        {count > 1 && count < 10 && `You've clicked ${count} times!`}
        {count >= 10 && count < 50 && "Wow, you're really clicking! 🎉"}
        {count >= 50 && "Amazing dedication! 🚀"}
      </p>
    </div>
  );
}
