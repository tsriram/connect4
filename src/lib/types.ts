export type PLAYER = 'p1' | 'p2';

export enum GAME_STATUS {
	'INITIAL',
	'WAITING_FOR_PLAYER2',
	'PLAYING',
	'PLAYER_DISCONNECTED',
	'COMPLETED'
}

export interface GameState {
	newCoinCol: number | null;
	newCoinRow: number | null;
	message: string;
	status: GAME_STATUS;
	player1: {
		id: string | undefined;
		name: string | undefined;
	};
	player2: {
		id: string | undefined;
		name: string | undefined;
	};
	board: number[][];
	waitingFor: string | undefined;
	winner: string | undefined;
}

export enum MessageType {
	JOIN,
	UPDATE,
	RESTART
}
