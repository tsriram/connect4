<script lang="ts">
	import HeaderCoin from '$lib/components/HeaderCoin.svelte';
	import type { Player } from '$lib/types';

	export let turn: string;
	export let player1: Player;
	export let player2: Player;
	let turnPlayerName = '???';
	let turnPlayer: 'player1' | 'player2' | undefined = undefined;
	$: {
		if (turn !== undefined && player1.name !== undefined && player2.name !== undefined) {
			turnPlayer = turn === player1.id ? 'player1' : 'player2';
			turnPlayerName = turn === player1.id ? player1.name : player2.name;
		} else {
			turnPlayerName = '???';
			turnPlayer = undefined;
		}
	}
</script>

<div class="game-turn">
	<span class="label">Current turn:</span>
	{turnPlayerName}
	<!-- {#if turnPlayerName !== undefined}
		<HeaderCoin player={turnPlayer} />
	{/if} -->
</div>

<style>
	.game-turn {
		display: flex;
		align-items: center;
		/* margin-right: -16px; */
		align-self: flex-start;
	}
	.label {
		opacity: 80%;
		margin-right: 1rem;
	}
</style>
