import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { InvestmentListType, Table, ifrmameList } from './investment.model';

@Component({
	selector: 'app-investment',
	templateUrl: './investment.component.html',
	styleUrl: './investment.component.scss',
})
export class InvestmentComponent implements OnInit {
	public indexReferenceContent = '';
	public markdownContentPath = '';
	public InvestmentListType = InvestmentListType;
	public ifrmameList: Array<ifrmameList> = [
		{
			src: 'http://value500.com/BuffettIndex.asp',
			title: 'Buffett Index',
		},
	];
	public selectedIndex = InvestmentListType.index_reference;
	public table: Table = {
		header1: '',
		header2: '',
		header3: '',
		header4: '',
		header5: '',
		value: [],
	};
	constructor(public appService: AppService) {}
	ngOnInit(): void {
		this.selectedIndex =
			(this.appService.activeIndex.subIndex as InvestmentListType) ?? InvestmentListType.index_reference;
		setTimeout(() => {
			this.listItemSelected(this.selectedIndex);
		}, 300);
	}

	listItemSelected(index: InvestmentListType): void {
		this.selectedIndex = index;
		this.appService.activeIndex = { subIndex: this.selectedIndex };
		switch (index) {
			case InvestmentListType.index_reference:
				this.showIndex();
				break;
			default:
				break;
		}
	}

	get mdContentPath(): string {
		if (
			this.selectedIndex !== InvestmentListType.index_reference &&
			this.selectedIndex !== InvestmentListType.market_status
		) {
			return `assets/investment/${InvestmentListType[this.selectedIndex]}.md`;
		}
		return '';
	}

	showIndex(): void {
		this.indexReferenceContent = JSON.stringify(this.appService.investmentGroup.indexList);
		this.table.header1 = 'Category';
		this.table.header2 = 'Name';
		this.table.header3 = 'ID';
		this.table.header4 = 'Description';
		this.table.header5 = 'Content & Actions';
		this.table.value = [];
		this.appService.investmentGroup.indexList?.forEach(index => {
			index.value.forEach(item => {
				this.table.value.push([index.category, item.name, item.id, item.description, item.content]);
			});
		});
	}

	evaluation(id: string, name: string): void {
		this.appService.copy(
			`1. 请作为资深投资经理和证券分析师，从多个维度分析指数(${name}(${id}))当前是否处于低估阶段和投资建议。2. 请先直接表格输出结论和各维度评判依据，后给出分析过程和逻辑。3. 请提供分析结果图表。4. 最后帮我生成该指数的定投金额与加仓/止盈阈值的执行清单`
		);
	}
}
