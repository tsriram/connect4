import { PUBLIC_PARTYKIT_HOST } from '$env/static/public';
import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { PartyData } from '$lib/types';

export const load: PageServerLoad = async ({ params, fetch, cookies }) => {
	const room = params.slug;
	const userid = cookies.get('userid');
	if (!userid) {
		throw redirect(302, `/join/${room}`);
	}
	const partykitUrl = `${PUBLIC_PARTYKIT_HOST}/party/${room}`;
	const partyResponse = await fetch(partykitUrl);
	const { playerCount, gameState }: PartyData = await partyResponse.json();
	if (gameState) {
		if (gameState.player1.id === userid || gameState.player2.id === userid) {
			return { room, gameState, userid };
		}
		if (playerCount === 1 && gameState.player2.name === undefined) {
			throw redirect(302, `/join/${room}`);
		} else if (playerCount >= 2) {
			throw error(409);
		}
		return { room, gameState, userid };
	} else {
		throw error(404);
	}
};
