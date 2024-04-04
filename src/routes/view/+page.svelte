<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { Doc, SignedIn, FirebaseApp } from 'sveltefire';
	import { type Auth } from 'firebase/auth';
	import { Firestore } from 'firebase/firestore';
	import SvelteMarkdown from 'svelte-markdown';
	import Navbar from '$lib/Navbar.svelte';
	import Time from 'svelte-time/src/Time.svelte';
	import {
		deleteComment,
		replyToComment,
		deleteReply,
		deletePublicNote,
		likeNote,
		addComment,
		reportNote,
		likeComment
	} from '$lib/utils';
	import { initApp } from '$lib/app';
	import { toast } from 'svelte-sonner';
	import { authStore, dbStore, appStore } from '$lib/stores';

	let id: string | null, comment: string, replyingTo: string, reply: string;

	onMount(async () => {
		if ($page.url.searchParams.get('id')) {
			id = $page.url.searchParams.get('id');
		} else {
			goto('/');
		}
	});
</script>

<svelte:head><title>View note</title></svelte:head>

<FirebaseApp auth={$authStore} firestore={$dbStore}>
	<div class="container">
		<Navbar />
		<SignedIn let:user>
			{#if id}
				<Doc ref="/public/{id}" let:data>
					<h1>{data.title}</h1>
					<div class="gap-5 border font-mono text-slate-500">
						<Time timestamp={data.time} /> | {data.likes} likes |
						<a on:click={() => likeNote(id)}>like</a> |
						<a on:click={() => reportNote(id)}
							>{data.reportedBy.includes(user.uid) ? 'unreport' : 'report'}</a
						>
						{#if data.uid == user.uid}
							|
							<a on:click={() => deletePublicNote(id)}>delete</a>
						{/if}
					</div>
					<br /><br />
					<SvelteMarkdown source={data.content} />
					<br /><br />
					<h3>{data.comments.length} Comments</h3>
					<textarea name="comment box" id="comment-box" bind:value={comment}></textarea>
					<button
						on:click={() => {
							addComment(id, comment);
							comment = '';
						}}>add comment</button
					>
					<br /><br />
					<ul class="list-none">
						{#each data.comments as comment}
							<li class="my-5 list-none">
								<div class="pb-2 text-slate-500">
									{comment.user} | <Time timestamp={comment.time} relative /> | {comment.likes} likes
								</div>
								<SvelteMarkdown source={comment.content} />
								<a class="text-slate-500" on:click={() => likeComment(id, comment.id)}>like</a>
								|
								<a class="text-slate-500" on:click={() => (replyingTo = comment.id)}>reply</a>
								{#if comment.uid == user.uid}
									|
									<a
										class="mt-2 inline-block text-slate-500"
										on:click={() => deleteComment(id, comment.id)}>delete</a
									>
								{/if}
								<br /><br />
								{#if replyingTo == comment.id}
									<textarea name="reply box" id="reply-box" bind:value={reply}></textarea>
									<button
										on:click={() => {
											replyToComment(id, comment.id, reply);
											reply = '';
											replyingTo = '';
										}}>reply</button
									>
								{/if}
								<div
									class="border-x-0 border-y-0 border-l border-l-4 border-solid border-slate-500/20"
								>
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
														on:click={() => {
															deleteReply(id, comment.id, reply.id);
														}}>delete</a
													>
												{/if}
											</li>
										{/each}
									</ul>
								</div>
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
