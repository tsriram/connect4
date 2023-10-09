<script lang="ts">
	import type { PageServerData } from './$types';
	import Game from '$lib/components/Game.svelte';
	export let data: PageServerData;
</script>

<div>
	<Game room={data.room} gameState={data.gameState} userid={data.userid} />
</div>
