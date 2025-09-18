/**
 * 2025 SAP SE or an SAP affiliate company. All rights reserved.
 */
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { MarkdownModule } from 'ngx-markdown';
import { FormsModule } from '@angular/forms';
import { FundamentalNgxCoreModule } from '@fundamental-ngx/core';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

import { PromptGeneratorComponent } from './prompt-generator/prompt-generator.component';
import { PromptStrategyComponent } from './prompt-generator/prompt-strategy/prompt-strategy.component';
import { PromptSampleComponent } from './prompt-generator/prompt-sample/prompt-sample.component';
import { ReferenceDocumentComponent } from './reference-document/reference-document.component';
import { PromptAdvancedSettingComponent } from './prompt-generator/prompt-advanced-setting/prompt-advanced-setting.component';
import { ToolsComponent } from './tools/tools.component';
import { DailyComponent } from './daily/daily.component';

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		PromptGeneratorComponent,
		PromptStrategyComponent,
		PromptSampleComponent,
		ReferenceDocumentComponent,
		PromptAdvancedSettingComponent,
		ToolsComponent,
		DailyComponent,
	],
	imports: [BrowserModule, HttpClientModule, FundamentalNgxCoreModule, MarkdownModule.forRoot(), FormsModule],
	providers: [],
	bootstrap: [AppComponent],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
