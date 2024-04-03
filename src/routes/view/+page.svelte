<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { Doc, SignedIn, userStore, FirebaseApp } from 'sveltefire';
	import { getAuth } from 'firebase/auth';
	import { doc, getDoc, getFirestore, setDoc } from 'firebase/firestore';
	import { initializeApp } from 'firebase/app';
	import SvelteMarkdown from 'svelte-markdown';
	import Navbar from '$lib/Navbar.svelte';
	import Time from 'svelte-time/src/Time.svelte';
	import { get } from 'svelte/store';

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

	onMount(async () => {
		if ($page.url.searchParams.get('id')) {
			id = $page.url.searchParams.get('id');
		} else {
			goto('/');
		}
	});

	async function likeNote() {
		let user = get(userStore(auth));
		let note = (await getDoc(doc(db, 'public', id))).data();

		if (note.likedBy.includes(user.uid)) {
			note.likedBy = note.likedBy.filter((id) => id !== user.uid);
		} else {
			note.likedBy.push(user?.uid);
		}

		note.likes = note.likedBy.length;

		setDoc(doc(db, 'public', id), note);
	}
</script>

<svelte:head><title>View note</title></svelte:head>

<FirebaseApp {auth} firestore={db}>
	<div class="container">
		<Navbar />
		<SignedIn let:user>
			{#if id}
				<Doc ref="/public/{id}" let:data>
					<h1>{data.title}</h1>
					<div class="gap-5 border font-mono text-slate-500">
						<Time timestamp={data.time} /> | likes: {data.likedBy.length}
						<button on:click={likeNote} class="!border-none font-mono outline active:border-none"
							>like</button
						>
					</div>
					<br /><br />
					<SvelteMarkdown source={data.content} />
				</Doc>
			{/if}
		</SignedIn>
	</div>
</FirebaseApp>
