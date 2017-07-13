
// Chain Components: 
// - Guide Layer: Layer that defines the changes. 
// - Chained Layers: Layers to perform the chained change. 
// - Type: What type of color change to perform. (see below)
// - Target: If the color is set to fill, border and/or shadow.  
// - Value: How much to change the value (expressed in %)

class Chain {

	constructor(guideLayer, chainedLayers, targets, hueValue, saturationValue, lightnessValue, alphaValue) {
		this.guideLayer = guideLayer;
		this.chainedLayers = chainedLayers; 
		this.targets = targets;
		this.hueValue = hueValue; 
		this.saturationValue = saturationValue;
		this.lightnessValue = lightnessValue;
		this.alphaValue = alphaValue; 
	}

	save() {
		
	}
}