import { EventEmitter, Injectable } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { filter } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { promptSamples } from 'src/assets/resources/prompt-samples/prompt-samples';
import { cloneDeep } from 'lodash-es';
import {
	EQuestionType,
	PromptListGroup,
	PromptListItem,
	EAIModelType,
	aiConfigMap,
	PromptAdvancedSetting,
	defaultAdvancedSetting,
	EPromptContentChangedType,
	defaultQuestionTemaplteOption,
	QuestionTemaplteOption,
} from './prompt-generator/prompt-generator.model';
import { Note } from './app.model';

@Injectable({
	providedIn: 'root',
})
export class AppService {
	public screenWidth = window.innerWidth;
	public screenHeight = window.innerHeight;
	public afterEnhancement = '';
	public originalQuestion = '';
	public promptStrategyContent = '';
	public referenceDoc = '';
	public questionType = EQuestionType.SAMPLE;
	public promptSampleList: Array<PromptListGroup> = [];
	public selectedPromptSamples: Array<PromptListItem> = [];
	public aiModel: EAIModelType = EAIModelType.Kimi;
	public aiConfigMap = aiConfigMap;
	public outputFormats: string[] = ['', 'markdown', 'json', '表格', '思维导图', '流程图'];
	public PromptAdvancedSetting: Partial<PromptAdvancedSetting> = cloneDeep(defaultAdvancedSetting);
	public promptContentChangedSubject = new EventEmitter<EPromptContentChangedType>();
	public questionTemplateOptions = defaultQuestionTemaplteOption;
	public selectedQuestionTemplate: QuestionTemaplteOption | undefined;
	public noteList: Array<Note> = [];

	constructor(
		private clipboard: Clipboard,
		private http: HttpClient
	) {
		this.loadPromptSamples();
		this.promptContentChangedSubject
			.pipe(filter(type => type === EPromptContentChangedType.RESULT))
			.subscribe(() => this.updateAfterEnhancement());
		this.initNoteList();
	}

	go(): void {
		this.clipboard.copy(this.afterEnhancement);
		// go to tab of certain AI model website
		window.open(
			!this.aiConfigMap[this.aiModel].isTabOpened ? this.aiConfigMap[this.aiModel].url : '',
			this.aiConfigMap[this.aiModel].name
		);
		this.aiConfigMap[this.aiModel].isTabOpened = true;
	}

	reset(): void {
		this.afterEnhancement = '';
		this.originalQuestion = '';
		this.promptStrategyContent = '';
		this.referenceDoc = '';
		this.selectedPromptSamples = [];
		this.PromptAdvancedSetting = cloneDeep(defaultAdvancedSetting);
		this.promptContentChangedSubject.emit(EPromptContentChangedType.RESET);
	}

	updatePromptAdvancedSetting(): void {
		this.promptContentChangedSubject.emit(EPromptContentChangedType.RESULT);
	}

	get isMobileMode(): boolean {
		return this.screenWidth <= 1024;
	}

	private initNoteList(): void {
		this.http.get('./assets/data.json').subscribe(data => {
			if (data) {
				this.noteList = [];
				this.parseNoteList(data);
			}
		});
	}

	/**
	 *  res example:
	 * {
		"test_foler": {
			"test_file copy.md": {
			"path": "assets/notes/test_foler/test_file copy.md",
			"date": "5/26/2025, 3:44:15 PM"
			},
			"test_file.md": {
			"path": "assets/notes/test_foler/test_file.md",
			"date": "5/26/2025, 3:38:33 PM"
			}
		},
		"家庭教育.md": {
			"path": "assets/notes/家庭教育.md",
			"date": "5/23/2025, 3:45:50 PM"
		}
	}
	 *
	 * @private
	 * @param {*} data
	 * @return {*}  {Array<Note>}
	 * @memberof AppService
	 */
	private parseNoteList(data: any): void {
		Object.entries(data).forEach(([key, value]) => {
			if (!!value) {
				if (typeof value === 'object' && !key.includes('.md')) {
					const folder = key;
					if (folder) {
						const parentNote: Note = {
							title: folder,
							type: 'folder',
							children: [],
						};
						Object.entries(value).forEach(([file, fileInfo]) => {
							const note: Note = {
								title: file,
								path: fileInfo.path,
								type: fileInfo.type || 'file',
								date: fileInfo.date,
							};
							parentNote.children?.push(note);
						});
						this.noteList.push(parentNote);
					}
				} else {
					const note: Note = {
						title: key,
						path: (value as any)['path'] || '',
						type: (value as any)['type'] || '',
						date: (value as any)['date'] || '',
					};
					this.noteList.push(note);
				}
			}
		});
		console.dir(this.noteList);
	}

	private loadPromptSamples(): void {
		this.promptSampleList = promptSamples;
	}

	private isContentEmpty(content: string): boolean {
		if (content?.length > 0 && !!content.match(/\S/g)) {
			return false;
		}
		return true;
	}

	private updateAfterEnhancement(): void {
		this.afterEnhancement = '';
		if (!this.isContentEmpty(this.referenceDoc)) {
			this.afterEnhancement += '我有如下参考资料(中括号内为内容): \n' + `[${this.referenceDoc}]` + '\n';
		}
		if (!!this.selectedPromptSamples.length) {
			this.selectedPromptSamples.forEach(item => {
				this.afterEnhancement += item.content + '\n';
			});
		}
		if (!this.isContentEmpty(this.promptStrategyContent)) {
			this.afterEnhancement += this.promptStrategyContent;
		}
		if (!this.isContentEmpty(this.originalQuestion)) {
			let originalQuestion = this.originalQuestion;
			if (!this.selectedQuestionTemplate) {
				this.afterEnhancement += '我的问题或需求是:\n';
			} else {
				if (!this.selectedQuestionTemplate.isTemplatePrintable) {
					// remove template content
					originalQuestion = this.originalQuestion.replaceAll(/\[\S+\]:/g, '');
				}
			}
			this.afterEnhancement += originalQuestion;
		}

		if (!!this.PromptAdvancedSetting?.enabled) {
			let advancedSettingContent = [];
			if (!!this.PromptAdvancedSetting?.outputFormat) {
				advancedSettingContent.push(`输出格式= ${this.PromptAdvancedSetting.outputFormat}`);
			}
			if (typeof this.PromptAdvancedSetting?.temperature === 'number') {
				advancedSettingContent.push(`temperature= ${this.PromptAdvancedSetting.temperature}`);
			}
			if (typeof this.PromptAdvancedSetting?.top_k === 'number') {
				advancedSettingContent.push(`top_k= ${this.PromptAdvancedSetting.top_k}`);
			}
			if (typeof this.PromptAdvancedSetting?.top_p === 'number') {
				advancedSettingContent.push(`top_p= ${this.PromptAdvancedSetting.top_p}`);
			}
			if (typeof this.PromptAdvancedSetting.frequency_penalty === 'number') {
				advancedSettingContent.push(`frequency_penalty= ${this.PromptAdvancedSetting.frequency_penalty}`);
			}
			if (typeof this.PromptAdvancedSetting.presence_penalty === 'number') {
				advancedSettingContent.push(`presence_penalty= ${this.PromptAdvancedSetting.presence_penalty}`);
			}
			if (!!this.PromptAdvancedSetting.negative) {
				advancedSettingContent.push(`negative(请避免出现): ${this.PromptAdvancedSetting.negative}`);
			}
			if (!!this.PromptAdvancedSetting.max_length) {
				advancedSettingContent.push(`max_length= ${this.PromptAdvancedSetting.max_length}`);
			}
			if (!!advancedSettingContent.length) {
				this.afterEnhancement += `\n[${advancedSettingContent.join('; ')}]`;
			}
		}
	}
}
