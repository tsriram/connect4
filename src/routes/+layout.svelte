<script lang="ts">
	import InitialThemeSetter from '$lib/components/InitialThemeSetter.svelte';
	import ThemeSelector from '$lib/components/ThemeSelector.svelte';
	import Logo from '$lib/components/Logo.svelte';
	import '../styles/global.css';
</script>

<InitialThemeSetter />
<div class="wrapper">
	<header class="header">
		<div class="logo-container">
			<Logo />
		</div>
		<div class="theme-selector-container">
			<ThemeSelector />
		</div>
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
		max-width: 784px;
		margin: auto;
		padding: 0 2rem;
	}
	.header {
		margin: 2rem 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
	}
	.logo-container {
		/* for visual alignment */
		margin-left: -12px;
	}
	.theme-selector-container {
		/* for visual alignment */
		margin-right: -8px;
	}
	.middle {
		display: flex;
		flex: 1;
	}
	footer {
		display: flex;
		padding: 1rem;
		align-items: center;
		justify-content: center;
		margin-top: 4rem;
	}
</style>
