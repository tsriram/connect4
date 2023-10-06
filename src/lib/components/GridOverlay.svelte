<script lang="ts">
	export let message: string;
	export let showRestartButton: boolean = false;
	export let onRestart: () => void;
</script>

<div class="grid-overlay">
	<h2>{message}</h2>
	{#if showRestartButton}
		<button on:click={onRestart}>Restart game</button>
	{/if}
</div>

<style>
	.grid-overlay {
		position: absolute;
		background-color: hsl(0deg 0% 0% / 40%);
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
</style>
