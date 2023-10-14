<script lang="ts">
  import { browser } from '$app/environment';
  import { trackShare } from '$lib/analytics';
  import Button from '$lib/components/Button.svelte';
  let url = '';
  let copyButtonLabel = 'Copy';
  let showShareButton = false;
  if (browser) {
    Boolean(navigator.share);
  }

  if (browser) {
    url = window.location.toString();
  }
  function onCopyClick() {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        copyButtonLabel = 'Copied';
        setTimeout(() => {
          copyButtonLabel = 'Copy';
        }, 3000);
      })
      .catch(function (err) {
        console.error('Unable to copy text: ', err);
      });
  }

  function share() {
    if (navigator.share) {
      navigator
        .share({
          title: 'Connect 4',
          text: `Hey! Let's play Connect 4 online?`,
          url: window.location.toString()
        })
        .then(trackShare)
        .catch((error) => console.log('Error sharing', error));
    } else {
      console.log('NO SHARE');
    }
  }
</script>

{#if showShareButton}
  <div class="native-share-container">
    <Button on:click={share}>Share link with a friend to play!</Button>
  </div>
{:else}
  <div class="info-container">
    <h4>Share this link with your friend to start playing:</h4>
    <p class="info">
      <span class="url">{url}</span>
      <button class="copy-btn" on:click={onCopyClick}>{copyButtonLabel}</button>
    </p>
  </div>
{/if}

<style>
  .native-share-container {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 2rem 0;
  }
  .info-container {
    background-color: var(--info-box-bg-color);
    color: var(--info-box-text-color);
    padding: 1rem;
    margin: 1rem 0;
    border-radius: 8px;
  }
  @media (max-width: 400px) {
    .info {
      flex-direction: column;
    }
  }
  .info {
    display: flex;
    align-items: baseline;
    justify-content: flex-start;
    gap: 1rem;
  }
  .copy-btn {
    margin: 0;
    margin-top: 1rem;
    padding: 4px 8px;
    background-color: var(--button-bg-color);
    color: var(--text-color);

    border: 2px solid var(--grid-border-color);
    cursor: pointer;
  }
  .url {
    font-size: 90%;
    text-decoration: underline;
  }
</style>
