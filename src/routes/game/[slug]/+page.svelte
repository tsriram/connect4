<script lang="ts">
	import type { PageServerData } from './$types';
	import Game from '$lib/components/Game.svelte';
	import { beforeUpdate } from 'svelte';
	export let data: PageServerData;

	beforeUpdate(() => {
		console.log('data.gameState: ', JSON.stringify(data.gameState));
	});
</script>

<div class="game-container">
	<!-- {#if gameState?.status === GAME_STATUS.PLAYING}
		<h2>{gameState.message}</h2>
	{/if} -->
	<Game room={data.room} gameState={data.gameState} userid={data.userid} />
</div>
