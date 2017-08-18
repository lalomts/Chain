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
		let success; 
		//Find the necesary layers
		let guide = context.document.documentData().layerWithID(chain.guideLayer); 
		let chained = context.document.documentData().layerWithID(chain.chainedLayer);

		if (guide && chained) {
			//Get the reference color and the target color. 
			let guideColor = Chain.getColorFrom(guide, chain.referenceTarget);
			let chainedColor = Chain.getColorFrom(chained, chain.target);

			if (guideColor && chainedColor) {
				//Modify the specified values and set color back again. 
				let linkedColor = Chain.transformColor(guideColor, chainedColor, chain.type, chain.value); 
				Chain.setColorTo(linkedColor, chained, chain.target);
				success = true;

			} else {
				success = false;
				log('Could not find colors.') 
			}
			
		} else {
			success == false
			log('Could not update chain')
		};
		return success
	}

	static setColorTo(color, layer, target) {

		if (target == "Fill") {

			if (layer.class() == "MSTextLayer") {
			// If the layer if text, set the text color instead. 
        layer.setTextColor(color);
       
    	} else {
    		layer.style().fills().firstObject().color = color;
    	}
			return;

		} else if (target == "Border"){

			let border = layer.style().borders().firstObject()

			if (border && border.isEnabled()){
				border.color = color; 
			}	else {
				log('Could not set border.');
			}	
		} else {
			log("Chain: Tried to update unrecognized layer property.")
		}
	}

	static getColorFrom(layer, target) {

		if (target == "Fill") {
			// If the layer if text, get the text color instead. 
			if (layer.class() == "MSTextLayer") {
        return layer.textColor();

    	} else {
    		return layer.style().fills().firstObject().color();
    	}
	
		} else if (target == "Border"){
			let border = layer.style().borders().firstObject()

			if (border && border.isEnabled()) {
				return layer.style().borders().firstObject().color();

			} else {
				log("Could not get border");
			}

		} else {
			log("Chain: Tried to get urecognized layer property.")
		}
	}

	static transformColor(guideColor, chainedColor, type, value) {

	  let h = type == "Hue" ? Chain.normalizeHue(guideColor.hue(), value) : chainedColor.hue(), 
	      s = type == "Saturation" ? guideColor.saturation() * value : chainedColor.saturation(),
	      b = type == "Brightness" ? guideColor.brightness() * value : chainedColor.brightness(),
	      a = type == "Alpha" ? guideColor.alpha() * value : chainedColor.alpha();

	  return MSColor.colorWithHue_saturation_brightness_alpha(h, s ,b, a);
	}
	//Makes the value wrap between 0 and 1. 
	static normalizeHue(hue, transform) {
	  let addition = hue + transform - 1; 
	  if (addition > 1) {
	    return addition - 1;
	  } else if (addition < 0) {
	    return addition + 1; 
	  } else {
	    return addition;
	  };
	}
}