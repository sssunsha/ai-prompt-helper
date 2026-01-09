export enum InvestmentType {
	FUND = 'FUND', // 主题基金
	STOCK = 'STOCK', // 股票
	ETF = 'ETF', // 场外ETF基金
	INDEX = 'INDEX', // 指数
}

export enum IndexCategory {
	WIDE = 'WIDE',
	INDUSTRY = 'INDUSTRY',
	STRATEGY = 'STRATEGY',
	HK = 'HK',
	GLOBAL = 'GLOBAL',
	OTHERS = 'OTHERS',
}

export interface Investment {
	name: string;
	id: string;
	type: InvestmentType;
	description: string;
	content: string;
}

export interface Index {
	category: IndexCategory;
	value: Array<Investment>;
}

export interface InvestmentGroup {
	indexList: Array<Index>;
	wideETFSuggestionList: Array<any>;
}

export enum InvestmentListType {
	index_reference = 'index_reference',
	wide_etf_suggestion = 'wide_etf_suggestion',
	others = 'others',
}
