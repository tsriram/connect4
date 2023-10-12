<script lang="ts">
	import GameBoard from '$lib/components/GameBoard.svelte';
	import GameHeader from '$lib/components/GameHeader.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { MessageType, type GameState, type SlugData, GAME_STATUS } from '$lib/types';
	import PartySocket from 'partysocket';
	import { PUBLIC_PARTYKIT_HOST } from '$env/static/public';
	import { spring, type Spring } from 'svelte/motion';
	import ShareGameInfobox from '$lib/components/ShareGameInfobox.svelte';
	import { trackGameRestart } from '$lib/analytics';

	export let gameState: GameState;
	export let room: string;
	export let userid: string;

	let socket: PartySocket;
	let socketDisconnected = false;
	let transformSpring: Spring<number>;
	// default to 80px (desktop size)
	let rowSize = 80;
	let rowGap = 20;
	onMount(() => {
		try {
			const grid = document.querySelector('.grid');
			if (grid) {
				rowSize = parseInt(getComputedStyle(grid).getPropertyValue('--column-size'));
				rowGap = parseInt(getComputedStyle(grid).getPropertyValue('--row-gap'));
			}
		} catch {
			console.error('Error setting row size');
		}
	});

	function restartGame() {
		socket.send(
			JSON.stringify({
				type: MessageType.RESTART
			})
		);
		trackGameRestart();
	}

	function onMessage(event: MessageEvent) {
		gameState = JSON.parse(event.data);

		if (gameState.newCoinCol !== null && gameState.newCoinRow !== null) {
			// get the row to which the new coin was added
			const position = (gameState.newCoinRow + 1) * (rowSize + rowGap) * -1;
			transformSpring = spring(position, { stiffness: 0.1, damping: 0.6 });
			transformSpring.set(0);
		}
	}

	function onClose(event: CloseEvent) {
		socketDisconnected = true;
	}

	function onOpen() {
		socketDisconnected = false;
	}

	function startGame() {
		// gameState = gameState;
		socket = new PartySocket({
			host: PUBLIC_PARTYKIT_HOST,
			room: room,
			id: userid
		});

		socket.addEventListener('message', onMessage);

		socket.addEventListener('close', onClose);

		socket.addEventListener('open', onOpen);
	}

	onDestroy(() => {
		if (socket) {
			socket.removeEventListener('message', onMessage);
			socket.removeEventListener('close', onClose);
			socket.removeEventListener('open', onOpen);
		}
	});

	function handleClick(colIndex: number) {
		const payload = {
			type: MessageType.UPDATE,
			colIndex
		};

		socket.send(JSON.stringify(payload));
	}

	startGame();
</script>

<div>
	<GameHeader
		player1={gameState.player1}
		player2={gameState.player2}
		turn={gameState.waitingFor || '???'}
	/>
	{#if gameState.status === GAME_STATUS.WAITING_FOR_PLAYER2}
		<ShareGameInfobox />
	{/if}
	<GameBoard
		{gameState}
		{socketDisconnected}
		{handleClick}
		currentUserId={socket.id}
		onRestart={restartGame}
		{transformSpring}
	/>
</div>
