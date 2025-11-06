import { BookmarkGroup } from './../reference-document/reference-document.model';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { AppService } from '../app.service';

@Component({
	selector: 'app-daily',
	templateUrl: './daily.component.html',
	styleUrl: './daily.component.scss',
})
export class DailyComponent implements AfterViewInit {
	@ViewChild('favoritesIframe') iframeRef: ElementRef<HTMLIFrameElement> | undefined;

	constructor(public service: AppService) {}

	ngAfterViewInit(): void {
		if (this.iframeRef) {
			this.iframeRef.nativeElement.onload = () => {
				// custom favorites stlye
				if (this.iframeRef && this.iframeRef.nativeElement) {
					const iframe = this.iframeRef.nativeElement;
					const iframeDocument = iframe.contentDocument || iframe.contentWindow?.document;
					if (iframeDocument) {
						const style = iframeDocument.createElement('style');
						style.setAttribute('type', 'text/css');
						style.innerHTML = `
						body {
							font-family: '72';
							font-weight: 400;
							color: white;
							a {
							color: rgb(41, 148, 238);
							line-height: 200%;
							font-size: 1rem;
							}
						}
						
						`;
						iframeDocument.head.appendChild(style);
					}
				}
			};
		}
	}

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
