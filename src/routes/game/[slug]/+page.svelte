<script lang="ts">
	import type { PageServerData } from './$types';
	import PartySocket from 'partysocket';
	import { PUBLIC_PARTYKIT_HOST } from '$env/static/public';
	import { onMount, onDestroy } from 'svelte';
	export let data: PageServerData;
	let socket: PartySocket;
	let socketClosed = false;
	let message = '';

	function onMessage(event: MessageEvent) {
		message = event.data;
		console.log(event.data);
	}

	export function onClose(event: CloseEvent) {
		console.log('event: ', event);
		socketClosed = true;
		socket.close();
	}

	onMount(() => {
		socket = new PartySocket({
			host: PUBLIC_PARTYKIT_HOST,
			room: data.room
		});

		socket.addEventListener('message', onMessage);

		socket.addEventListener('close', onClose);
	});

	onDestroy(() => {
		if (socket) {
			socket.removeEventListener('message', onMessage);
			socket.removeEventListener('close', onClose);
		}
	});
</script>

<h1>Game page</h1>
<p>{data.room}</p>

<h3>Message from server:</h3>
<p>{message}</p>

{#if socketClosed}
	<h2>Socket closed</h2>
{/if}
