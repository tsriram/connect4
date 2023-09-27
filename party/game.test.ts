import { expect, test } from 'vitest';
import { findConsecutiveElements } from './game';

const board = [
	[0, 0, 0, 2, 0, 0, 0],
	[0, 0, 2, 2, 1, 0, 0],
	[0, 2, 0, 1, 2, 1, 0],
	[1, 0, 1, 2, 1, 0, 1],
	[0, 0, 2, 1, 0, 0, 0],
	[0, 2, 0, 2, 0, 0, 0]
];

test('sample test', () => {
	console.log('consecutive: ', findConsecutiveElements(board));
	expect(3).toBe(3);
});
