<script lang="ts">
	import { enhance } from '$app/forms';
</script>

<div>
	<form action="?/join" method="post" use:enhance>
		<label>
			Name:
			<input name="username" />
		</label>
		<button type="submit">Join game</button>
	</form>
</div>

<style>
</style>
