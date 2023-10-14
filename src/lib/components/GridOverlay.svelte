<script lang="ts">
  import { trackGameCompletion } from '$lib/analytics';
  import Button from '$lib/components/Button.svelte';
  import LinkButton from '$lib/components/LinkButton.svelte';
  import { GAME_STATUS } from '$lib/types';
  import { playWinningCelebration } from '$lib/utils/sounds';
  import confetti from 'canvas-confetti';
  import { afterUpdate, beforeUpdate } from 'svelte';

  let showRestartButton: boolean = false;
  let showStartNewGame: boolean = false;

  export let message: string;
  export let isWinner: boolean;
  export let gameStatus: GAME_STATUS;
  export let onRestart: () => void;

  beforeUpdate(() => {
    showRestartButton = gameStatus === GAME_STATUS.COMPLETED;
    showStartNewGame = gameStatus === GAME_STATUS.PLAYER_DISCONNECTED;

    if (gameStatus === GAME_STATUS.COMPLETED) {
      if (isWinner) {
        message = 'Yay! you won 🎉🎉🎉';
      } else {
        message = 'Oops, you lost this game :(';
      }
    }
  });

  function boom() {
    confetti({
      particleCount: 150,
      disableForReducedMotion: true,
      angle: 45,
      origin: {
        x: 0,
        y: 0.5
      }
    });
    confetti({
      particleCount: 150,
      disableForReducedMotion: true,
      angle: 135,
      origin: {
        x: 1,
        y: 0.5
      }
    });
  }

  afterUpdate(() => {
    if (isWinner) {
      boom();
      playWinningCelebration();
      trackGameCompletion();
    }
  });
</script>

<div class="grid-overlay">
  <h2>{message}</h2>
  {#if showRestartButton}
    <Button on:click={onRestart}>Play again</Button>
  {/if}
  {#if showStartNewGame}
    <a href="/" class="start-game">Or start a new game?</a>
  {/if}
</div>

<style>
  .grid-overlay {
    position: absolute;
    background-color: hsl(0deg 0% 0% / 70%);
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #fff;
  }
  .grid-overlay h2 {
    text-align: center;
  }
  .start-game {
    margin-top: 2rem;
    color: #fff;
    font-size: 1.25rem;
  }
</style>
