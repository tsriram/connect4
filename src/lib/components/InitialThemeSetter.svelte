<svelte:head>
	<script>
		try {
			// it looks like we can't import THEME_KEY here?
			const themeKey = 'connect4:theme';
			if (!(themeKey in localStorage)) {
				const initialTheme = window.matchMedia('(prefers-color-scheme: dark)') ? 'dark' : 'light';
				localStorage.setItem(themeKey, initialTheme);
			}
			document.querySelector('html').classList.add(localStorage.getItem(themeKey));
		} catch (e) {
			console.error(e);
		}
	</script>
</svelte:head>
