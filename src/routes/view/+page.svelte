<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { Doc, SignedIn, userStore, FirebaseApp } from 'sveltefire';
	import { getAuth } from 'firebase/auth';
	import { doc, getDoc, getFirestore, setDoc, deleteDoc } from 'firebase/firestore';
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

	let id: string, comment: string, replyingTo: string, reply: string;

	onMount(async () => {
		if ($page.url.searchParams.get('id')) {
			id = $page.url.searchParams.get('id');
		} else {
			goto('/');
		}
	});

	async function likeNote() {
		let user = get(userStore(auth));
		console.log(user.uid);

		let note = (await getDoc(doc(db, 'public', id))).data();

		if (note.likedBy.includes(user.uid)) {
			note.likedBy = note.likedBy.filter((id) => id !== user.uid);
		} else {
			note.likedBy.push(user?.uid);
		}

		note.likes = note.likedBy.length;

		setDoc(doc(db, 'public', id), note);
	}

	async function reportNote() {
		let user = get(userStore(auth));
		let note = (await getDoc(doc(db, 'public', id))).data();

		if (note.reportedBy.includes(user.uid)) {
			note.reportedBy = note.reportedBy.filter((id) => id !== user.uid);
		} else {
			note.reportedBy.push(user?.uid);
		}

		note.reports = note.reportedBy.length;

		if (note.reports > 5) {
			deleteDoc(doc(db, 'public', id));
		} else {
			setDoc(doc(db, 'public', id), note);
		}
	}

	async function addComment() {
		if (comment.length == 0) {
			return;
		}

		let user = get(userStore(auth));
		let note = (await getDoc(doc(db, 'public', id))).data();
		let userData = (await getDoc(doc(db, 'users', user.uid))).data();

		note.comments.push({
			content: comment,
			user: userData.username,
			time: Date.now(),
			likes: 0,
			likedBy: [],
			replies: [],
			id: v4(),
			uid: user.uid
		});

		note.comments.sort((a, b) => b.likes - a.likes);

		setDoc(doc(db, 'public', id), note);

		comment = '';
	}

	async function deleteComment(commentID) {
		console.log(commentID);

		let note = (await getDoc(doc(db, 'public', id))).data();

		note.comments = note.comments.filter((comment) => comment.id !== commentID);
		console.log(note.comments);

		setDoc(doc(db, 'public', id), note);
	}

	async function likeComment(commentID) {
		let user = get(userStore(auth));
		let note = (await getDoc(doc(db, 'public', id))).data();
		let comment = note.comments.find((comment) => comment.id == commentID);

		if (comment.likedBy.includes(user.uid)) {
			comment.likedBy = comment.likedBy.filter((uid) => uid !== user.uid);
		} else {
			comment.likedBy.push(user.uid);
		}
		comment.likes = comment.likedBy.length;
		note.comments.sort((a, b) => b.likes - a.likes);

		setDoc(doc(db, 'public', id), note);
	}

	async function replyToComment(commentID) {
		if (reply.length == 0 || reply == undefined) {
			return;
		}

		let user = get(userStore(auth));
		let note = (await getDoc(doc(db, 'public', id))).data();
		let comment = note.comments.find((comment) => comment.id == commentID);
		let userData = (await getDoc(doc(db, 'users', user.uid))).data();

		comment.replies.push({
			content: reply,
			user: userData.username,
			time: Date.now(),
			id: v4(),
			uid: user?.uid
		});

		comment.replies.sort((a, b) => a.time - b.time);

		setDoc(doc(db, 'public', id), note);

		replyingTo = '';
		reply = '';
	}

	async function deleteReply(commentID, replyID) {
		let note = (await getDoc(doc(db, 'public', id))).data();
		let comment = note.comments.find((comment) => comment.id == commentID);
		comment.replies = comment.replies.filter((reply) => reply.id !== replyID);

		setDoc(doc(db, 'public', id), note);
	}

	async function deleteNote() {
		deleteDoc(doc(db, 'public', id));
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
						<Time timestamp={data.time} /> | {data.likes} likes |
						<a on:click={likeNote}>like</a> |
						<a on:click={reportNote}>{data.reportedBy.includes(user.uid) ? 'unreport' : 'report'}</a
						>
						{#if data.uid == user.uid}
							|
							<a on:click={deleteNote}>delete</a>
						{/if}
					</div>
					<br /><br />
					<SvelteMarkdown source={data.content} />
					<br /><br />
					<h3>{data.comments.length} Comments</h3>
					<textarea name="comment box" id="comment-box" bind:value={comment}></textarea>
					<button on:click={addComment}>add comment</button>
					<br /><br />
					<ul class="list-none">
						{#each data.comments as comment}
							<li class="my-5 list-none">
								<div class="pb-2 text-slate-500">
									{comment.user} | <Time timestamp={comment.time} relative /> | {comment.likes} likes
								</div>
								<SvelteMarkdown source={comment.content} />
								<a class="text-slate-500" on:click={() => likeComment(comment.id)}>like</a>
								|
								<a class="text-slate-500" on:click={() => (replyingTo = comment.id)}>reply</a>
								{#if comment.uid == user.uid}
									|
									<a
										class="mt-2 inline-block text-slate-500"
										on:click={() => deleteComment(comment.id)}>delete</a
									>
								{/if}
								<br /><br />
								{#if replyingTo == comment.id}
									<textarea name="reply box" id="reply-box" bind:value={reply}></textarea>
									<button on:click={() => replyToComment(comment.id)}>reply</button>
								{/if}
								<ul class="list-none">
									{#each comment.replies as reply}
										<li class="mb-5 list-none">
											<div class="pb-2 text-slate-500">
												{reply.user} | <Time timestamp={reply.time} relative />
											</div>
											<SvelteMarkdown source={reply.content} />
											{#if reply.uid == user.uid}
												<a
													class="mt-2 inline-block text-slate-500"
													on:click={() => deleteReply(comment.id, reply.id)}>delete</a
												>
											{/if}
										</li>
									{/each}
								</ul>
							</li>
						{/each}
					</ul>
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
