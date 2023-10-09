import type * as Party from 'partykit/server';

interface Update {
	type: 'connect' | 'disconnect';
	roomId: string;
}

export default class Rooms implements Party.Server {
	connections: Record<string, number> | undefined;
	totalConnections: number = 0;
	constructor(readonly party: Party.Party) {}

	onStart(): void | Promise<void> {
		console.log('Connections party started');
	}

	async onRequest(request: Party.Request) {
		// read from storage
		this.connections = this.connections ?? (await this.party.storage.get('connections')) ?? {};
		this.totalConnections =
			this.totalConnections ?? (await this.party.storage.get('totalConnections')) ?? 0;
		// update connection count
		if (request.method === 'POST') {
			const update: Update = await request.json();
			const count = this.connections[update.roomId] ?? 0;
			if (update.type === 'connect') {
				this.connections[update.roomId] = count + 1;
				this.totalConnections += 1;
			} else if (update.type === 'disconnect') {
				this.connections[update.roomId] = Math.max(0, count - 1);
				this.totalConnections -= 1;
			}

			// save to storage
			await this.party.storage.put('connections', this.connections);
			await this.party.storage.put('totalConnections', this.totalConnections);
		}

		// send connection counts to requester
		return new Response(
			JSON.stringify({ connections: this.connections, totalConnections: this.totalConnections })
		);
	}
}
