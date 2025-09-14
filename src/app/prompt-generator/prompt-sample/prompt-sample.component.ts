import { Component, OnDestroy, OnInit } from '@angular/core';
import { EPromptContentChangedType, PromptListGroup, PromptListItem } from '../prompt-generator.model';
import { filter, Subscription } from 'rxjs';
import { cloneDeep } from 'lodash-es';
import { AppService } from 'src/app/app.service';

@Component({
	selector: 'app-prompt-sample',
	templateUrl: './prompt-sample.component.html',
	styleUrl: './prompt-sample.component.scss',
})
export class PromptSampleComponent implements OnInit, OnDestroy {
	displayedGroups: Array<PromptListGroup> = [];
	searchTerm = '';
	private subscription: Subscription | undefined;

	constructor(public service: AppService) {
		this.subscription = this.service.promptContentChangedSubject
			.pipe(filter(type => type === EPromptContentChangedType.READY || type === EPromptContentChangedType.RESET))
			.subscribe(() => this.handleSearchTermChange(''));
	}
	ngOnDestroy(): void {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}

	ngOnInit(): void {
		this.handleSearchTermChange('');
	}

	handleSearchTermChange(searchTerm: string): void {
		this.searchTerm = searchTerm;
		this.displayedGroups = cloneDeep(this.service.promptSampleList).filter(group => {
			group.items = group.items.filter(
				item => !searchTerm || item.title.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
			);
			group.expanded = !!searchTerm ? true : false;
			return (
				!searchTerm ||
				group.title.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
				group.items.some(
					item =>
						item.title.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
						item.description?.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
				)
			);
		});
	}

	onSelected(item: PromptListItem): void {
		item.selected = !item.selected;
		this.service.selectedPromptSamples = this.service.selectedPromptSamples.includes(item)
			? this.service.selectedPromptSamples.filter(i => i !== item)
			: [...this.service.selectedPromptSamples, item];
		this.service.promptContentChangedSubject.next(EPromptContentChangedType.RESULT);
	}

	onExpand(group: PromptListGroup): void {
		group.expanded = !group.expanded;
	}
}
