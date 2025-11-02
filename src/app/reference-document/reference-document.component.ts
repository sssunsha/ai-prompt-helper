import { Component } from '@angular/core';
import { BookmarkGroup } from './reference-document.model';
import { AppService } from '../app.service';

@Component({
	selector: 'app-reference-document',
	templateUrl: './reference-document.component.html',
	styleUrl: './reference-document.component.scss',
})
export class ReferenceDocumentComponent {
	bookmarkGroups: Array<BookmarkGroup> = [];
	constructor(public service: AppService) {}
}
