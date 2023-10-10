<script lang="ts">
	import { enhance } from '$app/forms';
	import { GameFormType } from '$lib/types';
	import Button from '$lib/components/Button.svelte';
	import { onMount } from 'svelte';
	import { getItem, setItem } from '$lib/utils/storage';
	export let type: GameFormType;

	const nameStorageKey = 'connect4:username';

	const newGameAction = '?/new';
	const joinGameAction = '?/join';
	let storedUserName: string;
	const formAction = type === GameFormType.START ? newGameAction : joinGameAction;
	const buttonLabel = type === GameFormType.START ? 'Start a new game' : 'Join game';
	let submitting = false;
	let submittingLabel = '';
	$: {
		if (submitting) {
			submittingLabel = type === GameFormType.START ? 'Starting a new game...' : 'Joining game...';
		}
	}

	onMount(() => {
		storedUserName = getItem(nameStorageKey) || '';
	});
</script>

<div class="container">
	<!-- <header>
		<img class="logo" src={logo} alt="logo" />
	</header> -->
	<div class="container">
		<form
			class="game-form"
			action={formAction}
			method="post"
			use:enhance={() => {
				submitting = true;
				setItem(nameStorageKey, storedUserName);
				return async ({ update }) => {
					update();
					submitting = false;
				};
			}}
		>
			<label for="username">Enter your name: </label>
			<!-- svelte-ignore a11y-autofocus -->
			<input
				class="username-input"
				id="username"
				name="username"
				autofocus
				required
				aria-required="true"
				bind:value={storedUserName}
			/>

			<Button>{submitting ? submittingLabel : buttonLabel}</Button>
		</form>
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.game-form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		font-size: 1.25rem;
		align-items: center;
	}

	label {
		align-self: flex-start;
	}

	.username-input {
		font-size: 1.5rem;
		padding: 8px;
	}
</style>
