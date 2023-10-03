import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { PUBLIC_PARTYKIT_HOST } from '$env/static/public';
import { SLUG_API_ENDPOINT } from '$env/static/private';
import type { GameState } from '$lib/types';

interface SlugData {
	player1: string | undefined;
	player2: string | undefined;
	createdAt: string;
	updatedAt: string;
}

interface PartyData {
	playerCount: number;
	gameState: GameState;
}

export const load: PageServerLoad = async ({ params, fetch }) => {
	const room = params.slug;
	// try {
	const response = await fetch(`${SLUG_API_ENDPOINT}/${room}`);
	const data: { slugData: SlugData } = await response.json();
	if (data.slugData) {
		const partyResponse = await fetch(`${PUBLIC_PARTYKIT_HOST}/party/${room}`);
		const { playerCount, gameState }: PartyData = await partyResponse.json();
		console.log('playerCount: ', playerCount);
		if (playerCount === 1 && data.slugData.player2 === undefined) {
			throw redirect(302, `/join/${room}`);
		} else if (playerCount >= 2) {
			throw error(409);
		}
		return { room, slugData: data.slugData, gameState };
	} else {
		throw error(404);
	}
	// } catch (err) {
	// 	console.log('error: ', err);
	// 	throw error(404);
	// }
	// const host = PUBLIC_PARTYKIT_HOST;
	// const partykitUrl = `${host}/party/${room}`;
	// try {
	// 	const response = await fetch(partykitUrl);
	// 	const data = await response.json();
	// 	const playerCount = data.playerCount;
	// 	console.log('playerCount, room: ', playerCount, room);
	// 	return { playerCount, room };
	// } catch (error) {
	// 	console.error(`Error fetching count from PartyKit: ${error}`);
	// }

	// throw error(404, 'Not found');
};
