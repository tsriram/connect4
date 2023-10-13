import type * as Party from 'partykit/server';

export function handleRequest(req: Party.Request): Response | Promise<Response> {
  if (request.method === 'POST') {
    const payload = await request.json<{ message: string }>();
    this.messages.push(payload.message);
    this.party.broadcast(payload.message);
    return new Response('OK');
  }
}
