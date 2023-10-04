import type * as Party from 'partykit/server';
import { MessageType, type GameState, GAME_STATUS } from '../lib/types';
import { findConsecutiveElements, findConsecutiveNonZeroElements, updateBoard } from './game';

const MAX_USERS_PER_ROOM = 2;
const BOARD_VALUE_FOR_PLAYER1 = 1;
const BOARD_VALUE_FOR_PLAYER2 = 2;
// const json = (response: string) => {
// 	return new Response(response, {
// 		headers: {
// 			'Content-Type': 'application/json'
// 		}
// 	});
// };

const messages = {
	[GAME_STATUS.INITIAL]: 'Initial state',
	[GAME_STATUS.WAITING_FOR_PLAYER2]: 'Waiting for player 2',
	[GAME_STATUS.PLAYING]: 'Playing',
	[GAME_STATUS.PLAYER_DISCONNECTED]: 'Someone disconnected'
};

const json = (response: string) =>
	new Response(response, {
		headers: {
			'Content-Type': 'application/json'
		}
	});

export default class Server implements Party.Server {
	constructor(readonly party: Party.Party) {
		this.state = Server.getInitialState();
	}
	state: GameState;

	onRequest(req: Party.Request): Response | Promise<Response> {
		const playerCount = [...this.party.getConnections()].length;
		return json(JSON.stringify({ playerCount, gameState: this.state }));
	}

	resetState() {
		this.state = Server.getInitialState();
	}

	restartGame() {
		const initialState = Server.getInitialState();
		this.state = {
			...initialState,
			waitingFor: this.state.player1.id,
			player1: this.state.player1,
			player2: this.state.player2,
			status: GAME_STATUS.PLAYING,
			message: `${this.state.player1.name} vs ${this.state.player2.name}`
		};
	}

	static getInitialState(): GameState {
		const initialState: GameState = {
			newCoinCol: null,
			newCoinRow: null,
			message: messages[GAME_STATUS.INITIAL],
			status: GAME_STATUS.INITIAL,
			player1: {
				id: undefined,
				name: undefined
			},
			player2: {
				id: undefined,
				name: undefined
			},
			board: [
				[0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0]
			],
			waitingFor: undefined,
			winner: undefined
		};
		return initialState;
	}

	onClose(connection: Party.Connection): void | Promise<void> {
		const playerCount = [...this.party.getConnections()].length;
		if (playerCount === 0) {
			this.resetState();
		} else {
			const didPlayer1Close = this.state.player1.id === connection.id;
			const closedByPlayer = didPlayer1Close ? this.state.player1.name : this.state.player2.name;
			this.state.message = `Sorry, ${closedByPlayer} has disconnected. You can't continue this game :(`;
			this.state.status = GAME_STATUS.PLAYER_DISCONNECTED;
			this.party.broadcast(JSON.stringify(this.state));
		}
	}

	onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
		console.log('onConnect conn.id: ', conn.id);
		// Close any new connection if there's already 2 players in the room
		const playerCount = [...this.party.getConnections()].length;
		console.log('playerCount: ', playerCount);
		if (playerCount > MAX_USERS_PER_ROOM) {
			conn.send(JSON.stringify({ message: 'More than 2 players in this room. Try a new game' }));
			conn.close(3000, 'More than 2 players');
			return;
		}

		conn.send(JSON.stringify(this.state));
	}

	onMessage(message: string, sender: Party.Connection) {
		const data = JSON.parse(message);

		switch (data.type) {
			case MessageType.JOIN: {
				if (this.state.player1.name === undefined) {
					this.state.player1.name = data.name;
					this.state.player1.id = sender.id;
					this.state.waitingFor = sender.id;
					this.state.status = GAME_STATUS.WAITING_FOR_PLAYER2;
					this.state.message = messages[this.state.status];
				} else if (this.state.player2.name === undefined) {
					this.state.player2.name = data.name;
					this.state.player2.id = sender.id;
					this.state.status = GAME_STATUS.PLAYING;
					this.state.message = `${this.state.player1.name} vs ${this.state.player2.name}`;
				}
				this.party.broadcast(JSON.stringify(this.state));
				break;
			}

			case MessageType.UPDATE: {
				if (this.state.waitingFor === sender.id && this.state.status === GAME_STATUS.PLAYING) {
					const isPlayer1 = this.state.player1.id === sender.id;
					const valueToUpdate = isPlayer1 ? BOARD_VALUE_FOR_PLAYER1 : BOARD_VALUE_FOR_PLAYER2;
					const { board, updatedRow } = updateBoard(this.state.board, data.colIndex, valueToUpdate);
					this.state.board = board;
					this.state.newCoinRow = updatedRow;
					this.state.newCoinCol = data.colIndex;

					const winningNumber = findConsecutiveNonZeroElements(this.state.board);
					if (winningNumber === BOARD_VALUE_FOR_PLAYER1) {
						this.state.status = GAME_STATUS.COMPLETED;
						this.state.message = `Yay, ${this.state.player1.name} won!`;
					} else if (winningNumber === BOARD_VALUE_FOR_PLAYER2) {
						this.state.status = GAME_STATUS.COMPLETED;
						this.state.message = `Yay, ${this.state.player2.name} won!`;
					} else {
						this.state.waitingFor = isPlayer1 ? this.state.player2.id : this.state.player1.id;
					}
					this.party.broadcast(JSON.stringify(this.state));
				}
				break;
			}

			case MessageType.RESTART: {
				this.restartGame();
				this.party.broadcast(JSON.stringify(this.state));
				break;
			}

			default: {
				this.party.broadcast(JSON.stringify(this.state));
			}
		}
		console.log(this.state);
	}
}

Server satisfies Party.Worker;
