<script lang="ts">
  import DocumentTitle from '$lib/components/DocumentTitle.svelte';
  import GameForm from '$lib/components/GameForm.svelte';
  import type { PageServerData } from './$types';
  import { GameFormType } from '$lib/types';

  export let data: PageServerData;
</script>

<DocumentTitle title="Home" />
<div>
  <p class="help-text">
    <a href="https://en.wikipedia.org/wiki/Connect_Four" rel="noopener" target="_blank"
      >What's Connect 4?</a
    >
  </p>
  <GameForm type={GameFormType.START} storedUserName={data.username} />
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
