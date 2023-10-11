<script lang="ts">
	import { browser } from '$app/environment';
	let url = '';

	if (browser) {
		url = window.location.toString();
	}
	function onCopyClick() {
		navigator.clipboard.writeText(url).catch(function (err) {
			console.error('Unable to copy text: ', err);
		});
	}
</script>

<div class="info-container">
	<h4>Share this link with your friend to start playing:</h4>
	<p class="info">
		<span class="url">{url}</span>
		<button class="copy" on:click={onCopyClick}>Copy</button>
	</p>
</div>

<style>
	.info-container {
		background-color: var(--info-box-bg-color);
		color: var(--info-box-text-color);
		padding: 1rem;
		margin: 1rem 0;
		border-radius: 8px;
	}
	.copy {
		margin-left: 1rem;
		padding: 4px 8px;
		background-color: var(--button-bg-color);
	}
	.url {
		font-size: 90%;
		text-decoration: underline;
	}
</style>
