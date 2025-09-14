import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromptAdvancedSettingComponent } from './prompt-advanced-setting.component';

describe('PromptAdvancedSettingComponent', () => {
	let component: PromptAdvancedSettingComponent;
	let fixture: ComponentFixture<PromptAdvancedSettingComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [PromptAdvancedSettingComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(PromptAdvancedSettingComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
