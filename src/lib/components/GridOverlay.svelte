<script lang="ts">
  import { browser } from '$app/environment';
  import { trackGameCompletion, trackShare } from '$lib/analytics';
  import Button from '$lib/components/Button.svelte';
  import LinkButton from '$lib/components/LinkButton.svelte';
  import SocialShare from '$lib/components/SocialShare.svelte';
  import { GAME_STATUS } from '$lib/types';
  import { playWinningCelebration } from '$lib/utils/sounds';
  import { getItem, setItem } from '$lib/utils/storage';
  import confetti from 'canvas-confetti';
  import { afterUpdate, beforeUpdate } from 'svelte';

  export let message: string;
  export let isWinner: boolean;
  export let gameStatus: GAME_STATUS;
  export let onRestart: () => void;
  export let slug: string | undefined;

  let showStartNewGame: boolean = false;
  let hasNativeShare: boolean = false;
  if (browser && Boolean(navigator.share)) {
    hasNativeShare = true;
  }
  const shareText =
    'Just claimed victory in an epic online Connect 4 battle! Play now on https://connect4.live 🏆🟡🔴';
  const shareUrl = 'https://connect4.live';
  const winningsKey = 'connect4:wins';

  beforeUpdate(() => {
    showStartNewGame = gameStatus === GAME_STATUS.PLAYER_DISCONNECTED;

    if (gameStatus === GAME_STATUS.COMPLETED) {
      if (isWinner) {
        message = 'Yay! you won 🎉🎉🎉';
      } else {
        message = 'Oops, you lost this game :(';
      }
    }
  });

  function share() {
    navigator
      .share({
        title: `Connect 4`,
        text: shareText,
        url: shareUrl
      })
      .then(trackShare)
      .catch((error) => console.log('Error sharing', error));
  }

  function celebrate() {
    if (!slug) {
      return;
    }
    const winsData = getItem(winningsKey);
    const wins: string[] = winsData ? JSON.parse(winsData) : [];
    if (wins && wins.includes(slug)) {
      return;
    }
    wins.push(slug);
    setItem(winningsKey, JSON.stringify(wins));
    playWinningCelebration();
    boom();
  }

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
      celebrate();
      trackGameCompletion();
    }
  });
</script>

<div class="grid-overlay">
  <h2>{message}</h2>
  {#if isWinner}
    {#if hasNativeShare}
      <Button on:click={share}>Tell the world!</Button>
    {:else}
      <h3>Share this with your friends!</h3>
      <SocialShare text={shareText} url={shareUrl} />
    {/if}
    <div class="divider" />
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
  .divider {
    width: 80%;
    height: 1px;
    background-color: #fff;
    margin: 1rem 0;
  }
</style>
