var generateChain = function(context, type) {

	if (context.selection.count() >= 2) {

		let manager = new ChainManager(context); 
		manager.launchChainCreator(type);
	};
};


var generateHueChain = function(context) {
	generateChain(context, "Hue");
};

var generateSaturationChain = function(context) {
	generateChain(context, "Saturation");
};

var generateBrightnessChain = function(context) {
	generateChain(context, "Brightness");
};

var generateAlphaChain = function(context) {
	generateChain(context, "Alpha");
};

var updateChainsInLayers = function(context) {
	let manager = new ChainManager(context); 
	manager.updateChainInSelectedLayers();
}

