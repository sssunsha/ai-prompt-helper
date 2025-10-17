import { PromptListGroup, PromptListItem } from 'src/app/prompt-generator/prompt-generator.model';
import { rolePrompts } from './roles';
import { generalPersonalPrompts } from './general/general-personals';
import { readABookPrompts } from './read-a-book';
import { financialPrompts } from 'public/assets/resources/prompt-samples/financial';

export const promptSamples: Array<PromptListGroup> = [
	{
		title: '通用-个人模板(ChatAI)',
		items: generalPersonalPrompts as Array<PromptListItem>,
	},
	{
		title: '身份',
		items: rolePrompts,
	},
	{
		title: '读书',
		items: readABookPrompts,
	},
	{
		title: '金融',
		items: financialPrompts,
	},
];
