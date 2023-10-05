<script lang="ts">
	import { enhance } from '$app/forms';
	import { GameFormType } from '$lib/types';
	import logo from '$lib/images/connect4-logo-light.png';
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
			<input class="username-input" id="username" name="username" autofocus />

			<button class="submit-btn" type="submit">{submitting ? submittingLabel : buttonLabel}</button>
		</form>
	</div>
</div>

<style>
	.logo {
		width: 400px;
	}
	header {
		padding: 2rem;
	}
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
	}
	/* CSS */
	.submit-btn {
		margin-top: 1rem;
		background-color: #111827;
		border: 1px solid transparent;
		border-radius: 0.75rem;
		box-sizing: border-box;
		color: #ffffff;
		cursor: pointer;
		flex: 0 0 auto;
		font-family: 'Inter var', ui-sans-serif, system-ui, -apple-system, system-ui, 'Segoe UI', Roboto,
			'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
			'Segoe UI Symbol', 'Noto Color Emoji';
		font-size: 1.125rem;
		font-weight: 600;
		line-height: 1.5rem;
		padding: 0.75rem 1.2rem;
		text-align: center;
		text-decoration: none #6b7280 solid;
		text-decoration-thickness: auto;
		transition-duration: 0.2s;
		transition-property: background-color, border-color, color, fill, stroke;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		user-select: none;
		-webkit-user-select: none;
		touch-action: manipulation;
		width: auto;
	}

	.submit-btn:hover {
		background-color: #374151;
	}

	.submit-btn:focus {
		box-shadow: none;
		outline: 2px solid transparent;
		outline-offset: 2px;
	}

	@media (min-width: 768px) {
		.submit-btn {
			padding: 0.75rem 1.5rem;
		}
	}
</style>
