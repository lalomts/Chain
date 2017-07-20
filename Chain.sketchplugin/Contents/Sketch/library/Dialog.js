class Dialog {

	static newChainCreator(layers) {

		//Creates the alert window
	  let alert = Dialog.createBasicDialog(true, "Chain")
	  alert.setMessageText("New Chain");
	  alert.setInformativeText('Select the type of chain, the layer containing the reference color, enter the color transformation, and choose which properties to update.');

	  // Select type of chain 
	  alert.addTextLabelWithValue('Select the type of chain:');

	  let types = ["Hue", "Saturation", "Brightness", "Alpha"]; 
		let typeSelection = Dialog.createDropdown(types);
	  alert.addAccessoryView(typeSelection);

	  /////////// Separator
	  alert.addAccessoryView(Dialog.createSeparator());

	  // Select reference layer 
	  alert.addTextLabelWithValue('Select the reference color:');

	  let layerNames = map(layers, layer => layer.name());
		let layerSelection = Dialog.createDropdown(layerNames);
		alert.addAccessoryView(layerSelection);

		// Select reference target
		let allowedRefTargets = ["Fill", "Border"];
		let refTargetSelection = Dialog.createRadioMatrix(allowedRefTargets);
	  alert.addAccessoryView(refTargetSelection);

	  /////////// Separator
	  alert.addAccessoryView(Dialog.createSeparator());


	  // Transformation Input 	  
	  alert.addTextLabelWithValue('Transformation: ');
	  let valueField = Dialog.createTextField('0 - 100'); 
	  alert.addAccessoryView(valueField);

	  //Sets the target checkboxes  
	  alert.addTextLabelWithValue('Select the properties to chain:');

	  let fill = Dialog.createCheckboxWithTitle('Fill');
	  let border = Dialog.createCheckboxWithTitle('Border', 60);
	  let checkboxes = [fill, border]; 

	  let checkView = NSView.alloc().initWithFrame(NSMakeRect(0,-10,300,22));
	  checkboxes.forEach(checkbox => checkView.addSubview(checkbox));
	  alert.addAccessoryView(checkView);


	  //Display the alert 
	  let responseCode = alert.runModal();
	  let guide = layers[layerSelection.indexOfSelectedItem()]; //Layer selected by user. 

	  //Return Values 
	  let inputs = {
	  	responseCode: responseCode, 
	  	type: typeSelection.objectValueOfSelectedItem(),
	  	guideLayer: guide.objectID(), 
	  	referenceTarget: refTargetSelection.selectedCells()[0].title(),
	  	targets: checkboxes.filter(target => target.state() != 0).map(target => target.title()),
	  	value: valueField.floatValue()/100.0
	  }
	  return inputs; 
	}

	// UI Creators 

	static newInformationDialog(title, message) {
		let dialog = Dialog.createBasicDialog(false)
		dialog.setMessageText(title); 
		dialog.setInformativeText(message); 

		return dialog.runModal();
	}

	// UI
	static createBasicDialog(showsCancel, acceptText){
		let alert = COSAlertWindow.new();

		let iconURL = plugin.urlForResourceNamed("icon.icns").path()
		let icon = NSImage.alloc().initByReferencingFile(iconURL);
  	alert.setIcon(icon);

	  alert.addButtonWithTitle(acceptText ? acceptText : 'OK');
	  if (showsCancel) alert.addButtonWithTitle('Cancel');
	  return alert
	}

	static createTextField(placeholder) {
		var textbox = NSTextField.alloc().initWithFrame(NSMakeRect(0,0,180,22));
		textbox.placeholderString = placeholder; 
    textbox.setEditable(true);
    textbox.setSelectable(true);
    return textbox
	}
 
	static createDropdown(items) {
		let dropdown = NSComboBox.alloc().initWithFrame(NSMakeRect(0,0,180,28));
	  dropdown.addItemsWithObjectValues(items);
	  dropdown.setEditable(false);
	  dropdown.selectItemAtIndex(0)
	  return dropdown;
	}

	static createCheckboxWithTitle(title, xOffset) {

		let offset = xOffset || 0; 
		let checkbox = NSButton.alloc().initWithFrame(NSMakeRect(offset, 0, 200, 25));
	  checkbox.setButtonType(NSSwitchButton);
	  checkbox.setTitle(title); 
	  return checkbox;
	}

	static createRadioMatrix(items) {
		let buttonCell = NSButtonCell.new();
		buttonCell.setButtonType(NSRadioButton);

		let matrix = NSMatrix.alloc().initWithFrame_mode_prototype_numberOfRows_numberOfColumns(NSMakeRect(0, 0, 150, 22), NSRadioModeMatrix, buttonCell, 1, items.length);
		matrix.setAutorecalculatesCellSize(true);
		let cells = matrix.cells();

		items.forEach((item, index) => {
			cells.objectAtIndex(index).setTitle(item);
		});

		return matrix; 
	} 

	static createSegmentedControl(items) {
		let segControl = NSSegmentedControl.alloc().initWithFrame(NSMakeRect(0,0,300,22));
		segControl.setSegmentCount(items.length);

		items.forEach((item, index) => {
			segControl.setLabel_forSegment(item, index);
			segControl.setWidth_forSegment(0, index);
		});

		segControl.cell().setTrackingMode(0); //Raw value of NSSegmentSwitchTrackingSelectOne.
		segControl.setSelected_forSegment(true, 0);
		return segControl
	}

	static createSeparator(){
		let separator = NSBox.alloc().initWithFrame(NSMakeRect(0,0,250,10));
		separator.setBoxType(2);
		return separator
	}
	
}