<script lang="ts">
	import HeaderCoin from '$lib/components/HeaderCoin.svelte';
	import type { Player } from '$lib/types';

	export let player1: Player;
	export let player2: Player;
</script>

<div class="game-title">
	<!-- <HeaderCoin player="player1" /> -->
	{player1.name}&nbsp;vs&nbsp;{player2.name ?? '???'}
	<!-- <HeaderCoin player="player2" /> -->
</div>

<style>
	.game-title {
		display: flex;
		align-items: center;
		/* hack for visual alignment */
		margin-top: 8px;
	}
</style>
