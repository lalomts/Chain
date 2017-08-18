"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Dialog = function () {
	function Dialog() {
		_classCallCheck(this, Dialog);
	}

	_createClass(Dialog, null, [{
		key: "newChainCreator",
		value: function newChainCreator(layers) {

			//Creates the alert window
			var alert = Dialog.createBasicDialog(true, "Chain");
			alert.setMessageText("New Chain");
			alert.setInformativeText('Select the type of chain, the layer containing the reference color, enter the color transformation, and choose which properties to update.');

			// Select type of chain 
			alert.addTextLabelWithValue('Select the type of chain:');

			var types = ["Hue", "Saturation", "Brightness", "Alpha"];
			var typeSelection = Dialog.createDropdown(types);
			alert.addAccessoryView(typeSelection);

			/////////// Separator
			alert.addAccessoryView(Dialog.createSeparator());

			// Select reference layer 
			alert.addTextLabelWithValue('Select the reference color:');

			var layerNames = map(layers, function (layer) {
				return layer.name();
			});
			var layerSelection = Dialog.createDropdown(layerNames);
			alert.addAccessoryView(layerSelection);

			// Select reference target
			var allowedRefTargets = ["Fill", "Border"];
			var refTargetSelection = Dialog.createRadioMatrix(allowedRefTargets);
			alert.addAccessoryView(refTargetSelection);

			/////////// Separator
			alert.addAccessoryView(Dialog.createSeparator());

			// Transformation Input 	  
			alert.addTextLabelWithValue('Transformation: ');
			var valueField = Dialog.createTextField('(+/-) 100');
			alert.addAccessoryView(valueField);

			//Sets the target checkboxes  
			alert.addTextLabelWithValue('Select the properties to chain:');

			var fill = Dialog.createCheckboxWithTitle('Fill');
			var border = Dialog.createCheckboxWithTitle('Border', 60);
			var checkboxes = [fill, border];

			var checkView = NSView.alloc().initWithFrame(NSMakeRect(0, -10, 300, 22));
			checkboxes.forEach(function (checkbox) {
				return checkView.addSubview(checkbox);
			});
			alert.addAccessoryView(checkView);

			//Display the alert 
			var responseCode = alert.runModal();
			var guide = layers[layerSelection.indexOfSelectedItem()]; //Layer selected by user. 

			//Return Values 
			var inputs = {
				responseCode: responseCode,
				type: typeSelection.objectValueOfSelectedItem(),
				guideLayer: guide.objectID(),
				referenceTarget: refTargetSelection.selectedCells()[0].title(),
				targets: checkboxes.filter(function (target) {
					return target.state() != 0;
				}).map(function (target) {
					return target.title();
				}),
				value: 1 + valueField.floatValue() / 100.0
			};
			return inputs;
		}

		// UI Creators 

	}, {
		key: "newInformationDialog",
		value: function newInformationDialog(title, message) {
			var dialog = Dialog.createBasicDialog(false);
			dialog.setMessageText(title);
			dialog.setInformativeText(message);

			return dialog.runModal();
		}

		// UI

	}, {
		key: "createBasicDialog",
		value: function createBasicDialog(showsCancel, acceptText) {
			var alert = COSAlertWindow.new();

			var iconURL = plugin.urlForResourceNamed("icon.icns").path();
			var icon = NSImage.alloc().initByReferencingFile(iconURL);
			alert.setIcon(icon);

			alert.addButtonWithTitle(acceptText ? acceptText : 'OK');
			if (showsCancel) alert.addButtonWithTitle('Cancel');
			return alert;
		}
	}, {
		key: "createTextField",
		value: function createTextField(placeholder) {
			var textbox = NSTextField.alloc().initWithFrame(NSMakeRect(0, 0, 180, 22));
			textbox.placeholderString = placeholder;
			textbox.setEditable(true);
			textbox.setSelectable(true);
			return textbox;
		}
	}, {
		key: "createDropdown",
		value: function createDropdown(items) {
			var dropdown = NSComboBox.alloc().initWithFrame(NSMakeRect(0, 0, 180, 28));
			dropdown.addItemsWithObjectValues(items);
			dropdown.setEditable(false);
			dropdown.selectItemAtIndex(0);
			return dropdown;
		}
	}, {
		key: "createCheckboxWithTitle",
		value: function createCheckboxWithTitle(title, xOffset) {

			var offset = xOffset || 0;
			var checkbox = NSButton.alloc().initWithFrame(NSMakeRect(offset, 0, 200, 25));
			checkbox.setButtonType(NSSwitchButton);
			checkbox.setTitle(title);
			return checkbox;
		}
	}, {
		key: "createRadioMatrix",
		value: function createRadioMatrix(items) {
			var buttonCell = NSButtonCell.new();
			buttonCell.setButtonType(NSRadioButton);

			var matrix = NSMatrix.alloc().initWithFrame_mode_prototype_numberOfRows_numberOfColumns(NSMakeRect(0, 0, 150, 22), NSRadioModeMatrix, buttonCell, 1, items.length);
			matrix.setAutorecalculatesCellSize(true);
			var cells = matrix.cells();

			items.forEach(function (item, index) {
				cells.objectAtIndex(index).setTitle(item);
			});

			return matrix;
		}
	}, {
		key: "createSegmentedControl",
		value: function createSegmentedControl(items) {
			var segControl = NSSegmentedControl.alloc().initWithFrame(NSMakeRect(0, 0, 300, 22));
			segControl.setSegmentCount(items.length);

			items.forEach(function (item, index) {
				segControl.setLabel_forSegment(item, index);
				segControl.setWidth_forSegment(0, index);
			});

			segControl.cell().setTrackingMode(0); //Raw value of NSSegmentSwitchTrackingSelectOne.
			segControl.setSelected_forSegment(true, 0);
			return segControl;
		}
	}, {
		key: "createSeparator",
		value: function createSeparator() {
			var separator = NSBox.alloc().initWithFrame(NSMakeRect(0, 0, 250, 10));
			separator.setBoxType(2);
			return separator;
		}
	}]);

	return Dialog;
}();