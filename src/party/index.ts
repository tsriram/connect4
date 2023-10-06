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

interface PostData {
	slug: string;
	player1?: {
		name: string;
		id: string;
	};
	player2?: {
		name: string;
		id: string;
	};
}

const storageKey = 'gameState';

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

	async onStart(): void | Promise<void> {
		const storedState = await this.party.storage.get<GameState>(storageKey);
		if (storedState !== undefined) {
			this.state = storedState;
		}
	}

	async onRequest(request: Party.Request): Promise<Response> {
		const url = new URL(request.url);
		// get `abc` from "http://127.0.0.1:1999/party/abc"
		const slug = url.pathname.substring(url.pathname.lastIndexOf('/') + 1);

		if (request.method === 'POST') {
			this.state.slug = slug;
			const payload = await request.json<PostData>();
			if (payload.player1 !== undefined) {
				this.state.player1.id = payload.player1.id;
				this.state.player1.name = payload.player1.name;
			}
			await this.party.storage.put(storageKey, this.state);
		}

		if (request.method === 'PUT') {
			const payload = await request.json<PostData>();
			const storedState = this.party.storage.get(storageKey, {
				noCache: true
			});
			if (!storedState) {
				return new Response('Invalid slug', {
					status: 400
				});
			}
			if (payload.player2 !== undefined) {
				this.state.player2.id = payload.player2.id;
				this.state.player2.name = payload.player2.name;
			}
			console.log('POST storage.put state: ', JSON.stringify(this.state));
			await this.party.storage.put(storageKey, this.state);
		}

		if (request.method === 'GET') {
			const storedState = await this.party.storage.get<GameState>(storageKey, {
				noCache: true
			});
			if (storedState === undefined) {
				return new Response('Not found', {
					status: 404
				});
			}
			const playerCount = [...this.party.getConnections()].length;
			return json(JSON.stringify({ playerCount, gameState: this.state }));
		}
		return json(JSON.stringify({ status: 'success' }));
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
			slug: undefined,
			newCoinCol: null,
			newCoinRow: null,
			message: messages[GAME_STATUS.INITIAL],
			status: GAME_STATUS.INITIAL,
			player1: {
				id: undefined,
				name: undefined,
				connected: false
			},
			player2: {
				id: undefined,
				name: undefined,
				connected: false
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
		// const playerCount = [...this.party.getConnections()].length;
		// if (playerCount === 0) {
		// 	this.resetState();
		// } else {
		if (connection.id === this.state.player1.id) {
			this.state.player1.connected = false;
			this.state.message = `${this.state.player1.name} is disconnected! Waiting for them to join back...`;
		} else if (connection.id === this.state.player2.id) {
			this.state.player2.connected = false;
			this.state.message = `${this.state.player2.name} is disconnected! Waiting for them to join back...`;
		}
		this.state.status = GAME_STATUS.PLAYER_DISCONNECTED;
		// const didPlayer1Close = this.state.player1.id === connection.id;
		// const closedByPlayer = didPlayer1Close ? this.state.player1.name : this.state.player2.name;
		// this.state.message = `Sorry, ${closedByPlayer} has disconnected. You can't continue this game :(`;
		// this.state.status = GAME_STATUS.PLAYER_DISCONNECTED;
		this.party.broadcast(JSON.stringify(this.state));
		// }
	}

	onConnect(connection: Party.Connection, ctx: Party.ConnectionContext) {
		console.log('onConnect conn.id: ', connection.id);
		// Close any new connection if there's already 2 players in the room
		const playerCount = [...this.party.getConnections()].length;
		console.log('playerCount: ', playerCount);
		if (playerCount > MAX_USERS_PER_ROOM) {
			connection.send(
				JSON.stringify({ message: 'More than 2 players in this room. Try a new game' })
			);
			connection.close(3000, 'More than 2 players');
			return;
		}

		if (connection.id === this.state.player1.id) {
			this.state.player1.connected = true;
			this.state.waitingFor = this.state.waitingFor || connection.id;
			if (!this.state.player2.connected) {
				this.state.status = GAME_STATUS.WAITING_FOR_PLAYER2;
				this.state.message = messages[this.state.status];
			} else {
				this.state.status = GAME_STATUS.PLAYING;
				this.state.message = '';
			}
		} else if (connection.id === this.state.player2.id) {
			this.state.player2.connected = true;
			this.state.status = GAME_STATUS.PLAYING;
			this.state.message = `${this.state.player1.name} vs ${this.state.player2.name}`;
		}

		this.party.broadcast(JSON.stringify(this.state));
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
