/**
 * 2025 SAP SE or an SAP affiliate company. All rights reserved.
 */
import { Component, HostListener, OnInit } from '@angular/core';
import { AIModelConfig } from '../prompt-generator/prompt-generator.model';
import { CompleteThemeDefinition, ThemingService } from '@fundamental-ngx/core';
import { takeUntil, filter, Subject } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AppService } from '../app.service';
const urlContains = (themeName: string, search: string): boolean => themeName.toLowerCase().includes(search);
const isHcb = (themeName: string): boolean => urlContains(themeName, 'hcb');
const isHcw = (themeName: string): boolean => urlContains(themeName, 'hcw');
const isDark = (themeName: string): boolean => urlContains(themeName, 'dark');
@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
	private readonly _onDestroy$: Subject<void> = new Subject<void>();
	highlightJsThemeCss: SafeResourceUrl | undefined;
	themes: CompleteThemeDefinition[] = [];

	constructor(
		public service: AppService,
		private _themingService: ThemingService,
		private _domSanitizer: DomSanitizer
	) {}

	ngOnInit(): void {
		this.themes = this._themingService.getThemes();
		this._themingService.currentTheme
			.pipe(
				takeUntil(this._onDestroy$),
				filter(theme => !!theme)
			)
			.subscribe(theme => {
				this.updateHighlightTheme(theme?.id as string);
			});
	}

	get aiModelList(): Array<AIModelConfig> {
		return Object.values(this.service.aiConfigMap);
	}

	updateHighlightTheme(themeName: string): void {
		let theme = 'googlecode.css';
		if (isHcb(themeName)) {
			theme = 'a11y-dark.css';
		} else if (isHcw(themeName)) {
			theme = 'a11y-light.css';
		} else if (isDark(themeName)) {
			theme = 'tomorrow-night.css';
		}
		this.highlightJsThemeCss = this.trustedResourceUrl(`assets/highlight-js-styles/${theme}`);
	}

	selectTheme(themeId: string): void {
		this._themingService.setTheme(themeId);
		this.updateHighlightTheme(themeId);
	}

	@HostListener('window:resize', ['$event'])
	onWindowResize(event: any): void {
		this.service.screenWidth = event.target.innerWidth;
		this.service.screenHeight = event.target.innerHeight;
	}

	private trustedResourceUrl = (url: string): SafeResourceUrl =>
		this._domSanitizer.bypassSecurityTrustResourceUrl(url);
}
