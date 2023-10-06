<script lang="ts">
	import GridOverlay from '$lib/components/GridOverlay.svelte';
	import { GAME_STATUS, type GameState } from '$lib/types';
	import { beforeUpdate } from 'svelte';

	import { spring } from 'svelte/motion';

	export let gameState: GameState;
	export let socketDisconnected = false;
	export let currentUserId: string;

	export let handleClick: (colIndex: number) => void;
	export let onRestart: () => void;

	// let transformSpring;
	// let transformSpring = spring(80, { stiffness: 0.1, damping: 0.6 });

	let showOverlay: boolean = false;
	let showRestartButton: boolean = false;
	let isMyTurn = true;
	$: isMyTurn = gameState.waitingFor === currentUserId;
	// let overlayMessage = ""
	beforeUpdate(() => {
		// const isPlayerDisconnected = !(gameState.player1.connected && gameState.player2.connected)
		// if (isPlayerDisconnected) {
		// 	overlayMessage = ''
		// 	showOverlay = true;
		// 	console.log('showOverlay: ', showOverlay);
		// }
		showOverlay =
			gameState.status === GAME_STATUS.COMPLETED ||
			gameState.status === GAME_STATUS.PLAYER_DISCONNECTED ||
			gameState.status === GAME_STATUS.WAITING_FOR_PLAYER2;
		showRestartButton = gameState.status === GAME_STATUS.COMPLETED;
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
									<!-- <span class="coin player1" style="transform: translateY({$transformSpring}px);" /> -->
									<span class="coin player1" />
								{:else}
									<span class="coin player1" />
								{/if}
							{:else if col === 2}
								{#if rowIndex === gameState.newCoinRow && colIndex === gameState.newCoinCol}
									<!-- <span class="coin player2" style="transform: translateY({$transformSpring}px);" /> -->
									<span class="coin player2" />
								{:else}
									<span class="coin player2" />
								{/if}
							{/if}
						</span>
					</button>
				{/each}
			{/each}
			{#if showOverlay}
				<GridOverlay message={gameState.message} {showRestartButton} {onRestart} />
			{/if}
		</div>
	{/if}
</div>

<style>
	.grid {
		display: grid;
		padding: 32px;
		width: fit-content;
		row-gap: 20px;
		column-gap: 16px;
		background-color: bisque;
		grid-template-rows: repeat(6, 1fr);
		grid-template-columns: repeat(7, 80px);
		position: relative;
	}
	.cell-button {
		padding: 0;
		margin: 0;
		background: transparent;
		border: none;
		cursor: pointer;
	}
	.cell {
		background-color: white;
		height: 80px;
		width: 80px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.coin.player1 {
		background-color: var(--player1-color);
	}
	.coin.player2 {
		background-color: var(--player2-color);
	}
	.coin {
		height: 80px;
		width: 80px;
		border-radius: 50%;
		background-color: hotpink;
		position: absolute;
		display: inline-block;
		/* animation-name: fall-animation;
		animation-duration: 400ms;
		animation-timing-function: ease-in-out; */
		border: 2px dashed;
	}
</style>
