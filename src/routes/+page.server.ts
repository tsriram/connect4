import { PUBLIC_PARTYKIT_HOST } from '$env/static/public';
import { redirect, fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import { nanoid } from 'nanoid';

export const actions: Actions = {
	new: async ({ request, cookies }) => {
		const data = await request.formData();
		const username = data.get('username');
		if (!username) {
			return fail(400, { username, missing: true });
		}
		const slug = nanoid();
		const player1Id = nanoid();
		const payload = {
			player1: {
				name: username,
				id: player1Id
			},
			slug
		};
		const partykitUrl = `${PUBLIC_PARTYKIT_HOST}/party/${slug}`;
		await fetch(partykitUrl, {
			body: JSON.stringify(payload),
			method: 'POST'
		});
		cookies.set('userid', player1Id, {
			path: `/game/${slug}`
		});
		// const { slug } = await response.json();
		throw redirect(302, `/game/${slug}`);
	}
};
