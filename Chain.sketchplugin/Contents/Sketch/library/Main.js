var generateChain = function(context) {
	let manager = new ChainManager(context); 
	manager.newChain();
};

var updateAllChains = function(context) {
	let manager = new ChainManager(context); 
	manager.updateAllChains();
};

var removeChainsBetweenSelected = function(context){
	let manager = new ChainManager(context); 
	manager.removeChainsBetweenSelectedLayers();
};
