<script lang="ts">
	import { FirebaseApp, SignedIn } from 'sveltefire';
	import { authStore, dbStore, appStore } from '$lib/stores';
	import Navbar from '$lib/Navbar.svelte';
	import { toast } from 'svelte-sonner';

	// ik this aint doing shit but it looks cool, and maybe someone will see this and give up idk

	let authorized = false,
		password = '';

	function validate() {
		authorized = password == 'apple pie';

		if (authorized == false) {
			toast.error('WRONG!!!');
		}
	}
</script>

<FirebaseApp auth={$authStore} firestore={$dbStore}>
	<div class="container">
		<Navbar />
	</div>
	<SignedIn>
		{#if authorized}
			<div class="container">
				<h1>Super secret debug menu 🤫</h1>
				<hr />

				<h3>App</h3>

				<pre>{@html `<code>${JSON.stringify($appStore, null, 2)}</code>`}</pre>

				<h3>Auth</h3>

				<pre>{@html `<code>${JSON.stringify($authStore, null, 2)}</code>`}</pre>

				<h3>DB</h3>

				<pre>{@html `<code>${JSON.stringify($dbStore, null, 2)}</code>`}</pre>
			</div>
		{:else}
			<div class="flex h-screen w-screen justify-center align-middle">
				<div class="my-auto">
					<h1 class="text-center font-mono">Password</h1>
					<input type="password" bind:value={password} name="password" id="password" />
					<button class="w-full" on:click={validate}>Enter</button>
				</div>
			</div>
		{/if}
	</SignedIn>
</FirebaseApp>
