export interface Note {
	title: string;
	path?: string;
	type: string;
	date?: string;
	children?: Array<Note>;
	isHideChildren?: boolean;
}

export const DEFAULT_TAB_INDEX_KEY = '[ai-prompt-helper]default-tab-index';

export interface ActiveIndex {
	index: number;
	subIndex?: number;
}
