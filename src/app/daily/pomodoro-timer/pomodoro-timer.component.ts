import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription, interval } from 'rxjs';

export interface PomodoroTimerData {
	isRunning: boolean;
	minutes: number;
	seconds: number;
	currentMode: 'work' | 'shortBreak' | 'longBreak';
	completedCycles: number;
	workMinutes: number;
	shortBreakMinutes: number;
	longBreakMinutes: number;
	currentDate: string;
}

@Component({
	selector: 'app-pomodoro-timer',
	template: `
		<div class="pomodoro-container">
			<h1 class="text-center mb-8 text-3xl font-bold">番茄时钟</h1>

			<!-- 模式选择 -->
			<div class="mode-selector flex justify-content-center mb-6">
				<button
					[class.active]="currentMode === 'work'"
					[class.btn-primary]="currentMode !== 'work'"
					class="mode-btn mx-2 px-4 py-2 rounded-lg reset-btn"
					(click)="switchMode('work')"
				>
					工作
				</button>
				<button
					[class.active]="currentMode === 'shortBreak'"
					[class.inactive]="currentMode !== 'shortBreak'"
					class="mode-btn mx-2 px-4 py-2 rounded-lg"
					(click)="switchMode('shortBreak')"
				>
					短休息
				</button>
				<button
					[class.active]="currentMode === 'longBreak'"
					[class.inactive]="currentMode !== 'longBreak'"
					class="mode-btn mx-2 px-4 py-2 rounded-lg"
					(click)="switchMode('longBreak')"
				>
					长休息
				</button>
				<button id="alert-dialog-btn" command="show-modal" commandfor="dialog">Open dialog</button>
			</div>

			<!-- 计时器显示 -->
			<div class="timer-display text-center mb-8">
				<div class="time text-6xl font-bold mb-4">
					{{ minutes | number: '2.0' }}:{{ seconds | number: '2.0' }}
				</div>
				<div class="cycles">已完成: {{ completedCycles }} 个番茄</div>
			</div>
			<!-- alert dialog -->
			<el-dialog>
				<dialog
					id="dialog"
					aria-labelledby="dialog-title"
					class="fixed inset-0 size-auto max-h-none max-w-none overflow-y-auto bg-transparent backdrop:bg-transparent"
				>
					<el-dialog-backdrop
						class="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
					></el-dialog-backdrop>

					<div
						tabindex="0"
						class="flex min-h-full items-end justify-center p-4 text-center focus:outline-none sm:items-center sm:p-0"
					>
						<el-dialog-panel
							class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
						>
							<div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
								<div class="sm:flex sm:items-start">
									<div
										class="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:size-10"
									>
										<svg
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="1.5"
											data-slot="icon"
											aria-hidden="true"
											class="size-6 text-red-600"
										>
											<path
												d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
												stroke-linecap="round"
												stroke-linejoin="round"
											/>
										</svg>
									</div>
									<div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
										<h3 id="dialog-title" class="text-base font-semibold text-gray-900">
											Time is up !
										</h3>
										<div class="mt-2">
											<p class="text-sm text-gray-500">
												Time is up! You can take a break now or start to wok agian!
											</p>
										</div>
									</div>
								</div>
							</div>
							<div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
								<button
									type="button"
									command="close"
									commandfor="dialog"
									class="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-500 sm:ml-3 sm:w-auto"
								>
									&nbsp;&nbsp;&nbsp;&nbsp;Ok&nbsp;&nbsp;&nbsp;&nbsp;
								</button>
							</div>
						</el-dialog-panel>
					</div>
				</dialog>
			</el-dialog>

			<!-- 控制按钮 -->
			<div class="controls flex justify-center gap-4 mb-8">
				<button
					class="control-btn start-btn px-6 py-3 rounded-lg"
					(click)="startTimer()"
					[disabled]="isRunning"
				>
					<i class="fa fa-play mr-2"></i>开始
				</button>
				<button
					class="control-btn pause-btn px-6 py-3 rounded-lg"
					(click)="pauseTimer()"
					[disabled]="!isRunning"
				>
					<i class="fa fa-pause mr-2"></i>暂停
				</button>
				<button class="control-btn reset-btn px-6 py-3 rounded-lg" (click)="resetTimer()">
					<i class="fa fa-refresh mr-2"></i>重置
				</button>
			</div>

			<!-- 时间设置 -->
			<div class="settings bg-light p-4 rounded-lg">
				<h3 class="text-center mb-4">时间设置 (分钟)</h3>
				<div class="settings-grid">
					<div class="setting-item">
						<label>工作时长:</label>
						<input fd-form-control type="number" [formControl]="workMinutes" min="1" max="60" />
					</div>
					<div class="setting-item">
						<label>短休息时长:</label>
						<input fd-form-control type="number" [formControl]="shortBreakMinutes" min="1" max="30" />
					</div>
					<div class="setting-item">
						<label>长休息时长:</label>
						<input fd-form-control type="number" [formControl]="longBreakMinutes" min="1" max="60" />
					</div>
				</div>
			</div>
		</div>
	`,
	styles: [
		`
			.pomodoro-container {
				max-width: 600px;
				padding: 2rem;
				border-radius: 10px;
				box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
			}

			.mode-selector {
				display: flex;
			}

			.mode-btn {
				font-size: 1rem;
				font-weight: 500;
				cursor: pointer;
				transition: all 0.3s ease;
			}

			.mode-btn.active {
				background-color: #4caf50;
				color: white;
			}

			.mode-btn.inactive {
				background-color: #e0e0e0;
				color: #333;
			}

			.timer-display {
				padding: 2rem;
				background-color: white;
				background-color: var(--fd-background-color, black);
				border-radius: 8px;
				box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
			}

			.time {
			}

			.cycles {
				color: #7f8c8d;
				font-size: 1.1rem;
			}

			.controls {
				display: flex;
			}

			.control-btn {
				font-size: 1rem;
				font-weight: 500;
				border: none;
				cursor: pointer;
				transition: all 0.2s ease;
			}

			.start-btn {
				background-color: #2ecc71;
				color: white;
			}

			.pause-btn {
				background-color: #f39c12;
				color: white;
			}

			.reset-btn {
				background-color: #e74c3c;
				color: white;
			}

			.control-btn:disabled {
				opacity: 0.6;
				cursor: not-allowed;
			}

			.settings {
				background-color: black;
			}

			.settings-grid {
				display: grid;
				grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
				gap: 1rem;
			}

			.setting-item {
				display: flex;
				flex-direction: column;
				gap: 0.5rem;
			}

			.setting-item input {
				padding: 0.5rem;
				border: 1px solid #bdc3c7;
				border-radius: 4px;
			}
		`,
	],
})
export class PomodoroTimerComponent implements OnInit, AfterViewInit, OnDestroy {
	// 计时器状态
	currentMode: 'work' | 'shortBreak' | 'longBreak' = 'work';
	minutes: number = 25;
	seconds: number = 0;
	isRunning: boolean = false;
	completedCycles: number = 0;
	currentDate = this.generateCurrentDate();

	// 时间设置
	workMinutes = new FormControl(25);
	shortBreakMinutes = new FormControl(5);
	longBreakMinutes = new FormControl(15);

	private readonly STORAGE_KEY = 'pomodoro-timer';

	private alertDialogBtn = document.getElementById('alert-dialog-btn');

	// 计时器订阅
	private timerSubscription?: Subscription;

	ngOnInit() {
		// 监听时间设置变化
		this.workMinutes.valueChanges.subscribe(value => {
			if (this.currentMode === 'work' && !this.isRunning && value) {
				this.minutes = value;
				this.seconds = 0;
			}
			this.syncToStorage();
		});

		this.shortBreakMinutes.valueChanges.subscribe(value => {
			if (this.currentMode === 'shortBreak' && !this.isRunning && value) {
				this.minutes = value;
				this.seconds = 0;
			}
			this.syncToStorage();
		});

		this.longBreakMinutes.valueChanges.subscribe(value => {
			if (this.currentMode === 'longBreak' && !this.isRunning && value) {
				this.minutes = value;
				this.seconds = 0;
			}
			this.syncToStorage();
		});

		// load from storage to init the config and running data
		this.loadFromStorage();
	}

	ngAfterViewInit(): void {
		this.alertDialogBtn = document.getElementById('alert-dialog-btn');
	}

	// 切换模式
	switchMode(mode: 'work' | 'shortBreak' | 'longBreak') {
		this.pauseTimer();
		this.currentMode = mode;

		switch (mode) {
			case 'work':
				this.minutes = this.workMinutes.value || 25;
				break;
			case 'shortBreak':
				this.minutes = this.shortBreakMinutes.value || 5;
				break;
			case 'longBreak':
				this.minutes = this.longBreakMinutes.value || 15;
				break;
		}

		this.seconds = 0;
		this.syncToStorage();
	}

	// 开始计时器
	startTimer() {
		if (!this.isRunning) {
			this.isRunning = true;
			this.timerSubscription = interval(1000).subscribe(() => {
				this.tick();
			});
		}
		this.syncToStorage();
	}

	// 暂停计时器
	pauseTimer() {
		if (this.isRunning && this.timerSubscription) {
			this.timerSubscription.unsubscribe();
			this.isRunning = false;
		}
		this.syncToStorage();
	}

	// 重置计时器
	resetTimer() {
		this.pauseTimer();
		this.switchMode(this.currentMode); // 重置为当前模式的初始时间
		this.syncToStorage();
		this.alertDialogBtn?.click();
	}

	private restartTimer(): void {
		if (this.isRunning) {
			this.timerSubscription = interval(1000).subscribe(() => {
				this.tick();
			});
		}
	}

	private generateCurrentDate(): string {
		const d = new Date();
		return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
	}

	private syncToStorage(): void {
		const data: PomodoroTimerData = {
			isRunning: this.isRunning,
			minutes: this.minutes,
			seconds: this.seconds,
			currentMode: this.currentMode,
			completedCycles: this.completedCycles,
			workMinutes: this.workMinutes.value || 25,
			shortBreakMinutes: this.shortBreakMinutes.value || 5,
			longBreakMinutes: this.longBreakMinutes.value || 15,
			currentDate: this.currentDate,
		};
		localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
	}

	private loadFromStorage(): void {
		const data = localStorage.getItem(this.STORAGE_KEY);
		if (data) {
			const parsedData = JSON.parse(data);
			this.isRunning = parsedData.isRunning;
			this.minutes = parsedData.minutes;
			this.seconds = parsedData.seconds;
			this.currentMode = parsedData.currentMode;
			this.workMinutes.setValue(parsedData.workMinutes);
			this.shortBreakMinutes.setValue(parsedData.shortBreakMinutes);
			this.longBreakMinutes.setValue(parsedData.longBreakMinutes);
			if (this.currentDate !== parsedData.currentDate) {
				this.completedCycles = 0;
			} else {
				this.completedCycles = parsedData.completedCycles;
			}
			this.restartTimer();
		}
	}

	// 计时逻辑
	private tick() {
		if (this.minutes === 0 && this.seconds === 0) {
			this.completeCurrentSession();
			return;
		}

		if (this.seconds === 0) {
			this.minutes--;
			this.seconds = 59;
		} else {
			this.seconds--;
		}
		this.syncToStorage();
	}

	// 完成当前时段
	private completeCurrentSession() {
		this.pauseTimer();
		this.playNotificationSound();
		this.alert();

		if (this.currentMode === 'work') {
			this.completedCycles++;
			// 每4个工作周期后是长休息
			if (this.completedCycles % 4 === 0) {
				this.switchMode('longBreak');
			} else {
				this.switchMode('shortBreak');
			}
		} else {
			// 休息结束后回到工作模式
			this.switchMode('work');
		}
		this.syncToStorage();
	}

	private alert() {
		window.alert('Time is up for ' + this.currentMode + ' !');
	}

	// 播放提示音
	private playNotificationSound() {
		// 创建简单的提示音
		const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
		const oscillator = audioContext.createOscillator();
		const gainNode = audioContext.createGain();

		oscillator.connect(gainNode);
		gainNode.connect(audioContext.destination);

		oscillator.type = 'sine';
		oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5音
		gainNode.gain.setValueAtTime(0, audioContext.currentTime);
		gainNode.gain.linearRampToValueAtTime(1, audioContext.currentTime + 0.01);
		gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1);

		oscillator.start();
		oscillator.stop(audioContext.currentTime + 1);
	}

	// 组件销毁时清理订阅
	ngOnDestroy() {
		if (this.timerSubscription) {
			this.timerSubscription.unsubscribe();
		}
	}
}
