var generateChain = function(context) {

	initContext(context);

	if (selection.count() >= 2) {

		let guideColor = selection[0].style().fills().firstObject().color();

		selection[1].style().fills().firstObject().color = transformColor(guideColor, -0.15, 1, 0.6, 1);

	};

};