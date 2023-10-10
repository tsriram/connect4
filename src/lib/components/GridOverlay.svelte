<script lang="ts">
	import Button from '$lib/components/Button.svelte';
	import confetti from 'canvas-confetti';
	import { afterUpdate } from 'svelte';

	export let message: string;
	export let showRestartButton: boolean = false;
	export let onRestart: () => void;
	export let isWinner: boolean;
	export let showStartNewGame: boolean = false;

	function boom() {
		confetti({
			particleCount: 150,
			disableForReducedMotion: true,
			angle: 45,
			origin: {
				x: 0,
				y: 0.5
			}
		});
		confetti({
			particleCount: 150,
			disableForReducedMotion: true,
			angle: 135,
			origin: {
				x: 1,
				y: 0.5
			}
		});
	}

	afterUpdate(() => {
		if (isWinner) {
			boom();
		}
	});
</script>

<div class="grid-overlay">
	<h2>{message}</h2>
	{#if showRestartButton}
		<Button onClick={onRestart}>Restart game</Button>
	{/if}
	{#if showStartNewGame}
		<a href="/" class="start-game">Or start a new game?</a>
	{/if}
</div>

<style>
	.grid-overlay {
		position: absolute;
		background-color: hsl(0deg 0% 0% / 70%);
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: #fff;
	}
	.start-game {
		margin-top: 2rem;
		color: #fff;
		font-size: 1.25rem;
	}
</style>
