<footer>
  <section>
    Built&nbsp;with&nbsp;<a href="https://kit.svelte.dev/" rel="noopener" target="_blank"
      >SvelteKit</a
    >&nbsp;and&nbsp;
    <a href="https://www.partykit.io/" rel="noopener" target="_blank">PartyKit</a>&nbsp;by&nbsp;<a
      href="https://twitter.com/tsriram"
      class="name"
      rel="noopener"
      target="_blank">Sriram</a
    >
  </section>
  <section>
    <a href="https://github.com/tsriram/connect4" rel="noopener" target="_blank">Code</a>
  </section>
</footer>

<style>
  footer {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 2rem;
    align-items: center;
    justify-content: center;
    margin-top: 4rem;
    font-size: 90%;
  }

  footer section {
    display: flex;
  }

  footer a {
    color: var(--footer-link-color);
    text-decoration: none;
  }

  footer a:hover {
    text-decoration: underline;
  }
</style>
