export const NUM_ROWS = 6;
export const NUM_COLUMNS = 7;

export function updateBoard(
  board: number[][],
  colIndex: number,
  value: number
): { board: number[][]; updatedRow: number } {
  // eslint-disable-next-line for-direction
  let updatedRow = 0;
  for (let row = NUM_ROWS - 1; row >= 0; row--) {
    if (board[row][colIndex] === 0) {
      board[row][colIndex] = value;
      updatedRow = row;
      break;
    }
  }
  return { updatedRow, board };
}

/*
(test party deploy GH action)
Example:
const board = [
	[0, 0, 0, 1, 0, 0, 0],
	[0, 0, 2, 2, 0, 0, 0],
	[0, 2, 0, 1, 0, 1, 0],
	[1, 0, 1, 2, 1, 0, 1],
	[0, 0, 0, 1, 0, 0, 0],
	[0, 0, 0, 2, 0, 0, 0],
];
*/

// if there's no 0 in the board, it's full
export function isBoardFull(board: number[][]): boolean {
  for (const row of board) {
    if (row.includes(0)) {
      return false;
    }
  }
  return true;
}

// thank you ChatGPT - https://chat.openai.com/share/01f10033-69ff-4213-a9fd-9e507043c550 (modified from this)
export function findConsecutiveNonZeroElements(board: number[][]): number | null {
  const count = 4;
  const numRows = board.length;
  if (numRows === 0) {
    return null;
  }
  const numCols = board[0].length;

  // horizontal
  for (let row = 0; row < numRows; row++) {
    let consecutiveCount = 1;
    let prevElement = board[row][0];
    for (let col = 1; col < numCols; col++) {
      const currentElement = board[row][col];
      if (currentElement !== 0 && prevElement === currentElement) {
        consecutiveCount++;
        if (consecutiveCount === count) {
          return currentElement;
        }
      } else {
        consecutiveCount = 1;
        prevElement = currentElement;
      }
    }
  }

  // vertical
  for (let col = 0; col < numCols; col++) {
    let consecutiveCount = 1;
    let prevElement = board[0][col];
    for (let row = 1; row < numRows; row++) {
      const currentElement = board[row][col];
      if (currentElement !== 0 && prevElement === currentElement) {
        consecutiveCount++;
        if (consecutiveCount === count) {
          return currentElement;
        }
      } else {
        consecutiveCount = 1;
        prevElement = currentElement;
      }
    }
  }

  // diagonal from top-left to bottom-right
  for (let startRow = 0; startRow < numRows; startRow++) {
    for (let startCol = 0; startCol < numCols; startCol++) {
      let consecutiveCount = 1;
      let prevElement = board[startRow][startCol];
      for (let i = 1; i < count; i++) {
        const row = startRow + i;
        const col = startCol + i;
        if (row < numRows && col < numCols) {
          const currentElement = board[row][col];
          if (currentElement !== 0 && prevElement === currentElement) {
            consecutiveCount++;
            if (consecutiveCount === count) {
              return currentElement;
            }
          } else {
            consecutiveCount = 1;
            prevElement = currentElement;
          }
        } else {
          break;
        }
      }
    }
  }

  // diagonal from top-right to bottom-left
  for (let startRow = 0; startRow < numRows; startRow++) {
    for (let startCol = numCols - 1; startCol >= 0; startCol--) {
      let consecutiveCount = 1;
      let prevElement = board[startRow][startCol];
      for (let i = 1; i < count; i++) {
        const row = startRow + i;
        const col = startCol - i;
        if (row < numRows && col >= 0) {
          const currentElement = board[row][col];
          if (currentElement !== 0 && prevElement === currentElement) {
            consecutiveCount++;
            if (consecutiveCount === count) {
              return currentElement;
            }
          } else {
            consecutiveCount = 1;
            prevElement = currentElement;
          }
        } else {
          break;
        }
      }
    }
  }

  return null;
}
