ImageStyles
===========
The idea of this module is to apply self defined styles on a directory of source images and store them in a target
directory.

Design principles
=================

* You can program new style types by implementing style type callbacks, for example 'colorize'
* You should be able to use any image library in your style type callbacks
* You can make up new style definitions which make use of your self defined style type callbacks, for example 'red', 'green'
* You should be able to decide how you store your style types, e.g. mongo, json, sql
* It should be able to respond to new and changed style definitions instantly
* It should be able to respond to file system changes in the source and target image dirs

Implementation
==============
Something with cartesian product