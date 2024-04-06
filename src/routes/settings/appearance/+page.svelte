<script lang="ts">
	import { theme, themes } from '$lib/themes';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	let themeValue: string;

	onMount(() => {
		themeValue = get(theme);
	});

	function updateTheme() {
		theme.set(themeValue);
	}
</script>

<h1>Appearance</h1>

<hr />

<h2>Theme</h2>

<select
	bind:value={themeValue}
	on:change={updateTheme}
	name="theme"
	id="theme"
	aria-label="Theme selector"
>
	{#each themes as theme}
		<option value={theme}>{theme}</option>
	{/each}
</select>
