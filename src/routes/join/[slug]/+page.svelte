<script>
	import DocumentTitle from '$lib/components/DocumentTitle.svelte';
	import GameForm from '$lib/components/GameForm.svelte';
	import { GameFormType } from '$lib/types';
	export let data;
</script>

<DocumentTitle title="Join game" />
<div>
	{#if data.player1Name}
		<p class="invite-text">
			Hello! {data.player1Name} has invited you to play Connect 4.
		</p>
	{/if}
	<GameForm type={GameFormType.JOIN} storedUserName={data.username} />
</div>

<style>
	.invite-text {
		font-size: 1.25rem;
		margin: 3rem 0;
	}
</style>
