import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { PUBLIC_PARTYKIT_HOST } from '$env/static/public';
import { SLUG_API_ENDPOINT } from '$env/static/private';
import type { PartyData, SlugData } from '$lib/types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const room = params.slug;
	// // try {
	const response = await fetch(`${SLUG_API_ENDPOINT}/${room}`);
	const data: { slugData: SlugData } = await response.json();
	if (data.slugData) {
		const partykitUrl = `${PUBLIC_PARTYKIT_HOST}/party/${room}`;
		const partyResponse = await fetch(partykitUrl);
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
};
