<script lang="ts">
	import { FirebaseApp, SignedIn } from 'sveltefire';
	import { authStore, dbStore, appStore } from '$lib/stores';
	import Navbar from '$lib/Navbar.svelte';
</script>

<FirebaseApp auth={$authStore} firestore={$dbStore}>
	<div class="container">
		<Navbar />
	</div>
	<SignedIn>
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
	</SignedIn>
</FirebaseApp>
