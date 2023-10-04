<script lang="ts">
	import GameTurnIndicator from '$lib/components/GameTurnIndicator.svelte';
	import type { Player } from '$lib/types';

	export let player1: Player;
	export let player2: Player;
	export let turn: string = '???';

	$: {
		if (turn !== undefined && player1.name !== undefined && player2.name !== undefined) {
			turn = turn === player1.id ? player1.name : player2.name;
		} else {
			turn = '???';
		}
	}
</script>

<div class="game-header">
	<strong>{player1.name}&nbsp;vs&nbsp;{player2.name ?? '???'}</strong>
	<GameTurnIndicator {turn} />
	<!-- <GameHeader /> -->
	<!-- <GameBoard /> -->
	<!-- <GameTurnIndicator /> -->
</div>

<style>
	.game-header {
		display: flex;
		justify-content: space-between;
		margin: 2rem 0;
	}
</style>
