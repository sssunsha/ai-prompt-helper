const fs = require('fs');
const path = require('path');
const readline = require('readline');

let folderStructure = undefined;
let reporter = undefined;

// 指定要读取的文件夹路径
const folderPath = './src/assets';
const noteFolderPath = path.join(folderPath, 'notes');
const reporterFilePath = path.join(folderPath, 'data.json');
const titleKeywords = 'title: ';
const dateKeywords = 'date: ';

function writeFile() {
	reporter = JSON.stringify(folderStructure, null, 2);
	// console.log("=======================================");
	// console.log("报告生成成功");
	// console.log("=======================================");
	// console.log(reporter);
	// console.log("=======================================");
	fs.writeFile(reporterFilePath, reporter, err => {
		if (err) {
			console.error('无法保存文件:', err);
		}
	});
}

// 递归读取文件夹中的文件和子文件夹
function readFolder(folderPath) {
	const files = fs.readdirSync(folderPath);
	const result = {};
	files.forEach(file => {
		if (file[0] !== '.') {
			// 过滤掉以点开头的文件
			const filePath = path.join(folderPath, file);
			const fileStat = fs.statSync(filePath);
			if (fileStat.isDirectory()) {
				// 如果是子文件夹，递归读取子文件夹中的文件和子文件夹
				result[file] = readFolder(filePath);
			} else {
				// 如果是文件，将文件名作为键，文件路径作为值存储在结果对象中
				result[file] = {
					path: filePath.substring(4),
				}; // remove src/
				if (isBlogFile(filePath)) {
					result[file] = {
						...result[file],
						type: 'md',
						date: fileStat.ctime.toLocaleString(),
					};
					// parseMDFileHeader(filePath, result[file]);
				} else if (isPicFile(filePath)) {
					result[file] = {
						...result[file],
						type: 'pic',
						date: fileStat.ctime.toLocaleString(),
					};
				} else {
					result[file] = {
						...result[file],
						date: fileStat.ctime.toLocaleString(),
					};
				}
			}
		}
	});
	return result;
}

function isBlogFile(file) {
	if (!!file && file.indexOf('.md') > 0) {
		// only under blogs and status folder's md need to parse the metadata
		return true;
	}
	return false;
}

function isPicFile(file) {
	if (!!file) {
		file = file.toLowerCase();
		if (
			file.indexOf('jpg') > 0 ||
			file.indexOf('jpeg') > 0 ||
			file.indexOf('tiff') > 0 ||
			file.indexOf('png') > 0 ||
			file.indexOf('gif') > 0 ||
			file.indexOf('psd') > 0 ||
			file.indexOf('raw') > 0 ||
			file.indexOf('eps') > 0 ||
			file.indexOf('svg') > 0 ||
			file.indexOf('webp') > 0 ||
			file.indexOf('bmp') > 0
		) {
			return true;
		}
	}
	return false;
}

function mergeMdFileHeaderToJson(obj) {
	if (obj && folderStructure) {
		const path = obj.path.split('/');
		if (path.length >= 4) {
			folderStructure[path[1]][path[2]][path[3]] = obj;
			writeFile();
		}
	}
}

function parseMDFileHeader(file, obj) {
	if (!file) {
		return;
	}
	const rl = readline.createInterface({
		input: fs.createReadStream(file),
		output: process.stdout,
		terminal: false,
	});

	let lineCount = 0;
	let lines = [];

	rl.on('line', line => {
		if (lineCount < 5) {
			// parse the title
			if (line.indexOf(titleKeywords) === 0) {
				obj = { ...obj, title: line.substring(titleKeywords.length - 1) };
			}
			if (line.indexOf(dateKeywords) === 0) {
				obj = { ...obj, date: line.substring(dateKeywords.length - 1) };
			}
			lineCount++;
		} else {
			// 停止读取更多行
			rl.close();
		}
	});

	rl.on('close', () => {
		mergeMdFileHeaderToJson(obj);
	});
}

// 将目录结构转换为 JSON 格式并输出到控制台
folderStructure = readFolder(noteFolderPath);
writeFile();
