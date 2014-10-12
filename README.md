Just to warn you, this module is under construction and is not tested at al. It works with me though.
Please feel free to file bugs.
 
#ImageStyles
Apply self defined style templates on a directory of source images and save the styled images in a 
target directory.

- [Basic usage](#basic-usage)
  - [1 Create style functions file](#1-create-style-functions-file)
  - [2 Create style properties file](#2-create-style-properties-file)
  - [3 Create image properties file](#3-create-image-properties-file)
  - [4 Instantiate and run](#4-instantiate-and-run)
- [Using ImageStyles on the linux commandline](#using-imagestyles-on-the-linux-commandline)
- [How it works](#how-it-works)
  - [1) images](#1-images)
  - [2) styledImages](#2-styledimages)
  - [3 styledImageWriter](#3-styledimagewriter)
- [Advanced usage](#advanced-usage)
  - [MyImagePropertiesReadable](#myimagepropertiesreadable)
  - [MyStylePropertiesReadable](#mystylepropertiesreadable)
  - [MongoDB Example](#mongodb-example)
- [API](#api)
  - [ImageStyles.style()](#imagestylesstyle)
  - [ImageStyles.clean() (Not implemented)](#imagestylesclean-not-implemented)
  - [ImageStyles.clear()](#imagestylesclear)
  - [ImageStyles.reset()](#imagestylesreset)

#Basic usage
1. Create a JS file with style functions;
2. Create a JSON file where you can store properties specific to one of your styles;
3. Create a JSON file where you can save properties specific to one of your images;
4. Instantiate ImageStyles and run it.

##1 Create style functions file
Create a node js module with your style functions. For example a colorize function. This function is basically a wrapper 
around your favorite image manipulation library. I use [graphics magick (gm)](https://github.com/aheckmann/gm).
Each style function has five attributes:

1. sourceImagePath - Path to the source image;
2. targetImagePath - Path to the target image;
3. imageProperties - image properties;
4. styleProperties - style properties;
5. callback - a Callback for logging errors.

Example styleFunctions.js
```javascript
var gm = require('gm');
module.exports = {
    colorize:function(sourceImagePath, targetImagePath, imageProperties, styleProperties, callback) {
    
        // Read the image into graphics magick
        gm(sourceImagePath)
        
            // Apply graphic magick's colorize function with the properties of a style, 
            // defined in the style properties file
            .colorize(styleProperties.red, styleProperties.green, styleProperties.blue)
            
            // Write image to disk
            .write(targetImagePath, function (err) {
                if (err) {return callback(err);}
                callback(null);
            });
    }
}
```
##2 Create style properties file
Create a file to save the style properties for example styleProperties.json. Define at least one style. The properties 
in this file will be available in the style function, for example the colorize function above. You can now create a 
style 'redify' and 'greenify' that bot make use of the colorize function.

Example styleProperties.json
```json
[
    {
        "name":"redify",
        "function":"colorize",
        "red":255,
        "green":0,
        "blue":0
    },
    {
        "name":"greenify",
        "function":"colorize",
        "red":0,
        "green":255,
        "blue":0
    }
]
```

##3 Create image properties file
For each image in the source directory you may configure some image specific properties that you might be using in one 
of your styles. You don't want to cut off the most important part of an image. Saving a cooirdinate representing the center
of attention could provide a crop function with the information to prevent this.

Create a JSON file, for example imageProperties.json. If you don't want to use any image specific properties, just add
an empty array to this file.
 
If you do have some image specific properties, you can add the properties to the array, wrapped in an object. This object
should contain a path property, so the system can match the path to one of the files. The path property must be an absolute
path.

Example imageProperties.json:
```json
[
    {
        "path": "/path/to/file.jpg",
        "x": 1640,
        "y": 1190
    }
]
```

##4 Instantiate and run
Now that you have created the necessary files you just instantiate the module and apply the styles
```javascript
// Tell ImageStyles where to find all the files and where to store the styled images
var settings = {
    sourceDir:'/path/to/sourceFiles',
    targetDir:'/path/to/targetFiles',
    imagePropertiesFile:'/path/to/imageProperties.json',
    stylePropertiesFile:'/path/to/styleProperties.json',
    styleFunctionsFile:'/path/to/styleFunctions.js'
}

// Instantiate ImageStyles
var imstlz = ImageStyles(settings);

// Apply styles
imstlz.style();
```

#Using ImageStyles on the linux commandline
Create a file imstlz and make it executable
```bash
$ touch imstlz
$ chmod 744 imstlz
```

Edit the file in your favorite editor
```javascript
#!/usr/bin/node
var settings = {
    sourceDir:'/path/to/sourceFiles',
    targetDir:'/path/to/targetFiles',
    imagePropertiesFile:'/path/to/imageProperties.json',
    stylePropertiesFile:'/path/to/styleProperties.json',
    styleFunctionsFile:'/path/to/styleFunctions.js'
}
var imstlz = require('ImageStyles')(settings);

process.argv.forEach(function(arg, i){
    if(i == 2 && imstlz[arg] ) {
        imstlz[arg]();
    }
});
```
You can now the module from the command line
```bash
$ ./imstlz style
```
#How it works
Check [the informal system diagram](https://raw.githubusercontent.com/t638403/ImageStyles/master/informal_system_diagram.jpeg) for a visual explanation.

This module is build around node >= 0.10 streams. It consists of three stream readables, two stream transformers
and a writable stream. Furthermore it consists of four basic data structures, Image, Style, StyledImage and Set.

Since different streams are merged into a single stream, the transformers are more like sinks. They have to wait till
both streams are ended before the transformer can stream on. I could not exploit the full power of streams, but the
concept is still very appealing and any other approach would still be as memory consuming as this one.  

##1) images
First filenames and image properties are merged into a stream of Image objects. So there is:
 
1. a `filenames` readable which walks the images source directory and streams the filenames;
2. a `imageProperties` readable which streams the objects in the `imageProperties.json`;
3. a transform stream to merge a filename and a image properties object into an Image object.

the filenames readable is leading since these are the images you want to style. So for any filename there will be an Image
object. If a properties object is defined for this file, it will be included into the Image object.

##2) styledImages
This is the most important part of the program. We have:

1. a `styleProperties` readable which streams the objects in the `styleProperties.json`;
2. a file `styleFunctions` 
3. a transform stream of images;
4. a transform stream;
..1. first a Style object will be created for each style in `styleProperties.json` and its style function will be embedded into this object
..2. it collect all Style objects in a Set and it will collect all Image objects in a Set
..3. then it will calculate the Cartesian product of both sets which will produce the set of StyledImage objects

##3 styledImageWriter
Finally we can construct the source and the target path of each image and write the styled images to disk 

#Advanced usage
All configuration is done in json files. You might want to store this stuff in a database. For this reason you can
configure your own stream readers in the settings object.

##MyImagePropertiesReadable
The image properties readable streams objects. Each object must contain at least a path property with an absolute path
to the file it contains properties of.
```javascript
var obj = {
    path:'/path/to/file.jpg'
}
```
##MyStylePropertiesReadable
The style properties readable streams objects. Each object must contain at least a name property and a function 
property. like the folowing object.
```javascript
var obj = {
    name:'myStyle'
    function:'myStyleFunction'
}
```

##MongoDB Example
Using [mongojs](https://github.com/mafintosh/mongojs) and [JSONStream](https://github.com/dominictarr/JSONStream) you 
can easlily create stream readers for mongo. Something like this:

```javascript
var myImageProperties = db.myImageProperties.find({}).pipe(JSONStream.stringify());
var myStyleProperties = db.myStyleProperties.find({}).pipe(JSONStream.stringify());

// Tell ImageStyles where to find all the files and where to store the styled images
var settings = {
    sourceDir:'/path/to/sourceFiles',
    targetDir:'/path/to/targetFiles',
    imageProperties:myImageProperties,
    styleProperties:myStyleProperties,
    styleFunctionsFile:'/path/to/styleFunctions.js'
}

// Instantiate ImageStyles
var imstlz = ImageStyles(settings);

// Apply styles
imstlz.style();

```

#API
##ImageStyles.style()
Reads all the files in the images source directory recursively, create directories for each style in the images target 
directory and then duplicates the structure of the images source directory under each style directory. Finaly apply style 
functions to each image. If a file allready exists in the images target directory it will be removed.

## ImageStyles.clean() (Not implemented)
Check target dir for inconsistencies with source dir and remove garbage and/or apply missing styled images

##ImageStyles.clear()
Remove images target directory recursively

##ImageStyles.reset()
run ImageStyles.clear() and then ImageStyles.style()