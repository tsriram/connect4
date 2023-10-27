<script lang="ts">
  import DocumentTitle from '$lib/components/DocumentTitle.svelte';
  import GameForm from '$lib/components/GameForm.svelte';
  import type { PageServerData } from './$types';
  import { GameFormType } from '$lib/types';

  export let data: PageServerData;
</script>

<DocumentTitle title="Home" />
<div>
  <GameForm type={GameFormType.START} storedUserName={data.username} />
  <div class="help-text">
    <h5>What's Connect 4?</h5>
    <p>
      <span>
        Connect 4 is a game in which the players choose a color and then take turns dropping colored
        coins into a six-row, seven-column grid. The pieces fall straight down, occupying the lowest
        available space within the column. The objective of the game is to be the first to form a
        horizontal, vertical, or diagonal line of four of one's own coins.
      </span>
      <a
        href="https://en.wikipedia.org/wiki/Connect_Four"
        rel="noopener"
        target="_blank"
        aria-label="Link to Wikipedia page on Connect 4 game">Read more on Wikipedia</a
      >
    </p>
  </div>
</div>

<style>
  .help-text {
    line-height: 1.5;
    text-align: justify;
    margin-top: 6rem;
  }

  .help-text a {
    color: var(--help-text-color);
    text-decoration: none;
  }
  .help-text a:hover {
    text-decoration: underline;
  }
</style>
