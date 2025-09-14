import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromptSampleComponent } from './prompt-sample.component';

describe('PromptSampleComponent', () => {
	let component: PromptSampleComponent;
	let fixture: ComponentFixture<PromptSampleComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [PromptSampleComponent],
		}).compileComponents();

		fixture = TestBed.createComponent(PromptSampleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
