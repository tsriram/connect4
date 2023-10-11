<script lang="ts">
	import type { PageServerData } from './$types';
	import Game from '$lib/components/Game.svelte';
	import DocumentTitle from '$lib/components/DocumentTitle.svelte';
	export let data: PageServerData;
</script>

<DocumentTitle title="Game" />
<div>
	<Game room={data.room} gameState={data.gameState} userid={data.userid} />
</div>
