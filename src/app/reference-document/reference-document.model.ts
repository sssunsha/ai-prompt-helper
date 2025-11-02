export interface Bookmark {
	title: string;
	shortTitle?: string;
	url: string;
}

export interface BookmarkGroup {
	title: string;
	children: Array<Bookmark>;
}
