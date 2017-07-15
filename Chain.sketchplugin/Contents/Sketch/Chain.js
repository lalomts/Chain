
// Chain Components: 
// - guideLayer: Layer containing the color reference. 
// - referenceTarget: The property containing the color reference inside the layer. Possible values: Fill, Border. 
// - chainedLayer: Layer to perform the chained change. 
// - type: What type of color change to perform. Possible values: Hue, Saturation, Brightness, Alpha. 
// - Target: The property to change. Possible values: Fill, Border. 
// - Value: How much to change the color (expressed in percentage (for Bright/Satur/Alpha)) and in a number between -100 and 100 for Hue. 

class Chain {

	constructor(type, guideLayer, referenceTarget, chainedLayer, target, value) {

		this.type = type;				
		this.guideLayer = guideLayer;
		this.referenceTarget = referenceTarget; 
		this.chainedLayer = chainedLayer; 
		this.target = target;
		this.value = value;
	}

	run(context){

		let guide = Chain.findLayerWithID(this.guideLayer, context); 
		let chained = Chain.findLayerWithID(this.chainedLayer, context);

		let initialColor = Chain.getColorFrom(guide, this.referenceTarget);
		let transformedColor = Chain.transformColor(initialColor, this.type, this.value); 
		Chain.setColorTo(transformedColor, chained, this.target);

		log("Updated color in " + this.chainedLayer); 
	}

	static setColorTo(color, layer, target) {

		if (target == "Fill") {

			log("will set fill")
			layer.style().fills().firstObject().color = color; 
			return
		}

		switch (target) {
			case (target == "Fill"):
			layer.style().fills().firstObject().color = color;
			break

			case (target == "Border"):
			layer.style().borders().firstObject().color = color;
			break

			default: 
			log("Unrecognized layer target.")
			break
		}
	}

	static getColorFrom(layer, refTarget) {

		if (refTarget == "Fill") {
			return layer.style().fills().firstObject().color();
		}

		// switch (refTarget) {

		// 	case (refTarget == "Fill"):
		// 	log("got fill color")
		// 	return style.fills().firstObject().color();

		// 	case (refTarget == "Border"):
		// 	return style.borders().firstObject().color();

		// 	default: 
		// 	log("Unrecognized layer reference target.")
		// 	break
		// }
	}

	static transformColor(color, type, value) {
		log(color)

	  let h = type == "Hue" ? Chain.addHue(color.hue(), value) : color.hue(), 
	      s = type == "Saturation" ? color.saturation() * value : color.saturation(),
	      b = type == "Brightness" ? color.brightness() * value : color.brightness(),
	      a = type == "Alpha" ? color.alpha() * value : color.alpha();

	  return MSColor.colorWithHue_saturation_brightness_alpha(h, s ,b, a);
	}

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

	static findLayerWithID(id, context) {
		var predicate = NSPredicate.predicateWithFormat("objectID == %@", id);
		return context.document.currentPage().children().filteredArrayUsingPredicate(predicate).firstObject()
	}
	
}