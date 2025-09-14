import { Component } from '@angular/core';
import { FlexibleColumnLayout } from '@fundamental-ngx/core';
import { AppService } from '../app.service';
import { Note } from '../app.model';

@Component({
	selector: 'app-tools',
	templateUrl: './tools.component.html',
	styleUrl: './tools.component.scss',
})
export class ToolsComponent {
	isExpandedPageVisible = false;
	currentDocPath = '';
	Object = Object;

	constructor(public service: AppService) {}

	// TwoColumnsMidExpanded
	// OneColumnStartFullScreen
	get layout(): FlexibleColumnLayout {
		return this.isExpandedPageVisible ? 'TwoColumnsMidExpanded' : 'OneColumnStartFullScreen';
	}

	onListClicked(noteNode: Note | undefined = undefined): void {
		if (!noteNode) {
			this.isExpandedPageVisible = false;
		} else if (noteNode.type === 'folder') {
			noteNode.isHideChildren = !noteNode.isHideChildren;
		} else {
			if (noteNode.path) {
				this.currentDocPath = noteNode.path;
				this.isExpandedPageVisible = true;
			}
		}
	}
}
