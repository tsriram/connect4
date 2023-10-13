<script lang="ts">
  import { getItem, setItem } from '$lib/utils/storage';
  import Moon from '$lib/components/icons/Moon.svelte';
  import Sun from '$lib/components/icons/Sun.svelte';
  import { browser } from '$app/environment';
  import { THEME_KEY } from '$lib/constants';

  let resolvedTheme: string;
  if (browser) {
    const userSetTheme = getItem(THEME_KEY);
    if (userSetTheme) {
      resolvedTheme = userSetTheme;
    } else {
      const isMediaDarkTheme = window.matchMedia('(prefers-color-scheme: dark)');
      const systemTheme = isMediaDarkTheme ? 'dark' : 'light';
      resolvedTheme = systemTheme;
    }
  }

  function toggleTheme() {
    const { classList } = document.querySelector('html') as HTMLElement;
    if (resolvedTheme) {
      classList.remove(resolvedTheme);
    }
    resolvedTheme = resolvedTheme === 'light' ? 'dark' : 'light';
    classList.add(resolvedTheme);
    try {
      setItem(THEME_KEY, resolvedTheme);
    } catch (e) {
      // ignore
    }
  }
</script>

{#if resolvedTheme !== undefined}
  <button class="btn-toggle-theme" on:click={toggleTheme} title="Toggle theme">
    {#if resolvedTheme === 'dark'}
      <Sun />
    {:else}
      <Moon />
    {/if}
  </button>
{/if}

<style>
  .btn-toggle-theme {
    background: none;
    border: none;
    font-size: 2rem;
    padding: 0;
    cursor: pointer;
  }
  .btn-toggle-theme:active {
    background-color: transparent;
  }
</style>
