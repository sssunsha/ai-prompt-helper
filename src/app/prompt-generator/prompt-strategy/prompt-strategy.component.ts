import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatchingStrategy } from '@fundamental-ngx/cdk/data-source';
import { MultiComboboxComponent, MultiComboboxSelectionChangeEvent } from '@fundamental-ngx/core';
import { EPromptStrategy, IPromptStrategy, PromptStrategySelectItem } from './prompt-strategy.model';
import { TitleCasePipe } from '@angular/common';
import { debounceTime, filter, Subscription } from 'rxjs';
import { EPromptContentChangedType } from '../prompt-generator.model';
import { AppService } from 'src/app/app.service';

@Component({
	selector: 'app-prompt-strategy',
	templateUrl: './prompt-strategy.component.html',
	styleUrl: './prompt-strategy.component.scss',
	providers: [TitleCasePipe],
})
export class PromptStrategyComponent implements OnInit, OnDestroy {
	@ViewChild('multiCombobox') multiCombobox: MultiComboboxComponent | undefined;
	matchingStategy = MatchingStrategy.CONTAINS;
	selectedItems: Array<PromptStrategySelectItem> = [];
	dataSource: Array<PromptStrategySelectItem> = [];
	strategyMap: Map<EPromptStrategy, IPromptStrategy> = new Map();
	EPromptContentChangedType = EPromptContentChangedType;
	private subscription: Subscription | undefined;

	constructor(private titleCasePipe: TitleCasePipe, public service: AppService) {}

	ngOnInit(): void {
		Object.values(EPromptStrategy).forEach(value => {
			this.strategyMap.set(value, this.initPromptStrategies(value));
		});
		this.updatePromptStrategyContent(EPromptContentChangedType.STRATEGY);
		this.subscription = this.service.promptContentChangedSubject
			.pipe(
				filter(
					value => value === EPromptContentChangedType.STRATEGY || value === EPromptContentChangedType.RESET
				),
				debounceTime(500)
			)
			.subscribe(value => this.updatePromptStrategyContent(value));
		this.dataSource = Object.values(EPromptStrategy)
			.filter(value => this.strategyMap.get(value)?.strategies?.length)
			.map(value => ({
				id: value,
				name: this.titleCasePipe.transform(value),
			}));
	}

	ngOnDestroy(): void {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}

	onSelect(item: MultiComboboxSelectionChangeEvent): void {
		this.selectedItems = item.selectedItems;
		this.strategyMap.forEach(
			(value, key, map) =>
				(value.enabled = this.selectedItems.find(item => (item as any).id === key) ? true : false)
		);
		this.updatePromptStrategyContent(EPromptContentChangedType.STRATEGY);
	}

	private updatePromptStrategyContent(type: EPromptContentChangedType): void {
		if (type === EPromptContentChangedType.STRATEGY) {
			this.service.promptStrategyContent = '';
			this.strategyMap.forEach((value, key, map) => {
				if (value.enabled) {
					this.service.promptStrategyContent += value.strategies
						.map(item => {
							if (!!item.label && !!item.content) {
								return item.label + '\n' + item.content;
							}
							if (!!item.label && !item.content) {
								return '';
							}
							if (!item.label && !!item.content) {
								return item.content;
							}
							return '';
						})
						.filter(item => !!item)
						.join('\n');
					this.service.promptStrategyContent += '\n';
				}
			});
			this.service.promptContentChangedSubject.next(EPromptContentChangedType.RESULT);
		} else if (type === EPromptContentChangedType.RESET) {
			// reset
			this.selectedItems = [];
			this.strategyMap.forEach((value, key, map) => (value.enabled = false));
			if (this.multiCombobox) {
				this.multiCombobox.setValue([]);
			}
		}
	}

	private initPromptStrategies(type: EPromptStrategy): IPromptStrategy {
		const strategy: IPromptStrategy = {
			enabled: false,
			type: type,
			strategies: [],
			sentenceGlue: [],
		};
		switch (type) {
			case EPromptStrategy.FEW_SHOT_LEARNING:
				// by default create three examples
				strategy.strategies.push({
					label: '请参考下面范例1:',
					content: '',
				});
				strategy.strategies.push({
					label: '和范例2:',
					content: '',
				});
				break;
			case EPromptStrategy.CHAIN_OF_THOUGHT:
				strategy.strategies.push({
					label: '',
					content: '让我们一步一步地解决这个问题，以确保我们有正确的答案。',
				});
				break;
			case EPromptStrategy.META_PROMPTING:
				break;
			case EPromptStrategy.SELF_CONSISTENCY:
				// hard to create prompt for this strategy
				break;
			case EPromptStrategy.GENERATE_KNOWLEDGE_PROMPTING:
				break;
			case EPromptStrategy.PROMPT_CHAINING:
				/*
				提示链可以用于不同的场景，这些场景可能涉及多个操作或转换。例如，LLM 的一个常见用途是根据大型文本文档回答问题。
				想要更好阅读大文本文档，可以设计两个不同的提示，第一个提示负责提取相关引文以回答问题，第二个提示则以引文和原始文档为输入来回答给定的问题。
				换句话说，可以创建两个不同的提示来执行根据文档回答问题的任务。
				*/
				break;
			case EPromptStrategy.TREE_OF_THOUGHTS:
				/*对于需要探索或预判战略的复杂任务来说，传统或简单的提示技巧是不够的。
				最近，Yao et el. (2023) 提出了思维树（Tree of Thoughts，ToT）框架，该框架基于思维链提示进行了总结，引导语言模型探索把思维作为中间步骤来解决通用问题。
				*/
				strategy.strategies.push({
					label: '',
					content:
						'假设三位不同的专家来回答这个问题。所有专家都写下他们思考这个问题的第一个步骤，然后与大家分享。然后，所有专家都写下他们思考的下一个步骤并分享。以此类推，直到所有专家写完他们思考的所有步骤。只要大家发现有专家的步骤出错了，就让这位专家离开.',
				});
				break;
			case EPromptStrategy.RETRIEVAL_AUGMENTED_GENERATION:
				break;
			case EPromptStrategy.AUTAMATIC_REASONING_AND_TOOL_USE:
				break;
			case EPromptStrategy.AUTOMATIC_PROMPT_ENGINNER:
				break;
			case EPromptStrategy.ACIVE_PROMPT:
				break;
			case EPromptStrategy.DIRECTIONAL_STIMULUS_PROMPTING:
				strategy.strategies.push({
					label: '基于下面这些关键字:',
					content: '',
				});
				break;
				break;
			case EPromptStrategy.PROGRAM_AIDED_LANGUAGE_MODELS:
				break;
			case EPromptStrategy.REACT:
				break;
			case EPromptStrategy.REFLEXION:
				break;
			case EPromptStrategy.MULTIMODAL_COT:
				break;
			case EPromptStrategy.GRAPH_PROMPTING:
				break;
			default:
				break;
		}
		return strategy;
	}
}
