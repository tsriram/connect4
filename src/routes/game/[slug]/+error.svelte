<script lang="ts">
  import { page } from '$app/stores';
  import GameNotAllowed from '$lib/components/GameNotAllowed.svelte';
  import InvalidGameSlug from '$lib/components/InvalidGameSlug.svelte';
</script>

<div>
  {#if $page.status === 404}
    <InvalidGameSlug />
  {:else if $page.status === 409}
    <GameNotAllowed />
  {:else}
    <h1>Error loading game :(</h1>
  {/if}
</div>
