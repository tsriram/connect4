<script lang="ts">
	import GameTurnIndicator from '$lib/components/GameTurnIndicator.svelte';
	import GameTitle from '$lib/components/GameTitle.svelte';
	import type { Player } from '$lib/types';

	export let player1: Player;
	export let player2: Player;
	export let turn: string;
	console.log('game header player1: ', player1);
	console.log('game header player2: ', player2);
</script>

<div class="game-header">
	<GameTitle {player1} {player2} />
	<GameTurnIndicator {turn} {player1} {player2} />
	<!-- <GameHeader /> -->
	<!-- <GameBoard /> -->
	<!-- <GameTurnIndicator /> -->
</div>

<style>
	.game-header {
		display: flex;
		justify-content: space-between;
		margin: 2rem 0;
		font-size: 1.5rem;
	}
</style>
