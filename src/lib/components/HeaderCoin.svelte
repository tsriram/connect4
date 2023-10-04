<script lang="ts">
	export let player: 'player1' | 'player2' | undefined;
</script>

{#if player === 'player1'}
	<div class="header-coin player1" />
{:else if player === 'player2'}
	<div class="header-coin player2" />
{/if}

<style>
	.header-coin {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		margin: 0 16px;
	}
	.header-coin.player1 {
		background-color: var(--player1-color);
	}
	.header-coin.player2 {
		background-color: var(--player2-color);
	}
</style>
