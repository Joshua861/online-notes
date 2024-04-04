<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { Doc, SignedIn, userStore, FirebaseApp } from 'sveltefire';
	import { getAuth } from 'firebase/auth';
	import { getFirestore, setDoc, doc, getDoc, addDoc, collection } from 'firebase/firestore';
	import { initializeApp } from 'firebase/app';
	import SvelteMarkdown from 'svelte-markdown';
	import Navbar from '$lib/Navbar.svelte';
	import Time from 'svelte-time/src/Time.svelte';
	import { get } from 'svelte/store';
	import { v4 } from 'uuid';

	const firebaseConfig = {
		apiKey: 'AIzaSyAS0OpX3__te9ONUbJH1hy5ovMIYeF84xo',
		authDomain: 'online-notes-1c459.firebaseapp.com',
		projectId: 'online-notes-1c459',
		storageBucket: 'online-notes-1c459.appspot.com',
		messagingSenderId: '261226857736',
		appId: '1:261226857736:web:a4fb8bc8fd249cf95098bd'
	};

	let app = initializeApp(firebaseConfig);
	let auth = getAuth(app);
	let db = getFirestore(app);

	let id: String;
	let showPublishModal = false;

	onMount(async () => {
		if ($page.url.searchParams.get('id')) {
			id = $page.url.searchParams.get('id');
		} else {
			goto('/');
		}
	});

	async function deleteNote() {
		const user = userStore(auth);
		const uid = get(user).uid;

		const userData = await getDoc(doc(db, 'users', uid));
		let notes = userData.data().notes;

		notes = notes.filter((entry) => entry.id !== id);
		let newUserData = userData.data();
		newUserData.notes = notes;

		setDoc(doc(db, 'users', uid), newUserData);

		goto('/');
	}

	function editNote() {
		goto(`/edit?id=${id}`);
	}

	async function publish() {
		const user = get(userStore(auth));
		let userData = (await getDoc(doc(db, 'users', user.uid))).data();
		let note = userData.notes.find((note) => note.id == id);
		let username = userData.username;

		const docRef = await addDoc(collection(db, 'public'), {
			title: note.title,
			content: note.content,
			time: note.time,
			user: username,
			likes: 0,
			likedBy: [],
			reports: 0,
			reportedBy: [],
			comments: [],
			uid: user.uid
		});

		goto(`/view?id=${docRef.id}`);
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
								<a on:click={deleteNote} class="!border-none font-mono outline active:border-none"
									>delete</a
								>
								|
								<a on:click={editNote} class="!border-none font-mono outline active:border-none"
									>edit</a
								>
								|
								<a
									on:click={() => (showPublishModal = true)}
									class="!border-none font-mono outline active:border-none">publish</a
								>
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
				<button on:click={publish}>Publish</button>
			</footer>
		</article>
	</dialog>
{/if}
