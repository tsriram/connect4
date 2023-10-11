import { getPartyKitRoomUrl } from '$lib/utils/party';
import { redirect, fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { nanoid } from 'nanoid';

export const load: PageServerLoad = async ({ cookies }) => {
	const username = cookies.get('username');
	return { username };
};

export const actions: Actions = {
	new: async ({ request, cookies }) => {
		const data = await request.formData();
		const submittedUserName = data.get('username') as string;
		const username = submittedUserName.trim();
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
		const partykitUrl = getPartyKitRoomUrl(slug);
		await fetch(partykitUrl, {
			body: JSON.stringify(payload),
			method: 'POST'
		});
		cookies.set('userid', player1Id, {
			path: `/game/${slug}`
		});
		cookies.set('username', username, {
			path: '/'
		});
		// const { slug } = await response.json();
		throw redirect(302, `/game/${slug}`);
	}
};
