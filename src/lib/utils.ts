import {
	DocumentSnapshot,
	addDoc,
	collection,
	deleteDoc,
	getDoc,
	setDoc,
	type DocumentData,
	doc
} from 'firebase/firestore';
import { userStore } from 'sveltefire';
import { get } from 'svelte/store';
import { authStore, dbStore } from './stores';
import { toast } from 'svelte-sonner';
import { v4 } from 'uuid';
import type { commentType, localNoteType, replyType } from './types';
import { goto } from '$app/navigation';

const user = userStore(get(authStore));

export async function deleteComment(noteID: string | null, commentID: string) {
	if (!get(user)) {
		toast.error('User not found.', {
			description:
				'Sometimes this happens if you try to perform an action just after the page loads, just give it a sec and retry.'
		});
		return;
	}

	if (!noteID) {
		toast.error('No note ID???', {
			description:
				"I don't even know how this could happen. There's no way right? It should redirect you immidiately if there's no note ID. If you managed to make this happen, good job!"
		});
	}

	const note = (await getDoc(doc(get(dbStore), 'public', noteID!))).data();
	if (!note) {
		toast.error('Note not found.');
		return;
	}

	note.comments = note.comments.filter((comment: commentType) => comment.id !== commentID);

	setDoc(doc(get(dbStore), 'public', noteID!), note);
}

export async function replyToComment(noteID: string | null, commentID: string, content: string) {
	if (!get(user)) {
		toast.error('User not found.', {
			description:
				'Sometimes this happens if you try to perform an action just after the page loads, just give it a sec and retry.'
		});
		return;
	}

	if (!noteID) {
		toast.error('No note ID???', {
			description:
				"I don't even know how this could happen. There's no way right? It should redirect you immidiately if there's no note ID. If you managed to make this happen, good job!"
		});
	}

	if (content.length == 0 || content == undefined) {
		return;
	}

	const note = (await getDoc(doc(get(dbStore), 'public', noteID!))).data();
	if (!note) {
		toast.error('Note not found');
		return;
	}

	const comment = note.comments.find((comment: commentType) => comment.id == commentID);
	if (!comment) {
		toast.error('Comment not found.');
		return;
	}

	const userData = (await getDoc(doc(get(dbStore), 'users', get(user)!.uid))).data();
	if (!userData) {
		toast.error('Failed to get user data.');
		return;
	}

	comment.replies.push({
		content: content,
		user: userData.username,
		time: Date.now(),
		id: v4(),
		uid: get(user)!.uid
	});

	comment.replies.sort((a: replyType, b: replyType) => a.time - b.time);

	setDoc(doc(get(dbStore), 'public', noteID!), note);
}

export async function deleteReply(noteID: string | null, commentID: string, replyID: string) {
	if (!noteID) {
		toast.error('No note ID???', {
			description:
				"I don't even know how this could happen. There's no way right? It should redirect you immidiately if there's no note ID. If you managed to make this happen, good job!"
		});
	}

	const note = (await getDoc(doc(get(dbStore), 'public', noteID!))).data();
	if (!note) {
		toast.error('Note not found.');
		return;
	}

	const comment = note.comments.find((comment: commentType) => comment.id == commentID);
	comment.replies = comment.replies.filter((reply: replyType) => reply.id !== replyID);

	setDoc(doc(get(dbStore), 'public', noteID!), note);
}

export async function deletePublicNote(noteID: string | null) {
	if (!noteID) {
		toast.error('No note ID???', {
			description:
				"I don't even know how this could happen. There's no way right? It should redirect you immidiately if there's no note ID. If you managed to make this happen, good job!"
		});
	}

	deleteDoc(doc(get(dbStore), 'public', noteID!));

	goto('/browse');
}

export async function likeNote(noteID: string | null) {
	if (!get(user)) {
		toast.error('User not found.', {
			description:
				'Sometimes this happens if you try to perform an action just after the page loads, just give it a sec and retry.'
		});
		return;
	}

	if (!noteID) {
		toast.error('No note ID???', {
			description:
				"I don't even know how this could happen. There's no way right? It should redirect you immidiately if there's no note ID. If you managed to make this happen, good job!"
		});
	}

	const note = (await getDoc(doc(get(dbStore), 'public', noteID!))).data();
	if (!get(user)) {
		toast.error('User not found.', {
			description:
				'Sometimes this happens if you try to perform an action just after the page loads, just give it a sec and retry.'
		});
		return;
	}

	if (!note) {
		toast.error('Note not found.');
		return;
	}

	if (note.likedBy.includes(get(user)!.uid)) {
		note.likedBy = note.likedBy.filter((noteID: string) => noteID !== get(user)!.uid);
	} else {
		note.likedBy.push(get(user)!.uid);
	}

	note.likes = note.likedBy.length;

	setDoc(doc(get(dbStore), 'public', noteID!), note);
}

export async function likeComment(noteID: string | null, commentID: string) {
	if (!get(user)) {
		toast.error('User not found.', {
			description:
				'Sometimes this happens if you try to perform an action just after the page loads, just give it a sec and retry.'
		});
		return;
	}

	if (!noteID) {
		toast.error('No note ID???', {
			description:
				"I don't even know how this could happen. There's no way right? It should redirect you immidiately if there's no note ID. If you managed to make this happen, good job!"
		});
	}

	const note = (await getDoc(doc(get(dbStore), 'public', noteID!))).data();
	if (!note) {
		toast.error('Note not found.');
		return;
	}

	const comment = note.comments.find((comment: commentType) => comment.id == commentID);

	if (comment.likedBy.includes(get(user)!.uid)) {
		comment.likedBy = comment.likedBy.filter((uid: string) => uid !== get(user)!.uid);
	} else {
		comment.likedBy.push(get(user)!.uid);
	}
	comment.likes = comment.likedBy.length;
	note.comments.sort((a: commentType, b: commentType) => b.likes - a.likes);

	setDoc(doc(get(dbStore), 'public', noteID!), note);
}

export async function addComment(noteID: string | null, content: string) {
	if (!get(user)) {
		toast.error('User not found.', {
			description:
				'Sometimes this happens if you try to perform an action just after the page loads, just give it a sec and retry.'
		});
		return;
	}

	if (!noteID) {
		toast.error('No note ID???', {
			description:
				"I don't even know how this could happen. There's no way right? It should redirect you immidiately if there's no note ID. If you managed to make this happen, good job!"
		});
	}

	if (content.length == 0) {
		toast.error('Comment too short.');
		return;
	}

	const note = (await getDoc(doc(get(dbStore), 'public', noteID!))).data();
	if (!note) {
		toast.error('Note not found.');
		return;
	}

	const userData = (await getDoc(doc(get(dbStore), 'users', get(user)!.uid))).data();
	if (!userData) {
		toast.error("Couldn't fetch user data.");
		return;
	}

	note.comments.push({
		content: content,
		user: userData.username,
		time: Date.now(),
		likes: 0,
		likedBy: [],
		replies: [],
		id: v4(),
		uid: get(user)!.uid
	});

	note.comments.sort((a: commentType, b: commentType) => b.likes - a.likes);

	setDoc(doc(get(dbStore), 'public', noteID!), note);
}

export async function reportNote(noteID: string | null) {
	if (!get(user)) {
		toast.error('User not found.', {
			description:
				'Sometimes this happens if you try to perform an action just after the page loads, just give it a sec and retry.'
		});
		return;
	}

	if (!noteID) {
		toast.error('No note ID???', {
			description:
				"I don't even know how this could happen. There's no way right? It should redirect you immidiately if there's no note ID. If you managed to make this happen, good job!"
		});
	}

	const note = (await getDoc(doc(get(dbStore), 'public', noteID!))).data();
	if (!note) {
		toast.error('Note not found.');
		return;
	}

	if (note.reportedBy.includes(get(user)!.uid)) {
		note.reportedBy = note.reportedBy.filter((id: string) => id !== get(user)!.uid);
	} else {
		note.reportedBy.push(get(user)!.uid);
	}

	note.reports = note.reportedBy.length;

	if (note.reports > 5) {
		deleteDoc(doc(get(dbStore), 'public', noteID!));
	} else {
		setDoc(doc(get(dbStore), 'public', noteID!), note);
	}
}

export async function deleteLocalNote(noteID: string | null) {
	if (!get(user)) {
		toast.error('User not found.', {
			description:
				'Sometimes this happens if you try to perform an action just after the page loads, just give it a sec and retry.'
		});
		return;
	}

	if (!noteID) {
		toast.error('No note ID (this should be impossible).');
	}

	const data = (await getDoc(doc(get(dbStore), 'users', get(user)!.uid))).data();
	if (!data) {
		toast.error('Unable to fetch user data.');
		return;
	}

	let notes = data.notes;
	notes = notes.filter((note: localNoteType) => note.id != noteID!);
	data.notes = notes;

	setDoc(doc(get(dbStore), 'users', get(user)!.uid), data);

	goto('/');
}

export async function deleteSharedNote(noteID: string | null) {
	if (!get(user)) {
		toast.error('User not found.', {
			description:
				'Sometimes this happens if you try to perform an action just after the page loads, just give it a sec and retry.'
		});
		return;
	}

	if (!noteID) {
		toast.error('No note ID (this should be impossible).');
	}

	const note = await getDoc(doc(get(dbStore), 'shared', noteID!));

	note.data().sharedUsers.forEach(async (user) => {
		const docRef = doc(get(dbStore), 'sharedRefs', user);
		const ref = (await getDoc(docRef)).data();

		if (!ref) {
			return;
		}

		ref.notes = ref.notes.filter((note) => note != noteID);

		setDoc(docRef, ref);
	});

	deleteDoc(doc(get(dbStore), 'shared', noteID!));

	goto('/');
}

export async function publishNote(noteID: string | null) {
	const userSnap = get(user);
	if (!userSnap) {
		toast.error('User not found.', {
			description:
				'Sometimes this happens if you try to perform an action just after the page loads, just give it a sec and retry.'
		});
		return;
	}

	if (!noteID) {
		toast.error('No note ID?????');
		return;
	}

	const userData = (await getDoc(doc(get(dbStore), 'users', userSnap.uid))).data();
	if (!userData) {
		toast.error('Unable to fetch user data.');
		return;
	}

	const note = userData.notes.find((note: localNoteType) => note.id == noteID);
	const username = userData.username;

	const docRef = await addDoc(collection(get(dbStore), 'public'), {
		title: note.title,
		content: note.content,
		time: note.time,
		user: username,
		likes: 0,
		likedBy: [],
		reports: 0,
		reportedBy: [],
		comments: [],
		uid: userSnap.uid
	});

	goto(`/view?id=${docRef.id}`);
}

async function getLocalNote(noteID: string): Promise<localNoteType | undefined> {
	if (!noteID) {
		toast.error('Note not found.');
		return;
	}

	const docSnap: DocumentSnapshot = await getDoc(doc(get(dbStore), 'users', get(user)!.uid))!;
	const data: DocumentData | undefined = docSnap.data();
	const note = data!.notes.find((note: localNoteType) => note.id == noteID);

	return note;
}

export async function shareNote(noteID: string | null, email: string) {
	const userSnap = get(user);

	if (!userSnap) {
		toast.error('User not found.');
		return;
	}

	if (!email) {
		toast.error('No user identifier.');
		return;
	}

	const note = await getLocalNote(noteID!);

	if (!note) {
		toast.error('Note not found.');
		return;
	}

	setDoc(doc(get(dbStore), 'shared', noteID!), {
		...note,
		sharedUsers: [email, userSnap.email]
	});

	let userSharedRefs = (await getDoc(doc(get(dbStore), 'sharedRefs', userSnap.email!))).data();

	if (!userSharedRefs) {
		userSharedRefs = { notes: [] };
	}

	if (!userSharedRefs.notes) {
		userSharedRefs.notes = [];
	}

	userSharedRefs.notes.push(noteID);
	setDoc(doc(get(dbStore), 'sharedRefs', userSnap.email!), userSharedRefs);

	let user2SharedRefs = (await getDoc(doc(get(dbStore), 'sharedRefs', email))).data();

	if (!user2SharedRefs) {
		user2SharedRefs = { notes: [] };
	}

	if (!user2SharedRefs.notes) {
		user2SharedRefs.notes = [];
	}

	user2SharedRefs.notes.push(noteID);
	setDoc(doc(get(dbStore), 'sharedRefs', email), user2SharedRefs);

	toast.success('Shared!');
}
