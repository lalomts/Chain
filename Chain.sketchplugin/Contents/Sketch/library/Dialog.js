class Dialog {

	static newChainCreator(layers) {

		//Creates the alert window
	  let alert = Dialog.createBasicDialog(true, "Chain")
	  alert.setMessageText("New Chain");
	  alert.setInformativeText('Select the type of chain, the layer containing the reference color, enter the color transformation, and choose which properties to update.');

	  // Select type of chain 
	  alert.addTextLabelWithValue('Select the type of chain:');

	  let types = ["Hue", "Saturation", "Brightness", "Alpha"]; 
		let typeSelection = Dialog.createDropdownWithOptions(types);
	  alert.addAccessoryView(typeSelection);

	  // Select reference layer 
	  alert.addTextLabelWithValue('Select the layer containing the reference color:');

	  let layerNames = map(layers, layer => layer.name());
		let layerSelection = Dialog.createDropdownWithOptions(layerNames);
	  alert.addAccessoryView(layerSelection);

	  // Select reference target 
	  alert.addTextLabelWithValue('Select the property containing the color:');

	  let allowedRefTargets = ["Fill", "Border"];
	  let refTargetSelection = Dialog.createDropdownWithOptions(allowedRefTargets);
	  alert.addAccessoryView(refTargetSelection);

	  // Transformation Input 	  
	  alert.addTextLabelWithValue('Transformation: ');
	  let valueField = Dialog.createTextField('0 - 100'); 
	  alert.addAccessoryView(valueField);

	  //Sets the target checkboxes  
	  alert.addTextLabelWithValue('Select the property to chain:');

	  let fill = Dialog.createCheckboxWithTitle('Fill');
	  alert.addAccessoryView(fill);

	  let border = Dialog.createCheckboxWithTitle('Border');
	  alert.addAccessoryView(border);

	  let checkboxes = [fill, border]; 

	  //Display the alert 
	  let responseCode = alert.runModal();
	  let guide = layers[layerSelection.indexOfSelectedItem()]; //Layer selected by user. 

	  //Return Values 
	  let inputs = {
	  	responseCode: responseCode, 
	  	type: typeSelection.objectValueOfSelectedItem(),
	  	guideLayer: guide.objectID(), 
	  	referenceTarget: refTargetSelection.objectValueOfSelectedItem(),
	  	targets: checkboxes.filter(target => target.state() != 0).map(target => target.title()),
	  	value: valueField.floatValue()/100.0 
	  }
	  return inputs; 
	}

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
		var textbox = NSTextField.alloc().initWithFrame(NSMakeRect(0,0,200,25));
		textbox.placeholderString = placeholder; 
    textbox.setEditable(true);
    textbox.setSelectable(true);
    return textbox
	}
 
	static createDropdownWithOptions(options) {
		let dropdown = NSComboBox.alloc().initWithFrame(NSMakeRect(0,0,200,28));
	  dropdown.addItemsWithObjectValues(options);
	  dropdown.setEditable(false);
	  dropdown.selectItemAtIndex(0)
	  return dropdown;
	}

	static createCheckboxWithTitle(title) {
		let checkbox = NSButton.alloc().initWithFrame(NSMakeRect(10, 0, 200, 20));
	  checkbox.setButtonType(NSSwitchButton);
	  checkbox.setTitle(title); 
	  return checkbox;
	}
	
}