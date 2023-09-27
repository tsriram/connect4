<script lang="ts">
	import type { PageServerData } from './$types';
	import PartySocket from 'partysocket';
	import { PUBLIC_PARTYKIT_HOST } from '$env/static/public';
	import { onMount, onDestroy } from 'svelte';
	import { MessageType, type GameState, GAME_STATUS } from '$lib/types';
	export let data: PageServerData;
	let socket: PartySocket;
	let socketClosed = false;
	let gameState: GameState;
	let username: '';

	function onMessage(event: MessageEvent) {
		console.log('onMessage: ', JSON.parse(event.data));
		console.log('onMessage socket.id: ', socket.id);
		gameState = JSON.parse(event.data);
	}

	function onClose(event: CloseEvent) {
		console.log('event: ', event);
		socketClosed = true;
		socket.close();
	}

	function startGame() {
		console.log('data.room: ', data.room);
		socket = new PartySocket({
			host: PUBLIC_PARTYKIT_HOST,
			room: data.room
		});

		socket.addEventListener('open', (event) => {
			const payload = {
				type: MessageType.JOIN,
				name: username
			};
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
</script>

<h1>Game page</h1>

<h2>Game status: {gameState?.message}</h2>

{#if socketClosed}
	<h2>Socket closed</h2>
{/if}
<input name="username" autofocus bind:value={username} />
<button on:click={startGame}>Start Game</button>

{#if gameState?.status === GAME_STATUS.PLAYING}
	<div class="grid">
		{#each gameState.board as row, rowIndex}
			{#each row as col, colIndex}
				<span class="cell" class:player1={col === 1} class:player2={col === 2}>
					<button on:click={() => handleClick(colIndex)}>
						{`${rowIndex}, ${colIndex} - ${col}`}
					</button>
				</span>
			{/each}
		{/each}
	</div>
{/if}

<style>
	.grid {
		display: grid;
		gap: 16px;
		grid-template-rows: repeat(6, 1fr);
		grid-template-columns: repeat(7, 80px);
	}
	.cell {
		background-color: grey;
		height: 80px;
		width: 80px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.cell.player1 {
		background-color: yellow;
	}
	.cell.player2 {
		background-color: red;
	}
</style>
