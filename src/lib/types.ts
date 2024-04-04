export type commentType = {
	content: string;
	user: string;
	time: number;
	likes: number;
	likedBy: Array<string>;
	id: string;
	uid: string;
	replies: Array<replyType>;
};

export type replyType = {
	content: string;
	user: string;
	time: number;
	id: string;
	uid: string;
};

export type localNoteType = {
	title: string;
	content: string;
	id: string;
	time: number;
};

export type publicNoteType = {
	title: string;
	content: string;
	time: number;
	user: string;
	likes: number;
	reports: number;
	likedBy: Array<string>;
	reportedBy: Array<string>;
	comments: Array<commentType>;
	uid: string;
};
