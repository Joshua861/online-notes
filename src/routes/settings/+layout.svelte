<script>
	import Navbar from '$lib/Navbar.svelte';
	import { page } from '$app/stores';

	let links = [
		{
			name: 'Account',
			link: 'account'
		},
		{
			name: 'Appearance',
			link: 'appearance'
		}
	];
</script>

<div class="container">
	<Navbar />

	<article>
		<h2>Settings</h2>
		<ul>
			{#each links as link}
				<li class="list-none"><a class="!no-underline" href={link.link}>{link.name}</a></li>
			{/each}
		</ul>
	</article>

	<slot />
</div>

<svelte:head>
	<title>Settings</title>
</svelte:head>
