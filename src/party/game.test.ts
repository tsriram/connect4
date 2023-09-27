import { expect, test } from 'vitest';
import { findConsecutiveNonZeroElements } from './game';

test('all zero', () => {
	const board = [
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0]
	];
	expect(findConsecutiveNonZeroElements(board)).toBeNull();
});

test('diagonal 1', () => {
	const board = [
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 1, 0, 0, 0],
		[0, 0, 1, 1, 0, 0, 0],
		[0, 1, 1, 2, 0, 0, 0],
		[1, 2, 2, 2, 0, 2, 0]
	];
	expect(findConsecutiveNonZeroElements(board)).toBe(1);
});
