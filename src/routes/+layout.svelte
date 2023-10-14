<script lang="ts">
  import InitialThemeSetter from '$lib/components/InitialThemeSetter.svelte';
  import ThemeSelector from '$lib/components/ThemeSelector.svelte';
  import Logo from '$lib/components/Logo.svelte';
  import '../styles/global.css';
  import Footer from '$lib/components/Footer.svelte';
  import GoogleAnalytics from '$lib/components/GoogleAnalytics.svelte';
  import MetaTags from '$lib/components/MetaTags.svelte';
  import SoundControl from '$lib/components/SoundControl.svelte';
  import { initSounds } from '$lib/utils/sounds';
  import { browser } from '$app/environment';

  if (browser) {
    initSounds();
  }
</script>

<InitialThemeSetter />
<MetaTags />
<div class="small-screen">
  <p>Screen size not supported :(</p>
  <p>Please use a larger screen to play.</p>
</div>
<div class="wrapper">
  <header class="header">
    <div class="logo-container">
      <a href="/">
        <Logo />
      </a>
    </div>
    <div class="theme-selector-container">
      <SoundControl />
      <ThemeSelector />
    </div>
  </header>
  <section class="middle">
    <slot />
  </section>
  <Footer />
  <GoogleAnalytics />
</div>

<style>
  .small-screen {
    display: none;
  }
  .wrapper {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    align-items: center;
    max-width: 784px;
    margin: auto;
    padding: 0 2rem;
  }
  @media (max-width: 359px) {
    .wrapper {
      display: none;
    }
    .small-screen {
      display: flex;
      flex-direction: column;
      margin-top: 4rem;
      align-items: center;
      justify-content: center;
    }
  }
  .header {
    margin: 2rem 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
  .logo-container {
    /* for visual alignment */
    margin-left: -12px;
    flex: 1;
  }
  .theme-selector-container {
    /* for visual alignment */
    margin-right: -8px;
  }
  .middle {
    display: flex;
    flex: 1;
  }
</style>
