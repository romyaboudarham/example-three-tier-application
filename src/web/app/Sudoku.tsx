'use client';

import { useState, useEffect } from 'react';
import { generatePuzzle, createEmptyBoard, isBoardComplete, validateBoard, solveSudoku, SudokuBoard } from './sudoku-utils';
import { useTheme } from './ThemeContext';

export default function Sudoku() {
  const { theme, toggleTheme } = useTheme();
  const [board, setBoard] = useState<SudokuBoard>([]);
  const [originalBoard, setOriginalBoard] = useState<SudokuBoard>([])
  const [userBoard, setUserBoard] = useState<SudokuBoard>([]);
  const [solved, setSolved] = useState(false);
  const [isValid, setIsValid] = useState(true);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);

  // Initialize puzzle on mount
  useEffect(() => {
    const newPuzzle = generatePuzzle('medium');
    setBoard(newPuzzle);
    setOriginalBoard(newPuzzle.map((row) => [...row]));
    setUserBoard(newPuzzle.map((row) => [...row]));
    setSolved(false);
    setIsValid(true);
  }, []);

  const handleNewGame = () => {
    const newPuzzle = generatePuzzle('medium');
    setBoard(newPuzzle);
    setOriginalBoard(newPuzzle.map((row) => [...row]));
    setUserBoard(newPuzzle.map((row) => [...row]));
    setSolved(false);
    setIsValid(true);
    setSelectedCell(null);
  };

  const handleCellChange = (row: number, col: number, value: string) => {
    if (originalBoard[row][col] !== null) return; // Can't edit original numbers

    const newUserBoard = userBoard.map((r) => [...r]);
    newUserBoard[row][col] = value === '' ? null : parseInt(value);
    setUserBoard(newUserBoard);

    // Check validity
    const testBoard = newUserBoard.map((r) => [...r]);
    const valid = validateBoard(testBoard);
    setIsValid(valid);

    // Check if complete
    if (isBoardComplete(newUserBoard) && valid) {
      setSolved(true);
    } else {
      setSolved(false);
    }
  };

  const handleSolve = () => {
    const solvedBoard = userBoard.map((r) => [...r]);
    solveSudoku(solvedBoard);
    setUserBoard(solvedBoard);
    setSolved(true);
  };

  const handleClear = () => {
    const clearedBoard = originalBoard.map((row) => [...row]);
    setUserBoard(clearedBoard);
    setSolved(false);
    setIsValid(true);
    setSelectedCell(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent, row: number, col: number) => {
    if (originalBoard[row][col] !== null) return;

    if (e.key >= '1' && e.key <= '9') {
      handleCellChange(row, col, e.key);
      e.preventDefault();
    } else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') {
      handleCellChange(row, col, '');
      e.preventDefault();
    } else if (e.key === 'ArrowUp' && row > 0) {
      setSelectedCell([row - 1, col]);
    } else if (e.key === 'ArrowDown' && row < 8) {
      setSelectedCell([row + 1, col]);
    } else if (e.key === 'ArrowLeft' && col > 0) {
      setSelectedCell([row, col - 1]);
    } else if (e.key === 'ArrowRight' && col < 8) {
      setSelectedCell([row, col + 1]);
    }
  };

  if (board.length === 0) return null;

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Sudoku</h2>
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-50 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1h4a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1h-4zm0 12a5 5 0 110-10 5 5 0 010 10zm0-9a4 4 0 100 8 4 4 0 000-8z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>

      {/* Status messages */}
      {solved && (
        <div className="mb-4 p-3 rounded-lg bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 text-sm font-medium">
          ✓ Puzzle solved!
        </div>
      )}
      {!isValid && isBoardComplete(userBoard) && (
        <div className="mb-4 p-3 rounded-lg bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100 text-sm font-medium">
          ✗ Invalid solution. Check for conflicts.
        </div>
      )}

      {/* Sudoku grid */}
      <div className="mb-6 p-2 bg-zinc-200 dark:bg-zinc-700 rounded-lg inline-block">
        <div className="grid gap-0" style={{ gridTemplateColumns: 'repeat(9, minmax(0, 1fr))' }}>
          {userBoard.map((row, rowIdx) => (
            row.map((cell, colIdx) => {
              const isOriginal = originalBoard[rowIdx][colIdx] !== null;
              const isSelected = selectedCell && selectedCell[0] === rowIdx && selectedCell[1] === colIdx;
              const boxRow = Math.floor(rowIdx / 3);
              const boxCol = Math.floor(colIdx / 3);
              const hasRightBorder = (colIdx + 1) % 3 === 0 && colIdx < 8;
              const hasBottomBorder = (rowIdx + 1) % 3 === 0 && rowIdx < 8;

              return (
                <input
                  key={`${rowIdx}-${colIdx}`}
                  type="text"
                  maxLength={1}
                  value={cell ?? ''}
                  onChange={(e) => handleCellChange(rowIdx, colIdx, e.target.value)}
                  onKeyDown={(e) => handleKeyPress(e, rowIdx, colIdx)}
                  onClick={() => setSelectedCell([rowIdx, colIdx])}
                  disabled={isOriginal}
                  className={`w-8 h-8 text-center font-bold text-sm border border-zinc-300 dark:border-zinc-600 transition-colors ${
                    isOriginal
                      ? 'bg-zinc-300 dark:bg-zinc-600 text-zinc-900 dark:text-zinc-50 cursor-default'
                      : isSelected
                      ? 'bg-blue-200 dark:bg-blue-700 text-zinc-900 dark:text-zinc-50'
                      : 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                  } ${hasRightBorder ? 'border-r-2' : ''} ${hasBottomBorder ? 'border-b-2' : ''}`}
                  aria-label={`Sudoku cell row ${rowIdx + 1} column ${colIdx + 1}`}
                />
              );
            })
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={handleNewGame}
          className="flex-1 min-w-fit rounded-lg bg-zinc-900 dark:bg-zinc-50 px-4 py-2 font-medium text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors"
        >
          New Game
        </button>
        <button
          onClick={handleSolve}
          className="flex-1 min-w-fit rounded-lg bg-green-600 dark:bg-green-500 px-4 py-2 font-medium text-white hover:bg-green-700 dark:hover:bg-green-600 transition-colors"
        >
          Solve
        </button>
        <button
          onClick={handleClear}
          className="flex-1 min-w-fit rounded-lg bg-orange-600 dark:bg-orange-500 px-4 py-2 font-medium text-white hover:bg-orange-700 dark:hover:bg-orange-600 transition-colors"
        >
          Clear
        </button>
      </div>

      <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
        Click cells to select, type 1-9 to fill, or Backspace to clear. Use arrow keys to navigate.
      </p>
    </div>
  );
}
