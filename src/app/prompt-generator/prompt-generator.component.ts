/**
 * 2025 SAP SE or an SAP affiliate company. All rights reserved.
 */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { EPromptContentChangedType, QuestionTemaplteOption } from './prompt-generator.model';

import { debounceTime, filter, Subscription } from 'rxjs';
import { AppService } from '../app.service';

@Component({
	selector: 'app-prompt-generator',
	templateUrl: './prompt-generator.component.html',
	styleUrl: './prompt-generator.component.scss',
})
export class PromptGeneratorComponent implements OnInit, OnDestroy {
	private subscription: Subscription | undefined;
	EPromptContentChangedType = EPromptContentChangedType;

	constructor(public service: AppService) {
		this.subscription = this.service.promptContentChangedSubject
			.pipe(
				filter(
					value =>
						value === EPromptContentChangedType.QUESTION ||
						value === EPromptContentChangedType.REFERENCE_DOC
				),
				debounceTime(500)
			)
			.subscribe(() => this.updatePromptQuestion());
	}

	ngOnDestroy(): void {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}
	ngOnInit(): void {}

	go(): void {
		this.service.go();
	}

	clean(): void {
		this.service.reset();
	}

	handleQuestionTemplateChange(event: QuestionTemaplteOption): void {
		if (!!event && event.title !== this.service.selectedQuestionTemplate?.title) {
			this.service.originalQuestion = event.templates.map(t => `[${t}]:`).join('\n\n');
			this.service.selectedQuestionTemplate = event;
		}
	}

	private updatePromptQuestion(): void {
		this.service.promptContentChangedSubject.next(EPromptContentChangedType.RESULT);
	}
}
