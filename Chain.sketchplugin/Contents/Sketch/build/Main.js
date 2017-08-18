"use strict";

var generateChain = function generateChain(context) {
	var manager = new ChainManager(context);
	manager.newChain();
};

var updateAllChains = function updateAllChains(context) {
	var manager = new ChainManager(context);
	manager.updateAllChains();
};

var removeChainsBetweenSelected = function removeChainsBetweenSelected(context) {
	var manager = new ChainManager(context);
	manager.removeChainsBetweenSelectedLayers();
};