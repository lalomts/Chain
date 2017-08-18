"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ChainManager = function () {
	function ChainManager(context) {
		_classCallCheck(this, ChainManager);

		this.context = context;
		this.sketch = this.context.api();
		this.document = this.sketch.selectedDocument;
		this.selection = this.context.selection;
		this.command = this.context.command;
		this.pluginID = this.context.plugin.identifier();
		this.docData = context.document.documentData();
		plugin = this.context.plugin;

		this.LAYER_CHAINS_KEY = 'layer-chains';
	}

	_createClass(ChainManager, [{
		key: "newChain",
		value: function newChain() {
			var _this = this;

			var layers = this.selection;

			if (layers.count() < 2) {
				Dialog.newInformationDialog("Oops!", "Please select at least two layers to chain.");
				return;
			}

			var userInput = Dialog.newChainCreator(layers);
			switch (userInput.responseCode) {
				case 1000:
					//User clicks create chain 

					each(layers, function (layer) {
						if (layer.objectID() != userInput.guideLayer) {
							userInput.targets.forEach(function (target) {
								var chain = new Chain(userInput.type, userInput.guideLayer, userInput.referenceTarget, layer.objectID(), target, userInput.value, Date.now());
								_this.saveChain(chain);
							});
						};
					});
					break;

				default:
					//Just close the dialog
					break;
			};
		}
	}, {
		key: "saveChain",
		value: function saveChain(chain) {

			var chains = this.getStoredChains();
			var matchingChain = this.findChainWithMatchingTarget(chains, chain);

			if (matchingChain) {
				removeItemFromArray(chains, matchingChain); //Remove chain with same layers, type and target. 
			}

			chains.push(chain);

			var relatedChains = chains.filter(function (c) {
				return c.chainedLayer == chain.chainedLayer && c.target == chain.target;
			});
			//Run all the chains with the same layer and target.
			this.runChains(relatedChains, function (chain, success) {
				if (!success) {
					removeItemFromArray(chains, chain);
					log('Removing...');
				}
			});
			return this.setStoredChains(chains);
		}
	}, {
		key: "removeChainsBetweenSelectedLayers",
		value: function removeChainsBetweenSelectedLayers() {
			var layers = this.selection;

			if (layers.count() != 2) {
				Dialog.newInformationDialog("Cannot remove chains", "Please select two layers.");
			};

			var chains = this.getStoredChains();
			//Filter all chains that relate the two selected layers. 
			var filteredChains = chains.filter(function (chain) {
				return !(chain.guideLayer == layers[0].objectID() && chain.chainedLayer == layers[1].objectID() || chain.guideLayer == layers[1].objectID() && chain.chainedLayer == layers[0].objectID());
			});
			this.setStoredChains(filteredChains);
			this.context.document.showMessage("Selected chains were removed.");
		}
	}, {
		key: "updateAllChains",
		value: function updateAllChains() {
			var chains = this.getStoredChains();

			if (chains.length > 0) {
				this.runChains(chains, function (chain, success) {
					if (!success) {
						removeItemFromArray(chains, chain);
						log('Removing...');
					}
				});
				this.setStoredChains(chains);
				this.context.document.showMessage("Chains updated!");
			} else {
				Dialog.newInformationDialog("Oops!", "There are no chained layers in this document.");
			};
		}
	}, {
		key: "runChains",
		value: function runChains(chains, callback) {
			var _this2 = this;

			var sorted = chains.sort(function (a, b) {
				return a - b;
			}); //Sort the chains by the time they were created. 
			sorted.forEach(function (chain) {
				var success = Chain.run(chain, _this2.context); // Perform the chained changes in the chained layer's target.  
				callback(chain, success);
			});
		}
	}, {
		key: "findChainWithMatchingTarget",
		value: function findChainWithMatchingTarget(chains, chain) {
			var matching = chains.find(function (c) {
				if (c.chainedLayer == chain.chainedLayer && c.type == chain.type && c.target == chain.target) {
					return true;
				} else {
					return false;
				};
			});
			return matching;
		}
	}, {
		key: "logChains",
		value: function logChains() {
			log(this.getStoredChains());
		}

		//Storing and retrieving chains from layers. 

	}, {
		key: "getStoredChains",
		value: function getStoredChains() {
			var value = this.command.valueForKey_onLayer_forPluginIdentifier(this.LAYER_CHAINS_KEY, this.docData, this.pluginID);
			return value ? transformToJavascriptArray(value) : [];
		}
	}, {
		key: "setStoredChains",
		value: function setStoredChains(chains) {
			return this.command.setValue_forKey_onLayer_forPluginIdentifier(chains, this.LAYER_CHAINS_KEY, this.docData, this.pluginID);
		}
	}]);

	return ChainManager;
}();

//Ale y Cass