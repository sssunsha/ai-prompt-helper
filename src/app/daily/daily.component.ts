import { BookmarkGroup } from './../reference-document/reference-document.model';
import { Component } from '@angular/core';
import { AppService } from '../app.service';

@Component({
	selector: 'app-daily',
	templateUrl: './daily.component.html',
	styleUrl: './daily.component.scss',
})
export class DailyComponent {
	constructor(public service: AppService) {}

	isBookmarkVisible(groupTitle: string, bookmarkTitle: string = '', bookmarkShortTitle: string = ''): boolean {
		if (this.service.bookmarkKeyword) {
			const keyword = this.service.bookmarkKeyword.toLowerCase();
			if (groupTitle.toLowerCase().includes(keyword)) {
				return true;
			}
			if (bookmarkTitle.toLowerCase().includes(keyword)) {
				return true;
			}
			if (bookmarkShortTitle && bookmarkShortTitle.toLowerCase().includes(keyword)) {
				return true;
			}
			return false;
		}
		return true;
	}

	onBookmarkKeywordChanged(): void {
		// Trigger change detection
		this.service.bookmarkGroups.forEach(group => {
			group.isHidden = !this.isBookmarkVisible(group.title);
			group.children.forEach(bookmark => {
				bookmark.isHidden = !this.isBookmarkVisible(group.title, bookmark.title, bookmark.shortTitle);
				group.isHidden &&= bookmark.isHidden;
			});
		});
	}
}
