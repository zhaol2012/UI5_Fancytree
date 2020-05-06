sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast"
], function (JSONModel, Controller, MessageToast) {
	"use strict";

	return Controller.extend("com.anders.fancytree.controller.Detail", {
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.oModel = this.getOwnerComponent().getModel("ui");

			this.oRouter.getRoute("detail").attachPatternMatched(this._onserobjMatched, this);
			//this.oRouter.getRoute("detailDetail").attachPatternMatched(this._onserobjMatched, this);
		},
		onAfterRendering: function () {
			this.addTree();
		},
		handleItemPress: function (oEvent) {
			var oNextUIState = this.getOwnerComponent().getHelper().getNextUIState(2),
				supplierPath = oEvent.getSource().getBindingContext("serobjs").getPath(),
				supplier = supplierPath.split("/").slice(-1).pop();

			this.oRouter.navTo("detailDetail", {
				layout: oNextUIState.layout,
				serobj: this._serobj, supplier: supplier
			});
		},
		handleFullScreen: function () {
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/fullScreen");
			this.oRouter.navTo("detail", { layout: sNextLayout, serobj: this._serobj });
		},
		handleExitFullScreen: function () {
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/exitFullScreen");
			this.oRouter.navTo("detail", { layout: sNextLayout, serobj: this._serobj });
		},
		handleClose: function () {
			var sNextLayout = this.oModel.getProperty("/actionButtonsInfo/midColumn/closeColumn");
			this.oRouter.navTo("master", { layout: sNextLayout });
		},
		_onserobjMatched: function (oEvent) {
			this._serobj = oEvent.getParameter("arguments").serobj || this._serobj || "0";
			/* 			this.getView().bindElement({
							path: "/serobjCollection/" + this._serobj,
							model: "serobjs"
						}); */
		},
		addTree: function () {

			var sTreeId = this.byId("tree").getDomRef().id;

			$("#" + sTreeId).fancytree({
				checkbox: true,
				selectMode: 3,
				source: {
					url:
						"https://cdn.rawgit.com/mar10/fancytree/72e03685/demo/ajax-tree-products.json"
				},
				lazyLoad: function (event, data) {
					data.result = { url: "https://cdn.rawgit.com/mar10/fancytree/72e03685/demo/ajax-sub2.json" };
				},

				activate: function (event, data) {
					//   $("#statusLine").text(event.type + ": " + data.node);
					MessageToast.show(event.type + ": " + data.node);
				},
				select: function (event, data) {
                    /*                     $("#statusLine").text(
                                            event.type + ": " + data.node.isSelected() + " " + data.node
                                        ); */

					MessageToast.show(event.type + ": " + data.node.isSelected() + " " + data.node);
				}
			});
		}
	});
}, true);
