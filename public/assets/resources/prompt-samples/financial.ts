import { PromptListItem } from 'src/app/prompt-generator/prompt-generator.model';
export const financialPrompts: Array<PromptListItem> = [
	{
		title: '当前A股逃顶风险分析',
		content:
			'1. 请你做为资深股票分析师，帮我总结在A股投资市场上最常见判断牛市已经结束，或者需要逃顶卖出手上股票的时间点的重要信号。请根据从最重要最明确反应时机的分析信号开始，帮我列出5大信号。并说明原因和推荐操作判断方法。\n\
2. 然后再请根据问题1中得出的几个判断点，对当下A股进行判断，是否到逃顶点，并且针对不同板块当下是否需要卖出，做出判断',
	},
];
