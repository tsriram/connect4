<script lang="ts">
	import type { GameState } from '$lib/types';

	export let gameState: GameState;
	export let onSubmit: (userName: string) => void;
	let userName = '';
</script>

<div>
	<!-- {#if gameState.player1.name}
    
  {/if} -->
	<input name="username" bind:value={userName} />
	<button on:click={() => onSubmit(userName)}>Submit</button>
</div>
