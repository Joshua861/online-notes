<script lang="ts">
	import { theme, themes } from '$lib/themes';
	import { fontSettings, fonts, applyFonts } from '$lib/fonts';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { json } from '@sveltejs/kit';

	let themeValue: string;

	onMount(() => {
		themeValue = get(theme);
		mounted = true;
	});

	function updateTheme() {
		theme.set(themeValue);
	}

	let fontsValue = get(fontSettings);

	$: {
		if (mounted) {
			fontSettings.set(fontsValue);
			applyFonts();
		}
	}

	let mounted = false;

	const baseFonts = [];
	const titleFonts = [];
	const monoFonts = [];

	// Flatten the fonts object into separate arrays based on category
	for (const category in fonts) {
		for (const font in fonts[category]) {
			const fontObject = fonts[category][font];
			switch (category) {
				case 'base':
					baseFonts.push(fontObject);
					break;
				case 'title':
					titleFonts.push(fontObject);
					break;
				case 'mono':
					monoFonts.push(fontObject);
					break;
			}
		}
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

<h2>Fonts</h2>

<div class="mt-10 flex flex-col gap-5">
	<h1
		class="fade-text mx-5 my-0 max-w-full overflow-hidden whitespace-nowrap text-4xl md:m-0 md:text-6xl"
	>
		Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto nesciunt quia assumenda vitae
		sint voluptatem porro expedita atque iste laborum, sit quis amet velit ut. Inventore aspernatur
		necessitatibus sint ea consequatur placeat quis. Corporis culpa asperiores voluptate, deserunt
		excepturi maiores temporibus? Veniam eius quisquam maiores delectus magni necessitatibus ipsa
		nam!
	</h1>
	<p
		class="fade-text mx-5 my-0 max-w-full overflow-hidden whitespace-nowrap text-4xl md:m-0 md:text-6xl"
	>
		Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto nesciunt quia assumenda vitae
		sint voluptatem porro expedita atque iste laborum, sit quis amet velit ut. Inventore aspernatur
		necessitatibus sint ea consequatur placeat quis. Corporis culpa asperiores voluptate, deserunt
		excepturi maiores temporibus? Veniam eius quisquam maiores delectus magni necessitatibus ipsa
		nam!
	</p>
	<code
		class="fade-text mx-5 my-0 max-w-full overflow-hidden whitespace-nowrap text-4xl md:m-0 md:text-6xl"
		>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iusto nesciunt quia assumenda vitae
		sint voluptatem porro expedita atque iste laborum, sit quis amet velit ut. Inventore aspernatur
		necessitatibus sint ea consequatur placeat quis. Corporis culpa asperiores voluptate, deserunt
		excepturi maiores temporibus? Veniam eius quisquam maiores delectus magni necessitatibus ipsa
		nam!</code
	>
</div>

<br /><br />

<label>
	Base font
	<select
		bind:value={fontsValue.baseFont}
		on:change={() => {
			applyFonts();
		}}
		name="baseFont"
		id="baseFont"
		aria-label="Base font selector"
	>
		{#each baseFonts as font}
			<option value={font.id}>{font.name}</option>
		{/each}
	</select>
</label>

<label>
	Title font
	<select
		bind:value={fontsValue.titleFont}
		on:change={() => {
			applyFonts();
		}}
		name="baseFont"
		id="baseFont"
		aria-label="Base font selector"
	>
		{#each titleFonts as font}
			<option value={font.id}>{font.name}</option>
		{/each}
	</select>
</label>

<label>
	Monospaced font
	<select
		bind:value={fontsValue.monoFont}
		on:change={() => {
			applyFonts();
		}}
		name="baseFont"
		id="baseFont"
		aria-label="Base font selector"
	>
		{#each monoFonts as font}
			<option value={font.id}>{font.name}</option>
		{/each}
	</select>
</label>

<style lang="postcss">
	.fade-text {
		position: relative;
		display: inline-block;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		-moz-background-clip: text;
		-moz-text-fill-color: transparent;
		/* ;	background: linear-gradient(to left, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%) */
		background-size: 100%;
		background-repeat: repeat;
		/* Create the gradient. */
		background-image: linear-gradient(to right, #0000, #fff, #fff, #fff, #fff, #0000);
	}
</style>
