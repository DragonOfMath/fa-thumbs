# fa-thumbs
Bulk-generates optimal image filesizes for FurAffinity usage.

# Installation
```bat
npm install fa-thumbs --save
```

# Usage
Modify `run.bat` so that it takes two arguments: an input directory, and an output directory.

```bat
node test.js "./input" "./output"
pause
```

Or modify `test.js` so that it takes the same two arguments for the required function. The first argument can be an array or string, and the second is an options object:

```js
{
	output: "/path/to/output/folder",
	suffix: "_lowres",
	recursive: false,
	width: 1280,
	height: 1280,
	mime: "image/jpeg",
	quality: 80
}
```

* `output` is the path to the output folder where the scaled-down images will be
* `suffix` is the appendix to a filename string so that it's distinguished from the original res
* `recursive` is a Boolean for retrieving files in subfolders of the input directory
* `width` and `height` are the preferred dimensions of the output images
* `mime` is the image MIME type: `"image/jpeg"` or `"image/png"`
* `quality` is the preferred JPEG quality of the output images

If options is a string, it is treated as the `output` value. All other values default if not included.
