Just to warn you, this module is under construction and is not tested at al. It works with me though.
Please feel free to file bugs.
 
#ImageStyles
Apply self defined style templates on a directory of source images and save the styled images in a 
target directory.

#Basic Usage
1. Create a JS file with style functions;
2. Create a JSON file where you can store properties specific to one of your styles;
3. Create a JSON file where you can save properties specific to one of your images;
4. Instantiate ImageStyles and run it.

##1 Create styles file
Create a node js module with your style functions. For example a colorize function. This function is basically a wrapper 
around your favorite image manipulation library. I use [graphics magick (gm)](https://github.com/aheckmann/gm).
Each style function has five attributes.
1. Path to the source image
2. Path to the target image
3. image properties
4. style properties
5. a Callback for logging errors

Example styleFunctions.js
```javascript
var gm = require('gm');
module.exports = {
    colorize:function(sourceImagePath, targetImagePath, imageProperties, styleProperties, callback) {
    
        // Read the image into graphics magick
        gm(sourceImagePath)
        
            // Apply graphic magick's colorize function with the properties of a style, defined in the style properties file
            .colorize(styleProperties.red, styleProperties.green, styleProperties.blue)
            
            // Write image to disk
            .write(targetImagePath, function (err) {
                if (err) {return callback(err);}
                callback(null);
            });
    }
}
```
##2 Create style properties
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

#Using ImageStyles on the commandline
Create a file imstlz and chmod
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