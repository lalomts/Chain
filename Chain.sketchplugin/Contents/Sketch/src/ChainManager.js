class ChainManager {

	constructor(context) {
		this.context = context;
		this.sketch = this.context.api()
		this.document = this.sketch.selectedDocument;
		this.selection = this.context.selection;
    this.command = this.context.command;
    this.pluginID = this.context.plugin.identifier();
    this.docData = context.document.documentData();
    plugin = this.context.plugin;

    this.LAYER_CHAINS_KEY = 'layer-chains';
	}

	newChain() {
		let layers = this.selection; 

		if (layers.count() < 2) {
			Dialog.newInformationDialog("Oops!", "Please select at least two layers to chain.")
			return 
		}

		let userInput = Dialog.newChainCreator(layers); 
		switch (userInput.responseCode) {
			case 1000: //User clicks create chain 

			each(layers, layer => {
				if (layer.objectID() != userInput.guideLayer) {
					userInput.targets.forEach(target => {
						let chain = new Chain(userInput.type, userInput.guideLayer, userInput.referenceTarget, layer.objectID(), target, userInput.value, Date.now());
						this.saveChain(chain); 
					})
				};
			});
			break;

			default: //Just close the dialog
			break; 
		}; 
	}

	saveChain(chain) {

		let chains = this.getStoredChains();
		let matchingChain = this.findChainWithMatchingTarget(chains, chain); 

		if (matchingChain) {
			removeItemFromArray(chains, matchingChain); //Remove chain with same layers, type and target. 
		} 
		
		chains.push(chain); 

		let relatedChains = chains.filter(c => c.chainedLayer == chain.chainedLayer && c.target == chain.target)
		//Run all the chains with the same layer and target.
		this.runChains(relatedChains, (chain, success) => {
			if(!success) {
				removeItemFromArray(chains, chain);
				log('Removing...');  
			}
		}); 
		return this.setStoredChains(chains); 
	}

	removeChainsBetweenSelectedLayers() {
		let layers = this.selection; 

		if (layers.count() != 2) {
			Dialog.newInformationDialog("Cannot remove chains", "Please select two layers.")
		}; 

		let chains = this.getStoredChains();
		//Filter all chains that relate the two selected layers. 
		let filteredChains = chains.filter(chain => 
			!(chain.guideLayer == layers[0].objectID() && chain.chainedLayer == layers[1].objectID() ||
			chain.guideLayer == layers[1].objectID() && chain.chainedLayer == layers[0].objectID())
		)
		this.setStoredChains(filteredChains);
		this.context.document.showMessage("Selected chains were removed.")
	}

	updateAllChains() {
		let chains = this.getStoredChains(); 

		if (chains.length > 0) {
			this.runChains(chains, (chain, success) => { 
				if(!success) {
					removeItemFromArray(chains, chain);
					log('Removing...'); 
				}	
			}); 
			this.setStoredChains(chains); 
			this.context.document.showMessage("Chains updated!")
		} else {
			Dialog.newInformationDialog("Oops!", "There are no chained layers in this document.");
		}; 
	}

	runChains(chains, callback) {
		let sorted = chains.sort((a,b) => a - b); //Sort the chains by the time they were created. 
		sorted.forEach(chain => {
			let success = Chain.run(chain, this.context) // Perform the chained changes in the chained layer's target.  
			callback(chain, success);
		});
	}

	findChainWithMatchingTarget(chains, chain) {
		let matching = chains.find(function(c) {
			if (c.chainedLayer == chain.chainedLayer && c.type == chain.type && c.target == chain.target){
				return true; 
			} else {
				return false;
			};
		});
		return matching;
	}

	logChains() {
		log(this.getStoredChains())
	}

	//Storing and retrieving chains from layers. 
	getStoredChains(){
		const value = this.command.valueForKey_onLayer_forPluginIdentifier(this.LAYER_CHAINS_KEY, this.docData, this.pluginID);
		return value ? transformToJavascriptArray(value) : []
	}

	setStoredChains(chains){
		return this.command.setValue_forKey_onLayer_forPluginIdentifier(chains, this.LAYER_CHAINS_KEY, this.docData, this.pluginID);
	} 
}

//Ale y Cass 