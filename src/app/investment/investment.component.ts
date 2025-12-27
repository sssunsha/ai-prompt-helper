import { Component } from '@angular/core';
import { AppService } from '../app.service';

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
export class InvestmentComponent {
	public content = '';
	public table: Table = {
		header1: '',
		header2: '',
		header3: '',
		header4: '',
		header5: '',
		value: [],
	};
	constructor(public service: AppService) {}

	showIndex(): void {
		this.content = JSON.stringify(this.service.investmentGroup.indexList);
		this.table.header1 = 'category';
		this.table.header2 = 'name';
		this.table.header3 = 'id';
		this.table.header4 = 'description';
		this.table.header5 = 'content';
		this.table.value = [];
		this.service.investmentGroup.indexList?.forEach(index => {
			index.value.forEach(item => {
				this.table.value.push([index.category, item.name, item.id, item.description, item.content]);
			});
		});
	}
}
