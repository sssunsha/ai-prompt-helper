/**
 * 2025 SAP SE or an SAP affiliate company. All rights reserved.
 */

export enum EQuestionType {
	TYPING = 'TYPING',
	SAMPLE = 'SAMPLE',
}

export enum EPromptContentChangedType {
	READY = 0,
	STRATEGY = 100,
	QUESTION = 200,
	REFERENCE_DOC = 300,
	ADVANCED_SETTING = 400,
	RESULT = 999,
	RESET = 1000,
}

export interface PromptListGroup {
	items: Array<PromptListItem>;
	title: string;
	expanded?: boolean;
}

export interface PromptListItem {
	title: string;
	content: string;
	description?: string;
	selected?: boolean;
}

/*
AI 背景设置
与 temperature 和 top_p 一样，一般建议是改变 frequency penalty 和 presence penalty 其中一个参数就行，不要同时调整两个。
frequency_penalty  ：减少重复词语的出现，使文本更加多样化。
presence_penalty  ：鼓励引入新词语，增加文本的丰富性。
*/

/*
范例：
    你是一名资深营养师（角色），需要为糖尿病患者设计一周食谱（背景）。要求：
    1. 每日三餐热量控制在1500大卡内
    2. 标注每道菜的升糖指数（GI值）
    3. 附采购清单，区分必需与可选食材
    输出格式：Markdown表格，包含“餐别|菜品|GI值|热量”列
*/

export interface PromptAdvancedSetting {
	enabled: boolean;
	outputFormat: string; // 输出格式
	negative: string; // 不做什么的指令(负向约束) user
	temperature: number | undefined; // 0 ~2
	top_p: number | undefined; // 0 ~ 1
	top_k: number | undefined; // 0 ~ 100
	max_length: number | undefined;
	frequency_penalty: number | undefined; // -2.0 ~ 2.0
	presence_penalty: number | undefined; // -2.0 ~ 2.0
}

export const defaultAdvancedSetting: PromptAdvancedSetting = {
	enabled: false,
	outputFormat: '',
	negative: '',
	temperature: undefined,
	top_p: undefined,
	top_k: undefined,
	max_length: undefined,
	frequency_penalty: undefined,
	presence_penalty: undefined,
};

/*
你正在扮演[角色]，具有[特征1]、[特征2]... 请按照以下原则响应：
1. 优先使用[某领域]专业术语
2. 当遇到[某类问题]时，参考[某标准/理论]
3. 避免[某些行为]

你是一名有10年经验的刑事律师，熟悉中国刑法修订案（十一）。请分析以下案情：
[案情描述]...
要求：
- 引用具体法条（格式：第X条第X款）
- 评估原告/被告的有利/不利因素
- 给出3种可能的辩护策略     
*/
export interface Role {
	title: string;
	characteristics: Array<string>;
}

export enum EAIModelType {
	Kimi = 0,
	TenXunYuanBao,
	DouBao,
	QianWen,
	WenYan,
	MiTaSouSuo,
	DeepSeek,
}

export interface AIModelConfig {
	name: string;
	url: string;
	isTabOpened: boolean;
	type: EAIModelType;
}
export const aiConfigMap = {
	[EAIModelType.TenXunYuanBao]: {
		name: '腾讯元宝',
		url: 'https://yuanbao.tencent.com/discovery',
		isTabOpened: false,
		type: EAIModelType.TenXunYuanBao,
	},
	[EAIModelType.Kimi]: {
		name: 'Kimi',
		url: 'https://kimi.moonshot.cn/',
		isTabOpened: false,
		type: EAIModelType.Kimi,
	},
	[EAIModelType.WenYan]: {
		name: '文言一心',
		url: 'https://yiyan.baidu.com/',
		isTabOpened: false,
		type: EAIModelType.WenYan,
	},
	[EAIModelType.DouBao]: {
		name: '豆宝',
		url: 'https://www.doubao.com/chat/',
		isTabOpened: false,
		type: EAIModelType.DouBao,
	},
	[EAIModelType.QianWen]: {
		name: '通义千问',
		url: 'https://tongyi.aliyun.com/qianwen/',
		isTabOpened: false,
		type: EAIModelType.QianWen,
	},
	[EAIModelType.DeepSeek]: {
		name: 'DeepSeek',
		url: 'https://chat.deepseek.com/',
		isTabOpened: false,
		type: EAIModelType.DeepSeek,
	},
	[EAIModelType.MiTaSouSuo]: {
		name: '秘塔AI搜索',
		url: 'https://metaso.cn/',
		isTabOpened: false,
		type: EAIModelType.MiTaSouSuo,
	},
};

export interface QuestionTemaplteOption {
	title: string;
	templates: Array<string>;
	isTemplatePrintable?: boolean;
	description?: string;
}

export const defaultQuestionTemaplteOption: Array<QuestionTemaplteOption> = [
	{
		title: '无',
		templates: [],
	},
	{
		title: '三段式提示词模版',
		templates: ['我是谁', '我要做什么', '我有什么要求'],
	},
	{
		title: 'APE 提示词模版',
		templates: ['ACTION 行动', 'PURPOSE 目的', 'EXPECTATION 期望'],
		isTemplatePrintable: true,
	},
	{
		title: 'BROKE 提示词模版',
		templates: ['BACKGROUND 背景', 'ROLE 角色', 'OBJECTIVES 目标', 'KEY RESULT 关键结果', 'EVOLVE 试验并改进'],
		isTemplatePrintable: true,
	},
	{
		title: 'COAST 提示词模版',
		templates: ['CONTEXT 背景，上下文', 'OBJECTIVE 目的', 'ACTION 行动', 'SCENARIO 方案', 'TASK 任务'],
		isTemplatePrintable: true,
	},
	{
		title: 'TAG 提示词模版',
		templates: ['TASK 任务', 'ACTION 行动', 'GOAL 目标'],
		isTemplatePrintable: true,
	},
	{
		title: 'RISE 提示词模版',
		templates: ['RISE ROLE 角色', 'INPUT 输入', 'STEPS 步骤'],
		isTemplatePrintable: true,
	},
	{
		title: 'TRACE 提示词模版',
		templates: ['TASK 任务', 'REQUEST 请求', 'ACTION 行动', 'CONTEXT 上下文', 'EXAMPLE 示例'],
		isTemplatePrintable: true,
	},
];
