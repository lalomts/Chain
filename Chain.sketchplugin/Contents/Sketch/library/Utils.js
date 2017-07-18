//Array Utils 

let removeItemFromArray = function(array, item){
  let index = array.indexOf(item); 
  return array.splice(index, 1); 
}

//Taken from http://sketchplugins.com/d/3-welcome-to-the-site/11
let each = function(array, handler) {
    var count = array.count ? array.count() : array.length; 
    for (var i = 0; i < count; i++) {
        var layer = array[i];
        handler(layer, i);
    }
}

let map = function(array, handler) {
  var newArray = [NSMutableArray array];
  each(array, function(item) {
   var object = handler(item);
   if (object) {
    newArray.addObject(object);
   }
  });
  return newArray;
}

//Transforms an NSArray to Javascript array (hopefully); 
let transformToJavascriptArray = function (array) {
  let newArray = [];
  each(array, function(item) {
    newArray.push(item); 
  });
  return newArray;
}

var plugin; 