export interface Note {
	title: string;
	path?: string;
	type: string;
	date?: string;
	children?: Array<Note>;
	isHideChildren?: boolean;
}
