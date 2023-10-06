import { PUBLIC_PARTYKIT_HOST } from '$env/static/public';
import type { Actions, PageServerLoad } from './$types';
import { redirect, fail, error } from '@sveltejs/kit';
import type { PartyData } from '$lib/types';
import { nanoid } from 'nanoid';

export const load: PageServerLoad = async ({ params, fetch }) => {
	const room = params.slug;

	const partykitUrl = `${PUBLIC_PARTYKIT_HOST}/party/${room}`;
	const partyResponse = await fetch(partykitUrl);
	if (partyResponse.status === 200) {
		console.log('partyResponse: ', partyResponse);
		const { playerCount, gameState }: PartyData = await partyResponse.json();
		if (playerCount >= 2) {
			throw error(409);
		}
		return {
			player1Name: gameState.player1.name
		};
	} else if (partyResponse.status === 404) {
		throw error(404);
	} else {
		throw error(500);
	}
};

export const actions: Actions = {
	join: async ({ request, params, cookies }) => {
		console.log('join action from join route');
		const slug = params.slug;
		const data = await request.formData();
		const username = data.get('username');
		if (!username) {
			return fail(400, { username, missing: true });
		}
		const player2Id = nanoid();
		const payload = {
			player2: {
				name: username,
				id: player2Id
			}
		};
		const partykitUrl = `${PUBLIC_PARTYKIT_HOST}/party/${slug}`;
		await fetch(partykitUrl, {
			body: JSON.stringify(payload),
			method: 'PUT'
		});
		cookies.set('userid', player2Id, {
			path: `/game/${slug}`
		});
		throw redirect(302, `/game/${slug}`);
	}
};
