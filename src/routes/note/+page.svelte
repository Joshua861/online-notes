<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { Doc, SignedIn, userStore, FirebaseApp } from 'sveltefire';
	import { getAuth } from 'firebase/auth';
	import { getFirestore } from 'firebase/firestore';
	import { initializeApp } from 'firebase/app';
	import SvelteMarkdown from 'svelte-markdown';
	import Navbar from '$lib/Navbar.svelte';
	import Time from 'svelte-time/src/Time.svelte';
	import { deleteLocalNote, publishNote, shareNote } from '$lib/utils';
	import { appStore, authStore, dbStore } from '$lib/stores';

	let app, auth, db;

	appStore.subscribe((appValue) => {
		app = appValue;
	});
	authStore.subscribe((authValue) => {
		auth = authValue;
	});
	dbStore.subscribe((dbValue) => {
		db = dbValue;
	});

	let id: string | null;
	let showPublishModal = false,
		showShareModal = false;
	let uid: string;

	onMount(async () => {
		if ($page.url.searchParams.get('id')) {
			id = $page.url.searchParams.get('id')!;
		} else {
			goto('/');
		}
	});

	function editNote() {
		goto(`/edit?id=${id}`);
	}
</script>

<svelte:head><title>View note</title></svelte:head>

<FirebaseApp {auth} firestore={db}>
	<div class="container">
		<Navbar />
		<SignedIn let:user>
			{#if id}
				<Doc ref="/users/{user.uid}" let:data>
					{#each data?.notes as note}
						{#if note.id === id}
							<h1>{note.title}</h1>
							<div class="font-mono text-slate-500">
								<Time timestamp={note.time} /> |
								<a on:click={() => deleteLocalNote(id)}>delete</a>
								|
								<a on:click={editNote}>edit</a>
								|
								<a on:click={() => (showPublishModal = true)}>publish</a> |
								<a on:click={() => (showShareModal = true)}>share</a>
							</div>
							<br /><br />
							<SvelteMarkdown source={note.content} />
						{/if}
					{/each}
					<div slot="loading" class="flex h-screen w-full justify-center align-middle">
						<div class="my-auto">
							<p class="my-auto text-center">Loading...</p>
							<p class="text-center text-slate-500">
								If this is taking longer than usual, this note might not exist.
							</p>
						</div>
					</div>
				</Doc>
			{/if}
		</SignedIn>
	</div>
</FirebaseApp>

{#if showPublishModal}
	<dialog open>
		<article>
			<header>
				<button aria-label="Close" on:click={() => (showPublishModal = false)} rel="prev"></button>
				<h3>Are you sure you want to publish?</h3>
			</header>
			<p>
				If you publish your note, it will be visible for all to see, and there is no way to delete
				it.
			</p>
			<footer>
				<button class="secondary" on:click={() => (showPublishModal = false)}> Cancel </button>
				<button on:click={() => publishNote(id)}>Publish</button>
			</footer>
		</article>
	</dialog>
{/if}

{#if showShareModal}
	<dialog open>
		<article>
			<header>
				<button aria-label="Close" on:click={() => (showShareModal = false)} rel="prev"></button>
				<h3>Sharing</h3>
			</header>

			<details>
				<summary><strong>What is sharing?</strong></summary>
				<p>
					When you share a note, the user you share it with will see it at the top of their notes
					screen. They will be able to view and edit the note just as you can. These changes will be
					updated on your client. If you are both editing at the same time, whoever presses save
					last's version of the note will overwrite the other; there is no collaborative notes
					feature.

					<br /><br />

					When you share a note, it's stored somewhere seperate; not along with you're other notes.
					Your old, un-shared note will remain in your notes tab, like with publishing a note.
				</p>
			</details>

			<details>
				<summary><strong>How do I use this?</strong></summary>
				<p>
					You can share this note with someone by inputting the email adress tied to their accound.
					If they don't remember what email they used, it can be viewed in the debug menu by
					pressing the version number in the bottom left.
				</p>
			</details>

			<details>
				<summary><strong>It didn't work. What do I do?</strong></summary>
				<p>
					It could be that you inputted the email or UID wrong. The script doesen't actually check
					to see if it's valid. If you try again, and it still dosen't work, and you've made sure
					you used the right UID/email, then you can contact me at <a href="mailto:joshrl@proton.me"
						>joshrl@proton.me</a
					>.
				</p>
			</details>

			<hr />

			<label>
				User email
				<input type="email" bind:value={uid} />
			</label>

			<footer>
				<button on:click={() => shareNote(id, uid)}>Share</button>
				<button class="secondary" on:click={() => (showShareModal = false)}>Cancel</button>
			</footer>
		</article>
	</dialog>
{/if}
