/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/**/*.{html,ts,scss}', // 包括 SCSS 文件
	],
	theme: {
		extend: {},
	},
	plugins: [require('daisyui')],
	daisyui: {
		themes: ['light', 'dark', 'cupcake'], // 启用主题
		darkTheme: 'dark', // 默认暗色主题
		base: true, // 启用基础样式
		styled: true, // 启用组件样式
		utils: true, // 启用工具类
		logs: true, // 控制台日志
		rtl: false, // 是否支持从右到左的语言
	},
};
