<script>
	import GameForm from '$lib/components/GameForm.svelte';
	import { GameFormType } from '$lib/types';
</script>

<div>
	<p class="help-text">
		<a href="https://en.wikipedia.org/wiki/Connect_Four" rel="noopener" target="_blank"
			>What's Connect 4?</a
		>
	</p>
	<GameForm type={GameFormType.START} />
</div>

<style>
	.help-text {
		font-size: 90%;
		text-align: center;
		margin-bottom: 6rem;
	}

	.help-text a {
		color: var(--text-color);
		text-decoration: none;
	}
	.help-text a:hover {
		text-decoration: underline;
	}
</style>
