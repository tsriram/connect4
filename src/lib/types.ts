export type PLAYER = 'p1' | 'p2';

export enum GAME_STATUS {
	'INITIAL' = 'INITIAL',
	'WAITING_FOR_PLAYER2' = 'WAITING_FOR_PLAYER2',
	'PLAYING' = 'PLAYING',
	'PLAYER_DISCONNECTED' = 'PLAYER_DISCONNECTED',
	'COMPLETED' = 'COMPLETED'
}

export interface Player {
	id: string | undefined;
	name: string | undefined;
	connected: boolean;
}

export interface GameState {
	slug: string | undefined;
	newCoinCol: number | null;
	newCoinRow: number | null;
	message: string;
	status: GAME_STATUS;
	player1: Player;
	player2: Player;
	board: number[][];
	waitingFor: string | undefined;
	winner: string | undefined;
}

export enum MessageType {
	JOIN = 'join',
	UPDATE = 'update'
}

export interface SlugData {
	player1: string | undefined;
	player2: string | undefined;
	createdAt: string;
	updatedAt: string;
}

export interface PartyData {
	playerCount: number;
	gameState: GameState;
}

export enum GameFormType {
	START = 'start',
	JOIN = 'join'
}
