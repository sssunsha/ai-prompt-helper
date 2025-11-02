export interface Bookmark {
	title: string;
	shortTitle?: string;
	url: string;
	isHidden?: boolean;
}

export interface BookmarkGroup {
	title: string;
	children: Array<Bookmark>;
	isHidden?: boolean;
}
