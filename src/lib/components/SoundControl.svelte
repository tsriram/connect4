<script lang="ts">
  import { getItem, setItem } from '$lib/utils/storage';
  import SpeakerWave from '$lib/components/icons/SpeakerWave.svelte';
  import SpeakerMute from '$lib/components/icons/SpeakerMute.svelte';
  import { browser } from '$app/environment';
  import { SOUND_KEY } from '$lib/constants';
  import { soundEnabled } from '$lib/store';
  import { playSoundOn } from '$lib/utils/sounds';

  let resolvedSoundPreference: string;

  if (browser) {
    const userSoundPreference = getItem(SOUND_KEY);
    if (userSoundPreference) {
      resolvedSoundPreference = userSoundPreference;
    } else {
      resolvedSoundPreference = 'true';
    }
    updateStore();
  }

  function updateStore() {
    const isSoundEnabled = resolvedSoundPreference === 'true' ? true : false;
    soundEnabled.set(isSoundEnabled);
  }

  function toggleSound() {
    resolvedSoundPreference = resolvedSoundPreference === 'true' ? 'false' : 'true';
    try {
      setItem(SOUND_KEY, resolvedSoundPreference);
      updateStore();
      playSoundOn();
    } catch (e) {
      // ignore
    }
  }
</script>

{#if resolvedSoundPreference !== undefined}
  <button class="btn-toggle-sound" on:click={toggleSound} title="Toggle sound">
    {#if resolvedSoundPreference === 'true'}
      <SpeakerWave />
    {:else}
      <SpeakerMute />
    {/if}
  </button>
{/if}

<style>
  .btn-toggle-sound {
    background: none;
    border: none;
    width: 2rem;
    padding: 0;
    cursor: pointer;
    margin-right: 1rem;
  }
  .btn-toggle-sound:active {
    background-color: transparent;
  }
</style>
