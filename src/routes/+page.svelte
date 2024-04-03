<script lang="ts">
	import { SignedIn, SignedOut, FirebaseApp, Doc } from 'sveltefire';
	import {
		createUserWithEmailAndPassword,
		signInWithEmailAndPassword,
		getAuth
	} from 'firebase/auth';
	import { getFirestore, setDoc, doc } from 'firebase/firestore';
	import { initializeApp } from 'firebase/app';
	import { v4 as uuidv4 } from 'uuid';
	import Navbar from '$lib/Navbar.svelte';
	import { toast } from 'svelte-sonner';
	import Time from 'svelte-time/src/Time.svelte';

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

	let email: string, password: string;

	function signUp() {
		createUserWithEmailAndPassword(auth, email, password)
			.then(async (userCredential) => {
				let user = userCredential.user;
				await setDoc(doc(db, 'users', user.uid), {
					notes: [
						{
							content: 'Welcome to my notes app.',
							date: Date.now(),
							title: 'Hello world',
							id: uuidv4()
						}
					]
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
</script>

<svelte:head><title>Notes</title></svelte:head>

<FirebaseApp {auth} firestore={db}>
	<SignedOut>
		<div class="flex h-screen w-screen justify-center align-middle">
			<form class="m-3 mx-auto my-auto max-w-[800px]" on:submit|preventDefault>
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

			<Doc ref="users/{user.uid}" let:data={user}>
				{#if user.notes.length === 0}
					<div class="flex h-auto w-full flex-col justify-center align-middle">
						<img
							class="m-5 mx-auto max-h-[600px] w-auto rounded-2xl"
							src="/no-notes.jpg"
							alt="That meme of a guy saying here's where I'd put my trophy... IF I HAD ANY, and he's got a really sad face, except I replaced trophy with notes. So it's like: you don't have any notes, maybe you should make one."
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
