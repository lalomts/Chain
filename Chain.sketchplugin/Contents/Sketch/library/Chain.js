
// Chain Components: 
// - guideLayer: Layer containing the color reference. 
// - referenceTarget: The property containing the color reference inside the layer. Possible values: Fill, Border. 
// - chainedLayer: Layer to perform the chained change. 
// - type: What type of color change to perform. Possible values: Hue, Saturation, Brightness, Alpha. 
// - target: The property to change. Possible values: Fill, Border. 
// - value: How much to change the color (expressed in percentage (for Bright/Satur/Alpha)) and in a number between -100 and 100 for Hue. 
// - timestamp: Chain creation time. 

class Chain {

	constructor(type, guideLayer, referenceTarget, chainedLayer, target, value, timestamp) {
		this.type = type;				
		this.guideLayer = guideLayer;
		this.referenceTarget = referenceTarget; 
		this.chainedLayer = chainedLayer; 
		this.target = target;
		this.value = value;
		this.timestamp = timestamp;
	}

	static run(chain, context){
		//Find the necesary layers
		let guide = Chain.findLayerWithID(context, chain.guideLayer); 
		let chained = Chain.findLayerWithID(context, chain.chainedLayer);
		//Get the reference color and the target color. 
		let guideColor = Chain.getColorFrom(guide, chain.referenceTarget);
		let chainedColor = Chain.getColorFrom(chained, chain.target); 
		//Modify the specified values and set color back again. 
		let linkedColor = Chain.transformColor(guideColor, chainedColor, chain.type, chain.value); 
		Chain.setColorTo(linkedColor, chained, chain.target);

		log("Chain: Updated color in " + chain.chainedLayer); 
	}

	static setColorTo(color, layer, target) {

		if (target == "Fill") {
			layer.style().fills().firstObject().color = color; 
			return;

		} else if (target == "Border"){
			layer.style().borders().firstObject().color = color; 
			return;
			
		} else {
			log("Chain: Unrecognized layer target.")
		}
	}

	static getColorFrom(layer, refTarget) {

		if (refTarget == "Fill") {
			return layer.style().fills().firstObject().color();

		} else if (refTarget == "Border"){
			return layer.style().borders().firstObject().color();

		} else {
			log("Chain: Unrecognized layer reference target")
		}
	}

	static transformColor(guideColor, chainedColor, type, value) {
	  let h = type == "Hue" ? Chain.addHue(guideColor.hue(), value) : chainedColor.hue(), 
	      s = type == "Saturation" ? guideColor.saturation() * value : chainedColor.saturation(),
	      b = type == "Brightness" ? guideColor.brightness() * value : chainedColor.brightness(),
	      a = type == "Alpha" ? guideColor.alpha() * value : chainedColor.alpha();

	  return MSColor.colorWithHue_saturation_brightness_alpha(h, s ,b, a);
	}
	//Makes the value wrap between 0 and 1. 
	static addHue(hue, transform) {
	  let addition = hue + transform; 
	  if (addition > 1) {
	    return addition - 1;
	  } else if (addition < 0) {
	    return addition + 1; 
	  } else {
	    return addition;
	  };
	}

	static findLayerWithID(context, id) {
		var predicate = NSPredicate.predicateWithFormat("objectID == %@", id);
		return context.document.currentPage().children().filteredArrayUsingPredicate(predicate).firstObject()
	}
	
}