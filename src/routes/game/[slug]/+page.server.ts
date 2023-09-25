import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { PUBLIC_PARTYKIT_HOST } from '$env/static/public';

export const load: PageServerLoad = async ({ params }) => {
	const room = params.slug;
	return { room };
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
