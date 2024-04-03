<script lang="ts">
	import { SignedIn, SignedOut, FirebaseApp, userStore } from 'sveltefire';
	import { getAuth } from 'firebase/auth';
	import { getFirestore, setDoc, doc, getDoc } from 'firebase/firestore';
	import { initializeApp } from 'firebase/app';
	import { v4 as uuidv4 } from 'uuid';
	import Navbar from '$lib/Navbar.svelte';
	import { goto } from '$app/navigation';
	import Warning from '$lib/Warning.svelte';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';

	const firebaseConfig = {
		apiKey: 'AIzaSyAS0OpX3__te9ONUbJH1hy5ovMIYeF84xo',
		authDomain: 'online-notes-1c459.firebaseapp.com',
		projectId: 'online-notes-1c459',
		storageBucket: 'online-notes-1c459.appspot.com',
		messagingSenderId: '261226857736',
		appId: '1:261226857736:web:a4fb8bc8fd249cf95098bd'
	};

	let id: String;
	let note;

	onMount(async () => {
		if ($page.url.searchParams.get('id')) {
			// wait to run this section until after $user is no longer null
			id = $page.url.searchParams.get('id');
			user.subscribe(async (user) => {
				let userData = getDoc(doc(db, 'users', $user.uid));
				let notes = (await userData).data().notes;
				note = notes.find((note) => note.id == id);
				title = note.title;
				content = note.content;
			});
		} else {
			goto('/');
		}
	});

	const app = initializeApp(firebaseConfig);
	const auth = getAuth(app);
	const db = getFirestore(app);
	const user = userStore(auth);

	let title: string, content: string;

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

	async function save() {
		if ($user) {
			let userDoc = await getDoc(doc(db, 'users', $user.uid));
			console.log(userDoc);
			if (userDoc.exists()) {
				let userData = userDoc.data();
				userData.notes.push({
					title: title,
					content: content,
					id: uuidv4(),
					time: Date.now()
				});

				deleteNote();

				setDoc(doc(db, 'users', $user.uid), userData);

				goto('/');
			}
		}
	}
</script>

<svelte:head><title>Edit note</title></svelte:head>

<FirebaseApp {auth} firestore={db}>
	<SignedIn>
		<Warning />
	</SignedIn>
	<div class="container">
		<SignedIn let:user>
			<Navbar />
			<h1>Edit note</h1>

			<input type="text" name="title" id="title" bind:value={title} placeholder="Title" />
			<textarea
				name="content"
				id="content"
				bind:value={content}
				class="h-[500px]"
				placeholder="Content"
			/>
			<button class="w-full" on:click={save}>Save</button>
		</SignedIn>

		<SignedOut>
			Ummm... I think you might be lost... lets take you back to the <a href="/">main page</a>.
		</SignedOut>
	</div>
</FirebaseApp>
