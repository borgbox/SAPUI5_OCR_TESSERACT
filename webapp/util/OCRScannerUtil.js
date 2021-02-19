sap.ui.define([
	"sap/ui/base/Object"
], function (Object) {
	"use strict";

	return Object.extend("com.infineon.ZBC_OCR_TESSERACT.util.OCRScannerUtil", {
		dialog: {},
		scannedCode: "",
		constructor: function (oCtrl, oWorker) {
			// eslint-disable-next-line
			this._oCtrl = oCtrl;
			this._oWorker = oWorker;
			//this._codeReader = new ZXing.BrowserMultiFormatReader();
		},
		getScreenWidth: function () {
			if (window.screen.availWidth < 500) {
				return window.screen.availWidth - 45;
			} else {
				return 512;
			}
		},
		runOCR: async function (url) {

			const worker = new Tesseract.TesseractWorker();
			worker.recognize(url)
				.then(function (result) {

					result.text;
				}).progress(function (result) {

					result["status"] + " (" +
						(result["progress"] * 100) + "%)";
				});
		},
		scan: async function () {

			// eslint-disable-next-line
			var oThis = this;
			oThis.textScanned = false;
			oThis.scannedCode = "";

			// eslint-disable-next-line
			const closeTxt = this._oCtrl.getOwnerComponent().getModel("i18n").getResourceBundle().getText("close");

			var container = new sap.m.VBox({
				"width": `${this.getScreenWidth()}px`,
				"height": "384px"
			});
			var button = new sap.m.Button("", {
				text: closeTxt,
				type: "Back",
				press: function () {
					// eslint-disable-next-line
					oThis.dialog.close();
				}
			});
			var snapButton = new sap.m.Button("", {
				text: 'Capture',
				press: () => {
					this.oBusyDialog_Global = new sap.m.BusyDialog({
						title: "{viewData>/progress}"
					});

					this._oCtrl.getView().addDependent(this.oBusyDialog_Global);
					var ctx = canvas.getContext('2d');
					var videoSrc = canvas.toDataURL();
					//sap.ui.core.BusyIndicator.show()
					this._oCtrl.getView().getModel('viewData').setProperty('/snap', videoSrc);
					oThis.dialog.close();
					this.oBusyDialog_Global.open();
					oThis._oWorker.recognize(videoSrc, 'por', {

						})
						.then(({
							data: {
								text
							}
						}) => {
							if (text.length > 0) {
								oThis.textScanned = true;
								sap.m.MessageToast.show(text);
								var msg = new SpeechSynthesisUtterance();
								msg.text = text;
								msg.lang = 'pt';
								window.speechSynthesis.speak(msg);
								this.oBusyDialog_Global.close();

								// eslint-disable-next-line
							} else {
								sap.m.MessageToast.show('No text found');
								this.oBusyDialog_Global.close();
							}
							//sap.ui.core.BusyIndicator.hide()

						});

				}
			});

			button.addStyleClass("sapUiTinyMarginBegin");

			oThis.dialog = new sap.m.Dialog({
				showHeader: false,
				content: [
					container
				],
				beginButton: snapButton,
				endButton: button
			});
			oThis.dialog.open();

			var video = document.createElement("video");
			video.autoplay = true;

			var canvas = document.createElement("canvas");
			canvas.width = this.getScreenWidth();
			canvas.height = 384;
			container.getDomRef().appendChild(canvas);

			return new Promise(function (resolve, reject) {

				navigator.mediaDevices.getUserMedia({
						audio: false,
						video: {
							facingMode: "environment",
							width: {
								ideal: oThis.getScreenWidth()
							},
							height: {
								ideal: 384
							}
						}
					})
					.then(
						async function (stream) {
							video.srcObject = stream;
							var ctx = canvas.getContext('2d');
							var loop = (async function () {
								if (oThis.textScanned) {
									video = null;
									oThis.dialog.close();
								} else {
									ctx.drawImage(video, 0, 0);
									setTimeout(loop, 1000 / 30);
									var videoSrc = canvas.toDataURL();
									//Read something
									try {
										/*	let text = await oThis._oWorker.recognize(
												videoSrc,
												'por', {

												}
											);*/

										/*			oThis._oWorker.recognize(videoSrc, 'por', {

														})
														.then(({
															data: {
																text
															}
														}) => {
															if (text.length > 0) {
																resolve(text);
																oThis.textScanned = true;
																sap.m.MessageToast.show(text);
															}
														});*/

										/*	if (text.data.text.length > 0) {
												resolve(text.data.text);
											}*/

									} catch (err) {
										sap.m.MessageToast.show("Error OCR detection");
										reject();
									}

								}
							}.bind(this));
							loop();
						}.bind(this))
					.catch(function (error) {
						sap.m.MessageToast.show("Error video stream");
						reject();
					});

			});

		}
	});

});