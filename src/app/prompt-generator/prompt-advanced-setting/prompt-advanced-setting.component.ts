import { Component, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/app.service';

@Component({
	selector: 'app-prompt-advanced-setting',
	templateUrl: './prompt-advanced-setting.component.html',
	styleUrl: './prompt-advanced-setting.component.scss',
})
export class PromptAdvancedSettingComponent implements OnDestroy {
	constructor(public service: AppService) {}
	ngOnDestroy(): void {}
}
