<script lang="ts">
</script>

<button class="btn" on:click>
  <slot />
</button>

<style>
  .btn {
    margin-top: 24px;
    padding: 8px 12px;
    line-height: 1.5;
    text-transform: uppercase;
    background-color: var(--button-bg-color);
    color: var(--button-text-color);
    font-size: 1rem;
    letter-spacing: 2px;
    border: 2px solid var(--grid-border-color);
    cursor: pointer;
  }

  .btn:focus {
    outline: none;
    border-color: var(--text-color);
  }
</style>
