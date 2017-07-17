class ChainManager {

	constructor(context) {
		
		this.context = context;
		this.sketch = this.context.api()
		this.document = this.sketch.selectedDocument;
		this.selection = this.context.selection;
    this.command = this.context.command;
    this.pluginID = this.context.plugin.identifier();
    this.docData = context.document.documentData();

    this.LAYER_CHAINS_KEY = 'layer-chains';
	}

	saveChain(chain) {

		let chains = this.getStoredChains();
		let matchingChain = this.findChainWithMatchingTarget(chains, chain); 

		if (matchingChain) {
			log("Will delete matching"); 
			removeItemFromArray(chains, matchingChain); 
		} 

		chains.push(chain); 
		chain.run(this.context) // Perform the chained changes. 
		return this.setStoredChains(chains); 
	}

	removeChainsBetweenSelectedLayers() {

		let layers = this.selection; 

		if (layers.count() != 2) {
			log("Please select two chained layers.");
		}; 

		//Look for chains on both layers.
		layers.forEach(function(layer) {

			let chains = getLayerChains(layer); 
			log("Chains for layer (BR)", chains); 
			let chainedLayer = layer == layers[0] ? layers[1] : layers[0];

			let matchingChains = findExistingChainsBetween(layer, chainedLayer);

			//Remove each matching chain. 
			matchingChains.forEach(function(chain) {
				let index = chains.indexOf(chain); 
				chains.splice(index, 1); 
				log('Removed chain: ', chain);
			});

			log("Will save chains for layer (AR)", chains); 
			setLayerChains(chains, layer); 
		});
	}

	updateChainInSelectedLayers() {

		let layers = this.selection; 

		if (layers > 0) {
			layers.forEach(function(layer) {
				let chains = getLayerChains(layer);

				if (chains) {
					chains.forEach(chain => chain.run()); 
				};
			});
		} else {
			log("Please select at least one layer.")
		}; 
	}

	//Configure new chain 



	launchChainCreator(type) {

		let layers = this.selection;  

		//Creates the alert window
	  let alert = COSAlertWindow.new();
	  alert.setMessageText("Create " + type + " Chain");
	  alert.setInformativeText('Select the layer containing the reference color, enter the color transformation, and choose which properties to update.');

	  // Select reference layer 
	  alert.addTextLabelWithValue('Select the layer containing the reference color:');

	  let layerNames = map(layers, layer => layer.name());

	  let layerSelection = createDropdown(layerNames);
	  alert.addAccessoryView(layerSelection);

	  // Select reference target 
	  alert.addTextLabelWithValue('Select the property containing the color:');

	  let allowedRefTargets = ["Fill", "Border"];

	  let refTargetSelection = createDropdown(allowedRefTargets);
	  alert.addAccessoryView(refTargetSelection);

	  // Transformation Input 
	  let textLabelText, textFieldPlaceholder; 

	  switch(type) {
	    case "Hue": 
	    textLabelText = 'Transformation: (Number between -100 and 100):';
	    textFieldPlaceholder = '';
	    break ;

	    default: 
	    textLabelText = 'Transformation: (% of the reference color):';
	    textFieldPlaceholder = '';
	    break ;
	  }
	  
	  alert.addTextLabelWithValue(textLabelText);
	  alert.addTextFieldWithValue(textFieldPlaceholder);

	  //Targets 
	  alert.addTextLabelWithValue('Select where to add the color chain:');

	  let fill = createCheckboxWithTitle('Fill');
	  alert.addAccessoryView(fill);

	  let border = createCheckboxWithTitle('Border');
	  alert.addAccessoryView(border);

	  let checkboxes = [fill, border]; 

	  //Buttons
	  alert.addButtonWithTitle('Chain');
	  alert.addButtonWithTitle('Cancel');

	  let responseCode = alert.runModal();

	  switch (responseCode) {
	  	//Create chain with the selected input. 
	  	case 1000: 
	  	let layerIndex = layerSelection.indexOfSelectedItem();
	  	let guideLayer = layers[layerIndex]; 

	  	let refTarget = refTargetSelection.objectValueOfSelectedItem(); 
	  	// let value = alert.viewAtIndex(5).stringValue(); 

  		//Create a chain for each of the chained layers
  		each(layers, (chained) => {

  			if (chained != guideLayer) {
  				checkboxes.forEach(( target) => {
			  		if (target.state() != 0) {
				  		let chain = new Chain(type, guideLayer.objectID(), refTarget, chained.objectID(), target.title(), 0.3); 
		  				log(chain)
		  				this.saveChain(chain);
			  		};
		  		});
  			};
  		});
	  	default: // If it's anything else, close the dialog. 
	  	break; 
	  };
	}

	////// Retrieving and Filtering Chains  
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