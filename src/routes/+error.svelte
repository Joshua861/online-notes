<script>
	import Navbar from '$lib/Navbar.svelte';
	import { page } from '$app/stores';
</script>

<div class="container">
	<Navbar />

	<img src="https://http.cat/{$page.status}" alt="{$page.status}: {$page.error.message}" />

	<br /><br />

	{#if $page.status == 500}
		<p>Man. That sucks. 500 means this is my fault.</p>
	{:else if $page.status}
		<p>Looks like you got lost. Do you want to go back to the <a href="/">home page</a>?</p>
	{/if}
</div>
