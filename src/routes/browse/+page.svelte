<script lang="ts">
	import { initializeApp } from 'firebase/app';
	import { getAuth } from 'firebase/auth';
	import { collection, query, orderBy, limit, endAt, getDocs } from 'firebase/firestore';
	import { getFirestore } from 'firebase/firestore';
	import { onMount } from 'svelte';
	import { FirebaseApp, SignedIn, SignedOut } from 'sveltefire';
	import Time from 'svelte-time/src/Time.svelte';
	import Navbar from '$lib/Navbar.svelte';

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

	const publicRef = collection(db, 'public');

	let order: 'new' | 'popular' = 'new';
	let notes = [];

	async function fetchNotes() {
		notes = [];
		let docs;

		if (order == 'popular')
			docs = await getDocs(query(publicRef, orderBy('likes', 'desc'), limit(10)));
		if (order == 'new') docs = await getDocs(query(publicRef, orderBy('time', 'desc'), limit(10)));

		let newNotes = notes;
		docs.forEach((doc) => {
			newNotes.push({ ...doc.data(), id: doc.id });
		});
		notes = newNotes;
		console.log(notes);
	}

	onMount(() => {
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
</div>
