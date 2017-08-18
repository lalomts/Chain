"use strict";

//Array Utils 

var removeItemFromArray = function removeItemFromArray(array, item) {
  var index = array.indexOf(item);
  return array.splice(index, 1);
};

//Taken from http://sketchplugins.com/d/3-welcome-to-the-site/11
var each = function each(array, handler) {
  var count = array.count ? array.count() : array.length;
  for (var i = 0; i < count; i++) {
    var layer = array[i];
    handler(layer, i);
  }
};

var map = function map(array, handler) {
  var newArray = NSMutableArray.alloc().init();
  each(array, function (item) {
    var object = handler(item);
    if (object) {
      newArray.addObject(object);
    }
  });
  return newArray;
};

//Transforms an NSArray to Javascript array (hopefully); 
var transformToJavascriptArray = function transformToJavascriptArray(array) {
  var newArray = [];
  each(array, function (item) {
    newArray.push(item);
  });
  return newArray;
};

var plugin;