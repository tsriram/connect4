<script lang="ts">
	import '../styles/global.css';
</script>

<div class="wrapper">
	<!-- <header class="header">Header</header> -->
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
	}
	.middle {
		display: flex;
		flex: 1;
		margin: auto;
	}
	footer {
		display: flex;
		padding: 1rem;
		align-items: center;
		justify-content: center;
	}
</style>
