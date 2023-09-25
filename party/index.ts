import type * as Party from 'partykit/server';

const MAX_USERS_PER_ROOM = 2;
const json = (response: string) =>
	new Response(response, {
		headers: {
			'Content-Type': 'application/json'
		}
	});

export default class Server implements Party.Server {
	constructor(readonly party: Party.Party) {}

	onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
		// A websocket just connected!
		console.log(
			`Connected:
  id: ${conn.id}
  room: ${this.party.id}
  url: ${new URL(ctx.request.url).pathname}`
		);
		const playerCount = [...this.party.getConnections()].length;
		if (playerCount > MAX_USERS_PER_ROOM) {
			conn.send('More than 2 players in this room. Try a new game');
			conn.close(3000, 'More than 2 players');
		} else {
			// let's send a message to the connection
			conn.send('hello from server');
		}
	}

	onMessage(message: string, sender: Party.Connection) {
		// let's log the message
		console.log(`connection ${sender.id} sent message: ${message}`);
		// as well as broadcast it to all the other connections in the room...
		this.party.broadcast(
			`${sender.id}: ${message}`,
			// ...except for the connection it came from
			[sender.id]
		);
	}
}

Server satisfies Party.Worker;
