import { redirect, fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { SLUG_API_ENDPOINT } from '$env/static/private';

export const actions: Actions = {
	join: async ({ request, params }) => {
		const slug = params.slug;
		const data = await request.formData();
		const username = data.get('username');
		if (!username) {
			return fail(400, { username, missing: true });
		}
		const payload = {
			player2: username
		};
		await fetch(`${SLUG_API_ENDPOINT}/${slug}`, {
			body: JSON.stringify(payload),
			method: 'PUT'
		});
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
