<script>
	import StartGame from '$lib/components/StartGame.svelte';
</script>

<div class="container">
	<header>
		<h1>Connect4</h1>
	</header>
	<div class="container">
		<StartGame />
	</div>
</div>

<style>
	header {
		padding: 2rem;
	}
	.container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
</style>
