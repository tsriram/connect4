<script lang="ts">
	import type { PageServerData } from './$types';
	import Game from '$lib/components/Game.svelte';
	export let data: PageServerData;
</script>

<div class="game-container">
	<!-- {#if gameState?.status === GAME_STATUS.PLAYING}
		<h2>{gameState.message}</h2>
	{/if} -->
	<Game room={data.room} slugData={data.slugData} gameState={data.gameState} />
</div>
