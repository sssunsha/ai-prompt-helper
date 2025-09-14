export interface PromptStrategySelectItem {
	id: string;
	name: string;
}

export enum EPromptStrategy {
	// ZERO_SHOT_LEARNING = "ZERO_SHOT_LEARNING", // 零样本提示学习， default strategy 不用配置
	FEW_SHOT_LEARNING = 'FEW_SHOT_LEARNING', // 少样本提示学习
	CHAIN_OF_THOUGHT = 'CHAIN_OF_THOUGHT', // 链式思维
	META_PROMPTING = 'META_PROMPTING', // 元提示 (没看明白：https://www.promptingguide.ai/techniques/meta-prompting)
	SELF_CONSISTENCY = 'SELF_CONSISTENCY', //自洽性 （没看明白: https://www.promptingguide.ai/techniques/consistency ）
	GENERATE_KNOWLEDGE_PROMPTING = 'GENERATE_KNOWLEDGE_PROMPTING',
	PROMPT_CHAINING = 'PROMPT_CHAINING',
	TREE_OF_THOUGHTS = 'TREE_OF_THOUGHTS',
	RETRIEVAL_AUGMENTED_GENERATION = 'RETRIEVAL_AUGMENTED_GENERATION',
	AUTAMATIC_REASONING_AND_TOOL_USE = 'AUTAMATIC_REASONING_AND_TOOL_USE',
	AUTOMATIC_PROMPT_ENGINNER = 'AUTOMATIC_PROMPT_ENGINNER',
	ACIVE_PROMPT = 'ACIVE_PROMPT',
	DIRECTIONAL_STIMULUS_PROMPTING = 'DIRECTIONAL_STIMULUS_PROMPTING',
	PROGRAM_AIDED_LANGUAGE_MODELS = 'PROGRAM_AIDED_LANGUAGE_MODELS',
	REACT = 'REACT',
	REFLEXION = 'REFLEXION',
	MULTIMODAL_COT = 'MULTIMODAL_COT',
	GRAPH_PROMPTING = 'GRAPH_PROMPTING',
}

export interface IPromptStrategyConfig {
	label: string;
	content: string;
}

export interface IPromptStrategy {
	enabled?: boolean;
	type: EPromptStrategy;
	strategies: Array<IPromptStrategyConfig>;
	sentenceGlue: Array<string>;
}
