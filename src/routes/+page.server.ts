import { redirect, fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { SLUG_API_ENDPOINT } from '$env/static/private';
import { nanoid } from 'nanoid';

export const actions: Actions = {
	new: async ({ request }) => {
		const data = await request.formData();
		const username = data.get('username');
		if (!username) {
			return fail(400, { username, missing: true });
		}
		const slug = nanoid();
		const payload = {
			player1: username,
			slug
		};
		await fetch(SLUG_API_ENDPOINT, {
			body: JSON.stringify(payload),
			method: 'POST'
		});
		// const { slug } = await response.json();
		throw redirect(302, `/game/${slug}`);
	},
	join: async ({ request }) => {
		const url = new URL(request.url);
		console.log('request.url: ', request.url);
		const slugToUpdate = url.pathname;
		console.log('slugToUpdate: ', slugToUpdate);
		const data = await request.formData();
		const username = data.get('username');
		if (!username) {
			return fail(400, { username, missing: true });
		}
		const payload = {
			player2: username
		};
		const response = await fetch(`${SLUG_API_ENDPOINT}/${slugToUpdate}`, {
			body: JSON.stringify(payload),
			method: 'PUT'
		});
		const { slug } = await response.json();
		throw redirect(302, `/game/${slug}`);
	}
};

// export const POST: RequestHandler = async ({ request }) => {
// 	const { username } = await request.json();
// 	const payload = {
// 		player1: username
// 	};
// 	const response = await fetch(SLUG_API_ENDPOINT, {
// 		body: JSON.stringify(payload),
// 		method: 'POST'
// 	});
// 	const { slug } = await response.json();
// 	throw redirect(302, `/game/${slug}`);
// };
