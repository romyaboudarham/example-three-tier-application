// Sudoku puzzle generator and solver utilities

export type SudokuBoard = (number | null)[][];

// Check if a number is valid at a given position
function isValid(board: SudokuBoard, row: number, col: number, num: number): boolean {
  // Check row
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num) return false;
  }

  // Check column
  for (let i = 0; i < 9; i++) {
    if (board[i][col] === num) return false;
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let i = boxRow; i < boxRow + 3; i++) {
    for (let j = boxCol; j < boxCol + 3; j++) {
      if (board[i][j] === num) return false;
    }
  }

  return true;
}

// Solve the sudoku board (modifies board in place)
export function solveSudoku(board: SudokuBoard): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === null) {
        for (let num = 1; num <= 9; num++) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (solveSudoku(board)) return true;
            board[row][col] = null;
          }
        }
        return false;
      }
    }
  }
  return true;
}

// Generate a solved sudoku board
function generateSolvedBoard(): SudokuBoard {
  const board: SudokuBoard = Array(9)
    .fill(null)
    .map(() => Array(9).fill(null));

  // Fill the diagonal 3x3 boxes first (they don't conflict)
  for (let box = 0; box < 3; box++) {
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
    let idx = 0;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        board[box * 3 + i][box * 3 + j] = nums[idx++];
      }
    }
  }

  // Solve the rest
  solveSudoku(board);
  return board;
}

// Generate a puzzle by removing numbers from a solved board
export function generatePuzzle(difficulty: 'easy' | 'medium' | 'hard' = 'medium'): SudokuBoard {
  const solved = generateSolvedBoard();
  const puzzle = solved.map((row) => [...row]);

  // Remove numbers based on difficulty
  const cellsToRemove: Record<string, number> = {
    easy: 30,
    medium: 40,
    hard: 50,
  };

  let removed = 0;
  const target = cellsToRemove[difficulty];

  while (removed < target) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);

    if (puzzle[row][col] !== null) {
      puzzle[row][col] = null;
      removed++;
    }
  }

  return puzzle;
}

// Create an empty board
export function createEmptyBoard(): SudokuBoard {
  return Array(9)
    .fill(null)
    .map(() => Array(9).fill(null));
}

// Check if the board is completely filled
export function isBoardComplete(board: SudokuBoard): boolean {
  return board.every((row) => row.every((cell) => cell !== null));
}

// Validate the entire board
export function validateBoard(board: SudokuBoard): boolean {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const num = board[row][col];
      if (num !== null) {
        board[row][col] = null;
        if (!isValid(board, row, col, num)) {
          board[row][col] = num;
          return false;
        }
        board[row][col] = num;
      }
    }
  }
  return true;
}
