import { PromptListItem } from 'src/app/prompt-generator/prompt-generator.model';
export const readABookPrompts: Array<PromptListItem> = [
	{
		title: '总体分析一本书',
		content:
			'请你作为本书的作者，帮我分析《》这本书，每章的主要论点和相关的论据已经推论过程，并且生成不少于1500字的整本书大意总结。',
	},
	{
		title: '细分书的每一章',
		content:
			'请分别列出本书每一章最精彩的一些方法和论点，请列出具体内容，不要用总结性的语句，每章请列出5-10个，最少7个，用列表形式',
	},
	{
		title: '基于《如何阅读一本书》的分析阅读',
		content:
			'请你做为资深书评人，基于《如何阅读一本书》中提到的分析阅读的方法与技巧，对《》进行分析阅读拆解，列出所有分析环节',
	},
];
