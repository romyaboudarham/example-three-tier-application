'use client';

import { useState } from 'react';

export default function Calculator() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);
  const [isError, setIsError] = useState(false);

  const resetError = () => {
    if (isError) {
      setDisplay('0');
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(false);
      setIsError(false);
    }
  };

  const handleNumberClick = (num: string) => {
    resetError();
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleDecimal = () => {
    resetError();
    if (waitingForNewValue) {
      setDisplay('0.');
      setWaitingForNewValue(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperation = (nextOp: string) => {
    if (isError) return;
    const currentValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(currentValue);
    } else if (operation) {
      const result = calculate(previousValue, currentValue, operation);
      if (result === null) {
        setDisplay('Error');
        setIsError(true);
        setPreviousValue(null);
        setOperation(null);
        setWaitingForNewValue(false);
        return;
      }
      setDisplay(String(result));
      setPreviousValue(result);
    }

    setOperation(nextOp);
    setWaitingForNewValue(true);
  };

  // Returns null when the operation is undefined (e.g. division by zero).
  const calculate = (prev: number, current: number, op: string): number | null => {
    switch (op) {
      case '+':
        return prev + current;
      case '−':
        return prev - current;
      case '×':
        return prev * current;
      case '÷':
        if (current === 0) return null; // division by zero is undefined
        return prev / current;
      case '%':
        return prev % current;
      default:
        return current;
    }
  };

  const handleEquals = () => {
    if (isError) return;
    const currentValue = parseFloat(display);

    if (operation && previousValue !== null) {
      const result = calculate(previousValue, currentValue, operation);
      if (result === null) {
        setDisplay('Error');
        setIsError(true);
        setPreviousValue(null);
        setOperation(null);
        setWaitingForNewValue(false);
        return;
      }
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
    setIsError(false);
  };

  const handleBackspace = () => {
    if (isError) return;
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handleToggleSign = () => {
    if (isError) return;
    const currentValue = parseFloat(display);
    setDisplay(String(-currentValue));
  };

  const handlePercentage = () => {
    if (isError) return;
    const currentValue = parseFloat(display);
    setDisplay(String(currentValue / 100));
  };

  const Button = ({
    children,
    onClick,
    className = '',
    variant = 'default',
  }: {
    children: React.ReactNode;
    onClick: () => void;
    className?: string;
    variant?: 'default' | 'operator' | 'equals';
  }) => {
    const baseStyle =
      'w-full h-14 rounded-lg font-semibold text-lg transition-colors active:scale-95';
    const variants = {
      default:
        'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 hover:bg-zinc-300 dark:hover:bg-zinc-600',
      operator:
        'bg-amber-500 dark:bg-amber-600 text-white hover:bg-amber-600 dark:hover:bg-amber-500',
      equals:
        'bg-green-500 dark:bg-green-600 text-white hover:bg-green-600 dark:hover:bg-green-500',
    };

    return (
      <button
        onClick={onClick}
        className={`${baseStyle} ${variants[variant]} ${className}`}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="w-full max-w-xs mx-auto mb-8 rounded-xl border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 p-6 shadow-lg">
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
        Calculator
      </h2>

      {/* Display */}
      <div className="mb-6 rounded-lg bg-zinc-900 dark:bg-zinc-950 p-4">
        <div className={`text-right text-4xl font-bold font-mono break-words ${isError ? 'text-red-400' : 'text-green-400'}`}>
          {display}
        </div>
      </div>

      {/* Buttons Grid */}
      <div className="grid grid-cols-4 gap-3">
        {/* Row 1: Clear, Backspace, %, ÷ */}
        <Button
          onClick={handleClear}
          variant="operator"
          className="col-span-2"
        >
          Clear
        </Button>
        <Button onClick={handlePercentage} variant="default">
          %
        </Button>
        <Button
          onClick={() => handleOperation('÷')}
          variant="operator"
        >
          ÷
        </Button>

        {/* Row 2: 7, 8, 9, × */}
        <Button onClick={() => handleNumberClick('7')}>7</Button>
        <Button onClick={() => handleNumberClick('8')}>8</Button>
        <Button onClick={() => handleNumberClick('9')}>9</Button>
        <Button
          onClick={() => handleOperation('×')}
          variant="operator"
        >
          ×
        </Button>

        {/* Row 3: 4, 5, 6, − */}
        <Button onClick={() => handleNumberClick('4')}>4</Button>
        <Button onClick={() => handleNumberClick('5')}>5</Button>
        <Button onClick={() => handleNumberClick('6')}>6</Button>
        <Button
          onClick={() => handleOperation('−')}
          variant="operator"
        >
          −
        </Button>

        {/* Row 4: 1, 2, 3, + */}
        <Button onClick={() => handleNumberClick('1')}>1</Button>
        <Button onClick={() => handleNumberClick('2')}>2</Button>
        <Button onClick={() => handleNumberClick('3')}>3</Button>
        <Button
          onClick={() => handleOperation('+')}
          variant="operator"
        >
          +
        </Button>

        {/* Row 5: 0, ., +/−, = */}
        <Button
          onClick={() => handleNumberClick('0')}
          className="col-span-2"
        >
          0
        </Button>
        <Button onClick={handleDecimal}>.</Button>
        <Button onClick={handleToggleSign}>+/−</Button>

        {/* Row 6: Equals button spanning full width */}
        <Button
          onClick={handleEquals}
          variant="equals"
          className="col-span-4"
        >
          =
        </Button>
      </div>
    </div>
  );
}
