import type { Actions, PageServerLoad } from './$types';
import { redirect, fail, error } from '@sveltejs/kit';
import { getPartyKitRoomUrl } from '$lib/utils/party';
import type { PartyData } from '$lib/types';
import { nanoid } from 'nanoid';

export const load: PageServerLoad = async ({ params, fetch, cookies }) => {
	const room = params.slug;

	const partykitUrl = getPartyKitRoomUrl(room);
	const partyResponse = await fetch(partykitUrl);
	if (partyResponse.status === 200) {
		const { playerCount, gameState }: PartyData = await partyResponse.json();
		if (playerCount >= 2) {
			throw error(409);
		}
		const username = cookies.get('username');
		return { username };
		return {
			player1Name: gameState.player1.name,
			username
		};
	} else if (partyResponse.status === 404) {
		throw error(404);
	} else {
		throw error(500);
	}
};

export const actions: Actions = {
	join: async ({ request, params, cookies }) => {
		const slug = params.slug;
		const data = await request.formData();
		const submittedUserName = data.get('username') as string;
		const username = submittedUserName.trim();
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
		const partykitUrl = getPartyKitRoomUrl(slug);
		await fetch(partykitUrl, {
			body: JSON.stringify(payload),
			method: 'PUT'
		});
		cookies.set('userid', player2Id, {
			path: `/game/${slug}`
		});
		cookies.set('username', username, {
			path: '/'
		});
		throw redirect(302, `/game/${slug}`);
	}
};
