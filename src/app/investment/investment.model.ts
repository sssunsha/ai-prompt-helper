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
	index_reference = 0,
	wide_etf_suggestion,
	bond_fund_suggestion,
	strategy_fund_suggestion,
	industry_fund_suggestion,
	market_status,
	others,
}

export interface Table {
	header1: string;
	header2: string;
	header3: string;
	header4: string;
	header5: string;
	value: Array<Array<string>>;
}

export interface ifrmameList {
	src: string;
	title?: string;
}
