type Board = Array<Array<number>>;

import type { GameState, PLAYER } from '../src/lib/types';

export const NUM_ROWS = 6;
export const NUM_COLUMNS = 7;
export const STRIKE = 4;

const initialBoard: number[][] = [
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0]
];

export function updateBoard(board: number[][], colIndex: number, value: number): number[][] {
	// eslint-disable-next-line for-direction
	for (let row = NUM_ROWS - 1; row > 0; row--) {
		if (board[row][colIndex] === 0) {
			board[row][colIndex] = value;
			break;
		}
	}
	return board;
}

export const INITIAL_STATE: GameState = {
	board: initialBoard,
	player1: {
		id: undefined,
		name: undefined
	},
	player2: {
		id: undefined,
		name: undefined
	},
	waitingFor: 'p1',
	winner: undefined
};
/*
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

// thank you ChatGPT - https://chat.openai.com/share/01f10033-69ff-4213-a9fd-9e507043c550
export function findConsecutiveElements(arr: number[][], count: number = 4): number | null {
	const numRows = arr.length;
	if (numRows === 0) return null;

	const numCols = arr[0].length;

	// Check horizontally
	for (let row = 0; row < numRows; row++) {
		let consecutiveCount = 1;
		let currentElement = arr[row][0];
		for (let col = 1; col < numCols; col++) {
			if (arr[row][col] === currentElement) {
				consecutiveCount++;
				if (consecutiveCount === count) {
					console.log('returning from horizontal');
					return currentElement;
				}
			} else {
				consecutiveCount = 1;
				currentElement = arr[row][col];
			}
		}
	}

	// Check vertically
	for (let col = 0; col < numCols; col++) {
		let consecutiveCount = 1;
		let currentElement = arr[0][col];
		for (let row = 1; row < numRows; row++) {
			if (arr[row][col] === currentElement) {
				consecutiveCount++;
				if (consecutiveCount === count) {
					console.log('returning from vertical', row, col);
					return currentElement;
				}
			} else {
				consecutiveCount = 1;
				currentElement = arr[row][col];
			}
		}
	}

	// Check diagonally (top-left to bottom-right)
	for (let startRow = 0; startRow < numRows; startRow++) {
		for (let startCol = 0; startCol < numCols; startCol++) {
			let consecutiveCount = 1;
			let currentElement = arr[startRow][startCol];
			for (let i = 1; i < count; i++) {
				const row = startRow + i;
				const col = startCol + i;
				if (row < numRows && col < numCols && arr[row][col] === currentElement) {
					consecutiveCount++;
					if (consecutiveCount === count) {
						console.log('returning from diagonal1');
						return currentElement;
					}
				} else {
					break;
				}
			}
		}
	}

	// Check diagonally (top-right to bottom-left)
	for (let startRow = 0; startRow < numRows; startRow++) {
		for (let startCol = numCols - 1; startCol >= 0; startCol--) {
			let consecutiveCount = 1;
			let currentElement = arr[startRow][startCol];
			for (let i = 1; i < count; i++) {
				const row = startRow + i;
				const col = startCol - i;
				if (row < numRows && col >= 0 && arr[row][col] === currentElement) {
					consecutiveCount++;
					if (consecutiveCount === count) {
						console.log('returning from diagonal2');
						return currentElement;
					}
				} else {
					break;
				}
			}
		}
	}

	return null;
}

function checkHorizontal(board: Board) {
	for (let i = 0; i < NUM_ROWS; i++) {
		const firstVal = board[i][0];
		console.log('firstVal: ', firstVal);
		let consecutiveEntries = 0;
		for (let j = 1; j < NUM_COLUMNS; j++) {
			console.log(`board[${i}][${j}]: `, board[i][j]);
			if (board[i][j] === firstVal) {
				consecutiveEntries++;
				console.log('consecutiveEntries: ', consecutiveEntries);
			} else {
				break;
			}
			if (consecutiveEntries === STRIKE) {
				return true;
			}
		}
	}
	return false;
}
