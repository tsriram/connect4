<script lang="ts">
  import GameTurnIndicator from '$lib/components/GameTurnIndicator.svelte';
  import GameTitle from '$lib/components/GameTitle.svelte';
  import type { Player } from '$lib/types';

  export let player1: Player;
  export let player2: Player;
  export let turn: string;
  export let currentUserId: string;
</script>

<div class="game-header">
  <GameTitle {player1} {player2} />
  <GameTurnIndicator {turn} {player1} {player2} {currentUserId} />
</div>

<style>
  .game-header {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    align-items: center;
    margin: 2rem 0;
    font-size: 1.5rem;
  }
  @media (min-width: 720px) {
    .game-header {
      flex-direction: row;
      justify-content: space-between;
      gap: revert;
    }
  }
</style>
