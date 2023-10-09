<script lang="ts">
	import Logo from '$lib/components/Logo.svelte';
	import '../styles/global.css';
</script>

<div class="wrapper">
	<header class="header">
		<Logo />
	</header>
	<section class="middle">
		<slot />
	</section>
	<footer>&copy; Sriram</footer>
</div>

<style>
	.wrapper {
		display: flex;
		flex-direction: column;
		min-height: 100%;
		align-items: center;
	}
	.header {
		margin: 2rem 0;
	}
	.middle {
		display: flex;
		flex: 1;
		margin: auto;
		padding: 0 2rem;
	}
	footer {
		display: flex;
		padding: 1rem;
		align-items: center;
		justify-content: center;
		margin-top: 4rem;
	}
</style>
