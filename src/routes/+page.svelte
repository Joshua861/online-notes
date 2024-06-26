<script lang="ts">
	import { SignedIn, SignedOut, FirebaseApp, Doc, userStore } from 'sveltefire';
	import {
		createUserWithEmailAndPassword,
		signInWithEmailAndPassword,
		getAuth
	} from 'firebase/auth';
	import {
		getFirestore,
		setDoc,
		getDoc,
		doc,
		query,
		getDocs,
		collection,
		orderBy,
		where
	} from 'firebase/firestore';
	import { initializeApp } from 'firebase/app';
	import { v4 as uuidv4 } from 'uuid';
	import Navbar from '$lib/Navbar.svelte';
	import { toast } from 'svelte-sonner';
	import Time from 'svelte-time/src/Time.svelte';
	import { onMount } from 'svelte';
	import { authStore, dbStore } from '$lib/stores';
	import { get } from 'svelte/store';

	const firebaseConfig = {
		apiKey: 'AIzaSyAS0OpX3__te9ONUbJH1hy5ovMIYeF84xo',
		authDomain: 'online-notes-1c459.firebaseapp.com',
		projectId: 'online-notes-1c459',
		storageBucket: 'online-notes-1c459.appspot.com',
		messagingSenderId: '261226857736',
		appId: '1:261226857736:web:a4fb8bc8fd249cf95098bd'
	};

	const app = initializeApp(firebaseConfig);
	const auth = getAuth(app);
	const db = getFirestore(app);

	let email: string, password: string, username: string;
	let sharedNotes;

	function signUp() {
		if (username.length < 3) {
			toast.error('Username too short.');
			return;
		} else if (username.length > 20) {
			toast.error('User			return;name too long');
		}

		createUserWithEmailAndPassword(auth, email, password)
			.then(async (userCredential) => {
				let user = userCredential.user;
				await setDoc(doc(db, 'users', user.uid), {
					notes: [
						{
							content:
								"This notes app uses *Markdown* for text formatting, meaning you can add *italic*, **bold**, `monospaced`, and [hyperlinked](https://example.com) text. \nYou can also add:\n> Blockquotes!\n- Unordered\n- lists,\n1. Ordered\n2. lists,\n## Subheadings,\nand more.\nIf you don't know Markdown, and want to learn, you can learn [here](https://commonmark.org/help/), or try editing this page to see how it was written.\n___\n## Storage\nAll the notes inputted here are stored in the cloud, they are not encripted (yet), and are definately not somewhere you should put anything you wouldn't want people to know. I don't *think* it's possible for anyone to randomly get access to your notes but I'm very new to the whole database thing and I don't really know what I'm doing. Stay safe. Though the fact that they are on the cloud does mean that they are synced between devices.",
							date: Date.now(),
							title: 'How to use',
							id: uuidv4()
						}
					],
					username: username
				});

				console.log(user);
			})
			.catch((error) => {
				toast.error(`Error ${error.code}`, {
					description: error.message
				});
			});
	}
	function signIn() {
		signInWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				let user = userCredential.user;

				console.log(user);
			})
			.catch((error) => {
				toast.error(`Error ${error.code}`, {
					description: error.message
				});
			});
	}

	onMount(async () => {
		let user = userStore(get(authStore));

		user.subscribe(async (user) => {
			if (!user) {
				return;
			}

			sharedNotes = await getSharedNotes(user);
		});
	});

	$: console.log('SHARED NOTES', sharedNotes);

	const getSharedNotes = async (user) => {
		try {
			const db = getFirestore();
			const sharedRefsCollection = collection(db, 'sharedRefs');

			const sharedRefDocs = await getDocs(
				query(sharedRefsCollection, where('__name__', '==', user.email))
			);

			let sharedRefs = sharedRefDocs.docs.map((doc) => doc.ref);
			console.log(sharedRefs);

			// Use Promise.all to wait for all async operations to complete
			let notes = await Promise.all(
				sharedRefs.map(async (ref) => {
					let refDoc = await getDoc(ref);
					return Promise.all(
						refDoc.data()!.notes.map(async (noteID: string) => {
							let note = (await getDoc(doc(db, 'shared', noteID))).data();
							console.log(note);
							return note; // Return the note directly
						})
					);
				})
			);

			console.log(notes);

			// Flatten the array of arrays into a single array
			notes = notes.flat();

			// Update sharedNotes reactively
			sharedNotes = notes;

			return notes;
		} catch (error) {
			console.error('Error getting shared note references: ', error);
		}
	};
</script>

<svelte:head><title>Notes</title></svelte:head>

<FirebaseApp {auth} firestore={db}>
	<SignedOut>
		<div class="flex h-screen w-screen justify-center align-middle">
			<form class="mx-auto my-auto max-w-[800px] px-5" on:submit|preventDefault>
				<label>
					Username (non unique, leave blank if signing in)
					<input type="text" name="username" id="username" bind:value={username} />
				</label>
				<label>
					Email
					<input type="email" name="email" id="email" bind:value={email} />
				</label>
				<label>
					Password
					<input type="password" name="password" id="password" bind:value={password} />
				</label>
				<div class="[&>*]flex-1 flex flex-col gap-3">
					<button on:click|preventDefault={signUp}>Sign up</button>
					<button on:click|preventDefault={signIn}>Sign in</button>
				</div>
			</form>
		</div>
	</SignedOut>

	<SignedIn let:user>
		<div class="container">
			<Navbar />
			<h1>Notes</h1>

			{#if sharedNotes != 'loading' && sharedNotes != undefined}
				<ul>
					{#each sharedNotes as note}
						<li class="list-none text-lg">
							<a href="/shared-note?id={note.id}">{note.title}</a>
							<br />
							<div class="font-mono text-slate-500">
								<Time timestamp={note.time} />
								<br />
								Shared with you
							</div>
						</li>
					{/each}
				</ul>
			{/if}

			<Doc ref="users/{user.uid}" let:data={user}>
				{#if user.notes.length === 0}
					<div class="flex h-auto w-full flex-col justify-center align-middle">
						<img
							class="m-5 mx-auto max-h-[600px] w-auto rounded-2xl"
							src="/no-notes.jpg"
							alt="That meme of a guy saying here's where I'd put my trophy... IF I HAD ONE, and he's got a really sad face, except I replaced trophy with notes. So it's like: you don't have any notes, maybe you should make one."
						/>
						<br />
						<a class="text-center" href="/create">Create note</a>
					</div>
				{/if}
				<ul class="flex list-none flex-col gap-3">
					{#each user?.notes as note}
						<li class="list-none text-lg">
							<a href="/note?id={note.id}">{note.title}</a>
							<br />
							<Time class=" font-mono text-slate-500" timestamp={note.time} />
						</li>
					{/each}
				</ul>
			</Doc>
		</div>
	</SignedIn>
</FirebaseApp>
