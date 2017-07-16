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
		const guide = chain.guideLayer;
		const chained = chain.chainedLayer; 
		const type = chain.type; 
		const target = chain.target; 
		let chains = this.getStoredChains();

		log("passed"); 

		if (this.findConflictingChain(chains, chain)) {
			log('A conflicting chain exists.'); 
			return 
		}

		let matching = this.findMatchingChainWithValues(chains, guide, chained, type, target); 
		if (matching) {
			log("enteredmatchin")
			// If a previous chain with the same type and target exists, modify it. 
			matching.value = chain.value; 
			matching.referenceTarget = chain.referenceTarget; 

		} else {
			log('Saving...' + chain); 
			chains.push(chain); 
		};

		// Perform the chained changes. 
		chain.run(this.context) 
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

	  let layerNames = getLayerNames(layers);

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

		//Filters the existing chains between the guideLayer and the chainedLayer.  
	filterExistingChainsBetween(chains, guide, chained) {

		let includesGuide = chains.filter( function(chain) {
			return chain.guideLayer = guide; 
		});

		return includesGuide.filter( function(chain) {
			return chain.chainedLayer = chained; 
		})
	}

	//Filters the chains with the specified type. 
	filterChainsWithMatchingType(chains, type) {

		return chains.filter( function(chain) {
			return chain.type = type; 
		});
	}

	//Finds a chain with the specified target. 
	findChainWithMatchingTarget(chains, target){

		return chains.find( function(chain) {
			return chain.type = target; 
		});
	}

	// Finds a previously stored chain with the same chainedLayer, type, and target. 
	findMatchingChainWithValues(chains, guide, chained, type, target) {

		let validChains = this.filterExistingChainsBetween(chains, guide, chained);
		let matchingTypes = this.filterChainsWithMatchingType(validChains, type); 
		let sameTarget = this.findChainWithMatchingTarget(matchingTypes, target); 
		return sameTarget
	}

	//Finds a conflicting (inverse) chain between the layers. 
	findConflictingChain(chains, chain) {
		const matching = this.findMatchingChainWithValues(chains, chain.chainedLayer, chain.guideLayer, chain.type, chain.referenceTarget); 
		return matching ? true : false; 
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