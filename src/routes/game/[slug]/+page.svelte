<script lang="ts">
	import type { PageServerData } from './$types';
	import PartySocket from 'partysocket';
	import { PUBLIC_PARTYKIT_HOST } from '$env/static/public';
	import { onMount, onDestroy, beforeUpdate } from 'svelte';
	import { spring } from 'svelte/motion';
	import { MessageType, type GameState, GAME_STATUS } from '$lib/types';
	// import GetUserName from '$lib/components/GetUserName.svelte';
	export let data: PageServerData;
	let socket: PartySocket;
	let socketClosed = false;
	let transformSpring;
	let gameState: GameState = {
		newCoinCol: null,
		newCoinRow: null,
		message: '',
		status: GAME_STATUS.INITIAL,
		board: [],
		player1: {
			id: undefined,
			name: undefined
		},
		player2: {
			id: undefined,
			name: undefined
		},
		waitingFor: undefined,
		winner: undefined
	};
	let username: '';

	function restartGame() {
		socket.send(
			JSON.stringify({
				type: MessageType.RESTART
			})
		);
	}

	function onMessage(event: MessageEvent) {
		console.log('onMessage: ', JSON.parse(event.data));
		console.log('onMessage socket.id: ', socket.id);
		gameState = JSON.parse(event.data);

		if (gameState.newCoinCol !== null && gameState.newCoinRow !== null) {
			// get the row to which the new coin was added
			const position = (gameState.newCoinRow + 1) * (80 + 16) * -1;
			console.log('position: ', position);
			transformSpring = spring(position, { stiffness: 0.1, damping: 0.6 });
			console.log('transformSpring: ', transformSpring);
			transformSpring.set(0);
		}
	}

	function onClose(event: CloseEvent) {
		console.log('event: ', event);
		socketClosed = true;
		socket.close();
	}

	function startGame() {
		console.log('data.room: ', data);
		gameState = data.gameState;
		socket = new PartySocket({
			host: PUBLIC_PARTYKIT_HOST,
			room: data.room
		});

		socket.addEventListener('open', (event) => {
			const username =
				gameState.player1.name === undefined ? data.slugData.player1 : data.slugData.player2;
			console.log('gameState.player1.name: ', gameState.player1.name);
			const payload = {
				type: MessageType.JOIN,
				name: username
			};
			console.log('payload: ', JSON.stringify(payload));
			socket.send(JSON.stringify(payload));
		});

		socket.addEventListener('message', onMessage);

		socket.addEventListener('close', onClose);
	}

	onDestroy(() => {
		if (socket) {
			socket.removeEventListener('message', onMessage);
			socket.removeEventListener('close', onClose);
		}
	});

	function handleClick(colIndex: number) {
		const payload = {
			type: MessageType.UPDATE,
			colIndex
		};

		socket.send(JSON.stringify(payload));
	}

	let showOverlay = false;
	beforeUpdate(() => {
		showOverlay =
			gameState.status === GAME_STATUS.COMPLETED ||
			gameState.status === GAME_STATUS.PLAYER_DISCONNECTED ||
			gameState.status === GAME_STATUS.WAITING_FOR_PLAYER2;
	});

	console.log('showOverlay: ', showOverlay);
	console.log('gameState: ', gameState);
	startGame();
</script>

<div class="game-container">
	<h1>Connect4</h1>

	{#if gameState?.status === GAME_STATUS.PLAYING}
		<h2>{gameState.message}</h2>
	{/if}

	{#if socketClosed}
		<h2>Socket closed</h2>
	{/if}

	<!-- <input name="username" bind:value={username} />
	<button on:click={startGame}>Start Game</button> -->
	<!-- <GetUserName {gameState} onSubmit={startGame} /> -->
	{#if gameState.status === GAME_STATUS.COMPLETED}
		<button on:click={restartGame}>Restart Game</button>
	{/if}

	{#if gameState?.status != GAME_STATUS.INITIAL}
		<div class="grid">
			{#if showOverlay}
				<div class="grid-overlay">
					<h2>{gameState.message}</h2>
				</div>
			{/if}
			{#each gameState.board as row, rowIndex}
				{#each row as col, colIndex}
					<button class="cell-button" on:click={() => handleClick(colIndex)}>
						<span class="cell" class:player1={col === 1} class:player2={col === 2}>
							<!-- {`${rowIndex}, ${colIndex} - ${col}`} -->
							{#if col === 1}
								{#if rowIndex === gameState.newCoinRow && colIndex === gameState.newCoinCol}
									<span class="coin player1" style="transform: translateY({$transformSpring}px);" />
								{:else}
									<span class="coin player1" />
								{/if}
							{:else if col === 2}
								{#if rowIndex === gameState.newCoinRow && colIndex === gameState.newCoinCol}
									<span class="coin player2" style="transform: translateY({$transformSpring}px);" />
								{:else}
									<span class="coin player2" />
								{/if}
							{/if}
						</span>
					</button>
				{/each}
			{/each}
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
	.grid-overlay {
		position: absolute;
		background-color: hsl(0deg 0% 0% / 40%);
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		pointer-events: none;
		display: flex;
		align-items: center;
		justify-content: center;
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
		background-color: yellow;
	}
	.coin.player2 {
		background-color: red;
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
