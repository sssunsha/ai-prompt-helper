import { PromptListItem } from 'src/app/prompt-generator/prompt-generator.model';
export const financialPrompts: Array<PromptListItem> = [
	{
		title: '股市逃顶评估',
		content:
			'1. 请你做为资深股票分析师，帮我总结在A股投资市场上最常见判断牛市已经结束，或者需要逃顶卖出手上股票的时间点的重要信号。请根据从最重要最明确反应时机的分析信号开始，帮我列出10大信号。并说明原因和推荐操作判断方法。 \n\
2.请根据上述几个判断点，对当下A股进行判断，是否到逃顶点，并且针对不同板块当下是否需要卖出，做出判断，通过表格或图表展示。',
	},
	{
		title: '宽基和行业ETF历史百分位分析',
		content: '请列出所有宽基ETF(不少于10种)和主要行业ETF(不少于30种)的PE分位和股息率，用图表显示',
	},
];
