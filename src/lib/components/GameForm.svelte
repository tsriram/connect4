<script lang="ts">
	import { enhance } from '$app/forms';
	import { GameFormType } from '$lib/types';
	import Button from '$lib/components/Button.svelte';
	export let type: GameFormType;

	const newGameAction = '?/new';
	const joinGameAction = '?/join';
	const formAction = type === GameFormType.START ? newGameAction : joinGameAction;
	const buttonLabel = type === GameFormType.START ? 'Start a new game' : 'Join game';
	let submitting = false;
	let submittingLabel = '';
	$: {
		if (submitting) {
			submittingLabel = type === GameFormType.START ? 'Starting a new game...' : 'Joining game...';
		}
	}
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
			/>

			<!-- <button class="submit-btn" type="submit">{submitting ? submittingLabel : buttonLabel}</button> -->
			<Button type="submit">{submitting ? submittingLabel : buttonLabel}</Button>
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
