<script lang="ts">
	import GridOverlay from '$lib/components/GridOverlay.svelte';
	import { GAME_STATUS, type GameState } from '$lib/types';
	import { beforeUpdate } from 'svelte';

	import type { Spring } from 'svelte/motion';

	export let gameState: GameState;
	export let socketDisconnected = false;
	export let currentUserId: string;

	export let handleClick: (colIndex: number) => void;

	export let transformSpring: Spring<number>;

	let showOverlay: boolean = false;
	let isMyTurn = true;
	let isWinner = false;
	$: isMyTurn = gameState.waitingFor === currentUserId;
	beforeUpdate(() => {
		showOverlay =
			gameState.status === GAME_STATUS.COMPLETED ||
			gameState.status === GAME_STATUS.PLAYER_DISCONNECTED ||
			gameState.status === GAME_STATUS.WAITING_FOR_PLAYER2 ||
			socketDisconnected;
		isWinner = gameState.winner === currentUserId;
	});
</script>

<div>
	{#if socketDisconnected}
		<h2>Disconnected from the server. Trying to reconnect...</h2>
	{/if}
	{#if gameState?.status != GAME_STATUS.INITIAL}
		<div class="grid" style="cursor: {isMyTurn ? 'default' : 'not-allowed'};">
			{#each gameState.board as row, rowIndex}
				{#each row as col, colIndex}
					<button class="cell-button" on:click={() => handleClick(colIndex)}>
						<span
							class="cell"
							class:player1={col === 1}
							class:player2={col === 2}
							style="cursor: {isMyTurn ? 'pointer' : 'not-allowed'};"
						>
							<!-- {`${rowIndex}, ${colIndex} - ${col}`} -->
							{#if col === 1}
								{#if rowIndex === gameState.newCoinRow && colIndex === gameState.newCoinCol}
									<span class="coin player1" style="transform: translateY({$transformSpring}px);" />
									<!-- <span class="coin player1" /> -->
								{:else}
									<span class="coin player1" />
								{/if}
							{:else if col === 2}
								{#if rowIndex === gameState.newCoinRow && colIndex === gameState.newCoinCol}
									<span class="coin player2" style="transform: translateY({$transformSpring}px);" />
									<!-- <span class="coin player2" /> -->
								{:else}
									<span class="coin player2" />
								{/if}
							{/if}
						</span>
					</button>
				{/each}
			{/each}
			{#if showOverlay}
				<GridOverlay message={gameState.message} {isWinner} gameStatus={gameState.status} />
			{/if}
		</div>
	{/if}
</div>

<style>
	.grid {
		--column-gap: 12px;
		--row-gap: 20px;
		--grid-padding: 16px;
		--column-size: 32px;
		display: grid;
		padding: var(--grid-padding);
		width: fit-content;
		row-gap: var(--row-gap);
		column-gap: var(--column-gap);
		background-color: var(--board-bg-color);
		grid-template-rows: repeat(6, 1fr);
		grid-template-columns: repeat(7, var(--column-size));
		position: relative;
		box-shadow: 0px 0px 4px 4px var(--grid-border-color);
		border-radius: 8px;
	}
	@media (min-width: 720px) {
		.grid {
			--column-gap: 16px;
			--row-gap: 20px;
			--grid-padding: 32px;
			--column-size: 80px;
		}
	}
	.cell-button {
		padding: 0;
		margin: 0;
		background: transparent;
		border: none;
		cursor: pointer;
	}
	.cell {
		background-color: var(--cell-bg-color);
		height: var(--column-size);
		width: var(--column-size);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.coin.player1 {
		background-color: var(--player1-color);
		border-color: var(--player1-border-color);
		background-image: conic-gradient(
			var(--player1-color),
			var(--player1-border-color),
			var(--player1-color),
			var(--player1-border-color),
			var(--player1-color),
			var(--player1-border-color),
			var(--player1-color),
			var(--player1-border-color),
			var(--player1-color),
			var(--player1-border-color),
			var(--player1-color)
		);
	}
	.coin.player2 {
		background-color: var(--player2-color);
		border-color: var(--player2-border-color);
		background-image: conic-gradient(
			var(--player2-color),
			var(--player2-border-color),
			var(--player2-color),
			var(--player2-border-color),
			var(--player2-color),
			var(--player2-border-color),
			var(--player2-color),
			var(--player2-border-color),
			var(--player2-color),
			var(--player2-border-color),
			var(--player2-color)
		);
	}
	.coin {
		height: var(--column-size);
		width: var(--column-size);
		border-radius: 50%;
		position: absolute;
		display: inline-block;
		border: 4px solid;
	}
</style>
