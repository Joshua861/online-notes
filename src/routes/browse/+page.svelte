<script lang="ts">
	import { initializeApp } from 'firebase/app';
	import { getAuth } from 'firebase/auth';
	import { collection, query, orderBy, limit, getDocs, startAfter } from 'firebase/firestore';
	import { getFirestore } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import { FirebaseApp, SignedIn, SignedOut } from 'sveltefire';
	import Time from 'svelte-time/src/Time.svelte';
	import Navbar from '$lib/Navbar.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

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
	let p = $page.url.searchParams.get('p');
	let lastDoc;

	const publicRef = collection(db, 'public');

	let order: 'new' | 'popular' = 'new';
	let notes = [];

	async function fetchNotes() {
		let docs;

		if (p == null) {
			console.log('p is null');
			// Fetch the first page without startAfter
			docs = await getDocs(
				query(publicRef, orderBy(order === 'new' ? 'time' : 'likes', 'desc'), limit(5))
			);
		} else {
			// Fetch the next page using the last document from the previous page
			docs = await getDocs(
				query(
					publicRef,
					orderBy(order === 'new' ? 'time' : 'likes', 'desc'),
					startAfter(lastDoc), // Use the last document from the previous page
					limit(5)
				)
			);
		}

		if (docs.docs.length > 0) {
			lastDoc = docs.docs[docs.docs.length - 1];
		}

		notes = docs.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
		console.log(notes);
	}

	async function fetchMoreNotes() {
		const publicRef = collection(db, 'public');
		let docs;

		if (lastDoc) {
			docs = await getDocs(
				query(
					publicRef,
					orderBy(order === 'new' ? 'time' : 'likes', 'desc'),
					startAfter(lastDoc),
					limit(5)
				)
			);
		} else {
			docs = await getDocs(
				query(publicRef, orderBy(order === 'new' ? 'time' : 'likes', 'desc'), limit(5))
			);
		}

		if (docs.docs.length > 0) {
			lastDoc = docs.docs[docs.docs.length - 1];
			notes = docs.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
		}

		console.log(notes);
	}

	onMount(async () => {
		fetchNotes();
	});
</script>

<div class="container">
	<Navbar />

	<h1>Browse Notes</h1>

	{#if order == 'popular'}
		<button
			on:click={() => {
				order = 'new';
				fetchNotes();
			}}>Sort by newest</button
		>
	{:else}
		<button
			on:click={() => {
				order = 'popular';
				fetchNotes();
			}}>Sort by most popular</button
		>
	{/if}

	<br /><br />

	{#each notes as note}
		<li class="list-none">
			<a href="/view?id={note.id}">{note.title}</a>
			<div class="font-mono text-slate-500">
				<Time relative timestamp={note.time} /> | {note.user} | likes: {note.likes}
			</div>
			<br />
		</li>
	{/each}

	<a on:click={fetchMoreNotes}>Show more</a>
</div>
