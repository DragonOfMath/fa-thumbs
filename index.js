const Jimp           = require('jimp');
const readAll        = require('./utils/read-all');
const FileExplorer   = require('./utils/FileExplorer');
const FilePromise    = require('./utils/FilePromise');
const Array          = require('./utils/Array');

var IMAGE_REGEX = /([^\/]+)\.(jpe?g|png)$/i;

function defaults() {
	for (var a of arguments) {
		if (a === undefined) continue;
		else return a;
	}
}

module.exports = function thumbify(directories = [], options = {}) {
	if (typeof(directories) === 'undefined') {
		throw 'Directories must be a string or array of strings containing the locations of files or folders.';
	}
	if (typeof(directories) === 'string') {
		directories = [directories];
	}
	// if options is a string, it will be the output directory
	if (typeof(options) === 'string') {
		options = {output: options};
	}
	
	console.log('-------- Settings --------');
	options.recursive = defaults(options.recursive, false);
	options.output    = defaults(options.output, './thumbs');
	options.suffix    = '_lowres';
	options.width   = defaults(options.width, 1280);
	options.height  = defaults(options.height, 1280);
	options.quality = defaults(options.quality, 80);
	options.mime    = defaults(options.mime, Jimp.MIME_JPEG);
	
	console.log('Dimensions: %d x %d', options.width, options.height);
	console.log('Quality:    ' + options.quality + '%');
	console.log('Suffix:     %s', options.suffix);
	
	console.log('-------- Fetching --------');
	var images = [];
	for (var dirname of directories) {
		if (IMAGE_REGEX.test(dirname)) {
			console.log('Image: %s', dirname);
			images.push(dirname);
			continue;
		}
		var files = readAll({
			dirname,
			recursive: options.recursive,
			filter: IMAGE_REGEX
		});
		for (var f in files) {
			console.log('Image: %s', files[f]);
			images.push(files[f]);
		}
	}
	images = images.unique();
	console.log('Total: %d', images.length);
	
	console.log('-------- Processing --------');
	images.forEachAsync((imgDir,i) => {
		var thumbName = FilePromise.getName(imgDir).replace(IMAGE_REGEX, function (dir, name, type) {
			switch (options.mime) {
				case Jimp.MIME_JPEG:
					type = '.jpg';
					break;
				case Jimp.MIME_PNG:
					type = '.png';
					break;
			}
			return name + options.suffix + type;
		});
		var thumbDir  = FilePromise.join(options.output, thumbName);
		console.log('[%d/%d] %s', i+1, images.length, imgDir);
		return Jimp.read(imgDir)
		.then(image => image.scaleToFit(options.width, options.height).quality(options.quality).write(thumbDir))
		.catch(console.error);
	})
	.then(() => {
		console.log('Finished.');
		FileExplorer.goto(options.output);
	});
};
