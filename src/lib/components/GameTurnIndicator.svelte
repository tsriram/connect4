<script lang="ts">
  import HeaderCoin from '$lib/components/HeaderCoin.svelte';
  import type { Player } from '$lib/types';

  export let turn: string;
  export let player1: Player;
  export let player2: Player;
  export let currentUserId: string;
  let turnPlayerName = '???';
  let turnInfo = '';
  $: {
    if (turn !== undefined && player1.name !== undefined && player2.name !== undefined) {
      turnPlayerName = turn === player1.id ? player1.name : player2.name;
      turnInfo = turn === currentUserId ? 'Your turn' : `${turnPlayerName}'s turn`;
    }
  }
</script>

<div class="game-turn">
  {turnInfo}
</div>

<style>
  .game-turn {
    display: flex;
    align-items: center;
  }
</style>
