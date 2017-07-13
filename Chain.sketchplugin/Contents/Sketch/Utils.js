var app = NSApplication.sharedApplication(),
    selection,
    plugin,
    command,
    doc;

var initContext = function(context) {
    doc = context.document,
    plugin = context.plugin,
    command = context.command,
    selection = context.selection
};


/// Colors 

var transformColor = function(color, hueTransform, satTransform, brightTransform, alphaTransform) {

  let h = addHue(color.hue(), hueTransform), 
      s = color.saturation() * satTransform,
      b = color.brightness() * brightTransform, 
      a = color.alpha() * alphaTransform;

  return MSColor.colorWithHue_saturation_brightness_alpha(h, s ,b, a);
}

var addHue = function(hue, transform) {

  let addition = hue + transform; 

  if (addition > 1) {
    return addition - 1;

  } else if (addition < 0) {
    return addition + 1; 

  } else {
    return addition
  }
};