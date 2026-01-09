import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { InvestmentListType } from './investment.model';

export interface Table {
	header1: string;
	header2: string;
	header3: string;
	header4: string;
	header5: string;
	value: Array<Array<string>>;
}

@Component({
	selector: 'app-investment',
	templateUrl: './investment.component.html',
	styleUrl: './investment.component.scss',
})
export class InvestmentComponent implements OnInit {
	public indexReferenceContent = '';
	public markdownContentPath = '';
	public InvestmentListType = InvestmentListType;
	public selectedIndex = InvestmentListType.wide_etf_suggestion;
	public table: Table = {
		header1: '',
		header2: '',
		header3: '',
		header4: '',
		header5: '',
		value: [],
	};
	constructor(public service: AppService) {}
	ngOnInit(): void {
		setTimeout(() => {
			this.listItemSelected(this.selectedIndex);
		}, 300);
	}

	listItemSelected(index: InvestmentListType): void {
		this.selectedIndex = index;
		switch (index) {
			case InvestmentListType.index_reference:
				this.showIndex();
				break;
			default:
				break;
		}
	}

	get mdContentPath(): string {
		if (this.selectedIndex !== InvestmentListType.index_reference) {
			return `assets/investment/${this.selectedIndex}.md`;
		}
		return '';
	}

	showIndex(): void {
		this.indexReferenceContent = JSON.stringify(this.service.investmentGroup.indexList);
		this.table.header1 = 'Category';
		this.table.header2 = 'Name';
		this.table.header3 = 'ID';
		this.table.header4 = 'Description';
		this.table.header5 = 'Content & Actions';
		this.table.value = [];
		this.service.investmentGroup.indexList?.forEach(index => {
			index.value.forEach(item => {
				this.table.value.push([index.category, item.name, item.id, item.description, item.content]);
			});
		});
	}

	evaluation(id: string): void {}
}
