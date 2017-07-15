//Utils
var createDropdown = function(options) {

  let dropdown = NSComboBox.alloc().initWithFrame(NSMakeRect(0,0,230,25));
  dropdown.setEditable(false);
  dropdown.addItemsWithObjectValues(options);
  dropdown.selectItemAtIndex(0);
  return dropdown;
}

var createCheckboxWithTitle = function(title) {
  let checkbox = NSButton.alloc().initWithFrame(NSMakeRect(10, 0, 100, 20));
  checkbox.setButtonType(NSSwitchButton);
  checkbox.setTitle(title); 

  return checkbox;
}

var getLayerNames = function(layers) {
  return map(layers, layer => layer.name()); 
};

//Taken from http://sketchplugins.com/d/3-welcome-to-the-site/11
var each = function(array, handler) {
    var count = array.count ? array.count() : array.length; 
    for (var i = 0; i < count; i++) {
        var layer = array[i];
        handler(layer, i);
    }
}

var map = function(array, handler) {
    var newArray = [NSMutableArray array];
    each(array, function(item) {
         var object = handler(item);
         if (object) {
         newArray.addObject(object);
         }
         });
    return newArray;
}