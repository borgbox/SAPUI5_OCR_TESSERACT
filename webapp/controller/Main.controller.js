sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"com/infineon/ZBC_OCR_TESSERACT/util/OCRScannerUtil",
], function (Controller, OCRScannerUtil) {
	"use strict";

	return Controller.extend("com.infineon.ZBC_OCR_TESSERACT.controller.Main", {
		onInit: function () {

			this.getView().setModel(new sap.ui.model.json.JSONModel({
				log: '',
				result: '',
				snap: '',
				progress: ''
			}, true), 'viewData')

			this.worker = Tesseract.createWorker({
				logger: (m) => {
					console.log(m);
					this.getView().getModel('viewData').setProperty('/log', this.getView().getModel('viewData').getProperty('/log') + '\n' + JSON.stringify(
						m));
					if (m.progress && m.status && m.status === "recognizing text") {
						this.getView().getModel('viewData').setProperty('/progress', `${m.progress.toFixed(2) * 100}%`);
					}
				}
			});
		},
		onRecognition: async function () {

			await this.worker.load();
			await this.worker.loadLanguage('por');
			await this.worker.initialize('por');
			this._OCRScanner = new OCRScannerUtil(this, this.worker);
			let sText = await this._OCRScanner.scan();
			sap.m.MessageToast.show(sText);
			//return;
			/*			debugger;
						let text = await this.worker.recognize(
							'https://tesseract.projectnaptha.com/img/eng_bw.png',
							'por', {
							
							}
						);
						debugger;
						let text2 = await  this.worker.recognize(
							'https://tesseract.projectnaptha.com/img/eng_bw.png',
							'por', {
							
							}
						);*/
			/*			this.worker.recognize(
							'https://tesseract.projectnaptha.com/img/eng_bw.png',
							'por', {
								logger: m => console.log(m)
							}
						).then(({
							data: {
								text
							}
						}) => {
							console.log(text);
						})*/
		}
	});
});