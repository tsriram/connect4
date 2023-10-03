<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<div>
	<form action="?/new" method="post" use:enhance>
		<label>
			Name:
			<input name="username" />
		</label>
		<button type="submit">Start a new game</button>
	</form>
</div>

<style>
</style>
