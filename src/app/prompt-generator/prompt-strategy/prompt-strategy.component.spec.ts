import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromptStrategyComponent } from './prompt-strategy.component';

describe('PromptStrategyComponent', () => {
	let component: PromptStrategyComponent;
	let fixture: ComponentFixture<PromptStrategyComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [PromptStrategyComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(PromptStrategyComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
