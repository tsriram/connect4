<script lang="ts">
  import Button from '$lib/components/Button.svelte';
  import { trackGameEvent } from '$lib/analytics';
  import { GameFormType } from '$lib/types';
  import { enhance } from '$app/forms';
  export let type: GameFormType;

  const newGameAction = '?/new';
  const joinGameAction = '?/join';
  export let storedUserName: string = '';
  const formAction = type === GameFormType.START ? newGameAction : joinGameAction;
  const buttonLabel = type === GameFormType.START ? 'Start a new game' : 'Join game';
  let submitting = false;
  let submittingLabel = '';
  $: {
    if (submitting) {
      submittingLabel = type === GameFormType.START ? 'Starting a new game...' : 'Joining game...';
    }
  }
</script>

<div class="container">
  <form
    class="game-form"
    action={formAction}
    method="post"
    use:enhance={() => {
      submitting = true;
      trackGameEvent(type);
      return async ({ update }) => {
        update();
      };
    }}
  >
    <label for="username">Enter your first name: </label>
    <!-- svelte-ignore a11y-autofocus -->
    <input
      class="username-input"
      id="username"
      name="username"
      autofocus
      required
      aria-required="true"
      bind:value={storedUserName}
    />

    <Button>{submitting ? submittingLabel : buttonLabel}</Button>
  </form>
</div>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .game-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    font-size: 1.25rem;
    align-items: center;
  }

  label {
    align-self: flex-start;
  }

  .username-input {
    font-size: 1.5rem;
    padding: 8px;
    outline: 4px solid var(--grid-border-color);
  }
</style>
