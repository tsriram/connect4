<script lang="ts">
	import GameBoard from '$lib/components/GameBoard.svelte';
	import GameHeader from '$lib/components/GameHeader.svelte';
	import { onDestroy } from 'svelte';
	import { MessageType, type GameState, type SlugData, GAME_STATUS } from '$lib/types';
	import PartySocket from 'partysocket';
	import { PUBLIC_PARTYKIT_HOST } from '$env/static/public';

	export let gameState: GameState;
	export let room: string;
	export let userid: string;

	let socket: PartySocket;
	let socketDisconnected = false;

	function restartGame() {
		console.log('restarting game');
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

		// if (gameState.newCoinCol !== null && gameState.newCoinRow !== null) {
		// 	// get the row to which the new coin was added
		// 	const position = (gameState.newCoinRow + 1) * (80 + 16) * -1;
		// 	console.log('position: ', position);
		// 	transformSpring = spring(position, { stiffness: 0.1, damping: 0.6 });
		// 	console.log('transformSpring: ', transformSpring);
		// 	transformSpring.set(0);
		// }
	}

	function onClose(event: CloseEvent) {
		console.log('event: ', event);
		socketDisconnected = true;
	}

	function startGame() {
		// gameState = gameState;
		socket = new PartySocket({
			host: PUBLIC_PARTYKIT_HOST,
			room: room,
			id: userid
		});

		// socket.addEventListener('open', (event) => {
		// 	console.log('socket open listener');
		// 	const username = gameState.player1?.name === undefined ? slugData.player1 : slugData.player2;
		// 	console.log('gameState.player1.name: ', gameState.player1?.name);
		// 	const payload = {
		// 		type: MessageType.JOIN,
		// 		name: username
		// 	};
		// 	console.log('payload: ', JSON.stringify(payload));
		// 	socket.send(JSON.stringify(payload));
		// 	socketDisconnected = false;
		// });

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

	startGame();
</script>

<div>
	<GameHeader
		player1={gameState.player1}
		player2={gameState.player2}
		turn={gameState.waitingFor || '???'}
	/>
	<GameBoard
		{gameState}
		{socketDisconnected}
		{handleClick}
		currentUserId={socket.id}
		onRestart={restartGame}
	/>
	<!-- <GameTurnIndicator /> -->
</div>
