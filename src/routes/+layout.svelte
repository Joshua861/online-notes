<script lang="ts">
	import '../app.pcss';
	import { theme } from '$lib/themes';
	import { Toaster } from 'svelte-sonner';
	import { applyFonts } from '$lib/fonts';
	import { fontSettings } from '$lib/fonts';

	let themeValue: string;

	theme.subscribe((theme) => {
		themeValue = theme;
	});

	import { onDestroy } from 'svelte';

	let unsubscribe = fontSettings.subscribe(() => {
		applyFonts();
	});

	onDestroy(() => {
		unsubscribe();
	});
</script>

<Toaster theme="dark" />
<slot />
<div class="h-10"></div>
<div class="fixed left-0 top-0 z-[-1000] flex h-screen w-screen">
	<a href="/debug" class="mt-auto px-3 font-mono text-slate-500">v0.2.6</a>
</div>

<!-- I hate this code with all my heart but I cannot be bothered to fix it -->

{#if themeValue == 'amber'}
	<style lang="scss">
		@use '@picocss/pico/scss/pico' with (
			$theme-color: 'amber'
		);
	</style>
{/if}

{#if themeValue == 'azure'}
	<style lang="scss">
		@use '@picocss/pico/scss/pico' with (
			$theme-color: 'azure'
		);
	</style>
{/if}

{#if themeValue == 'blue'}
	<style lang="scss">
		@use '@picocss/pico/scss/pico' with (
			$theme-color: 'blue'
		);
	</style>
{/if}

{#if themeValue == 'cyan'}
	<style lang="scss">
		@use '@picocss/pico/scss/pico' with (
			$theme-color: 'cyan'
		);
	</style>
{/if}

{#if themeValue == 'fuchsia'}
	<style lang="scss">
		@use '@picocss/pico/scss/pico' with (
			$theme-color: 'fuchsia'
		);
	</style>
{/if}

{#if themeValue == 'green'}
	<style lang="scss">
		@use '@picocss/pico/scss/pico' with (
			$theme-color: 'green'
		);
	</style>
{/if}

{#if themeValue == 'grey'}
	<style lang="scss">
		@use '@picocss/pico/scss/pico' with (
			$theme-color: 'grey'
		);
	</style>
{/if}

{#if themeValue == 'indigo'}
	<style lang="scss">
		@use '@picocss/pico/scss/pico' with (
			$theme-color: 'indigo'
		);
	</style>
{/if}

{#if themeValue == 'jade'}
	<style lang="scss">
		@use '@picocss/pico/scss/pico' with (
			$theme-color: 'jade'
		);
	</style>
{/if}

{#if themeValue == 'lime'}
	<style lang="scss">
		@use '@picocss/pico/scss/pico' with (
			$theme-color: 'lime'
		);
	</style>
{/if}

{#if themeValue == 'orange'}
	<style lang="scss">
		@use '@picocss/pico/scss/pico' with (
			$theme-color: 'orange'
		);
	</style>
{/if}

{#if themeValue == 'pink'}
	<style lang="scss">
		@use '@picocss/pico/scss/pico' with (
			$theme-color: 'pink'
		);
	</style>
{/if}

{#if themeValue == 'pumpkin'}
	<style lang="scss">
		@use '@picocss/pico/scss/pico' with (
			$theme-color: 'pumpkin'
		);
	</style>
{/if}

{#if themeValue == 'purple'}
	<style lang="scss">
		@use '@picocss/pico/scss/pico' with (
			$theme-color: 'purple'
		);
	</style>
{/if}

{#if themeValue == 'red'}
	<style lang="scss">
		@use '@picocss/pico/scss/pico' with (
			$theme-color: 'red'
		);
	</style>
{/if}

{#if themeValue == 'sand'}
	<style lang="scss">
		@use '@picocss/pico/scss/pico' with (
			$theme-color: 'sand'
		);
	</style>
{/if}

{#if themeValue == 'slate'}
	<style lang="scss">
		@use '@picocss/pico/scss/pico' with (
			$theme-color: 'slate'
		);
	</style>
{/if}

{#if themeValue == 'violet'}
	<style lang="scss">
		@use '@picocss/pico/scss/pico' with (
			$theme-color: 'violet'
		);
	</style>
{/if}

{#if themeValue == 'yellow'}
	<style lang="scss">
		@use '@picocss/pico/scss/pico' with (
			$theme-color: 'yellow'
		);
	</style>
{/if}

{#if themeValue == 'zinc'}
	<style lang="scss">
		@use '@picocss/pico/scss/pico' with (
			$theme-color: 'zinc'
		);
	</style>
{/if}
