/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"com/infineon/ZBC_OCR_TESSERACT/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});