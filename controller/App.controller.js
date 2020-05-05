sap.ui.define([
    "sap/ui/core/mvc/Controller",
    //"com/anders/fancytree/lib/jquery-ui/jquery-ui.min",
    //  "com/anders/fancytree/lib/fancytree/modules/jquery.fancytree",
    // "com/anders/fancytree/lib/fancytree/modules/jquery.fancytree.ui-deps",
    //"com/anders/fancytree/lib/fancytree/jquery.fancytree.min",
    "com/anders/fancytree/lib/fancytree/modules/jquery.fancytree.edit",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    'sap/ui/model/Filter',
    "sap/m/MessageBox"
    //], function (Controller, fancytree, fancytreeDeps) {
], function (Controller, edit, JSONModel, MessageToast, Fragment, Filter, MessageBox) {
    "use strict";
    return Controller.extend("com.anders.fancytree.App", {
        onInit: function () {
            this._oView = this.getView();
            this._oSerObjModel = this.getOwnerComponent().getModel();
            this._oView.setModel(this._oSerObjModel);
            this._oTable = this.byId("table");
            this._oNSInput = this.byId("NSInput");
            this._oUI = new JSONModel({
                bCreateItemPending: false,
                bSerObjSelected: false
            });
            this._oView.setModel(this._oUI, "ui");

        },
        onSearch: function (oEvent) {
            var oTableBinding = this._oTable.getBinding("rows");
            var oFilter = new Filter("namespace_serobj", sap.ui.model.FilterOperator.EQ, this._oNSInput.getValue());
            oTableBinding.filter(oFilter);
        },
        handleValueHelp: function () {
            if (!this._oValueHelpDialog) {
                Fragment.load({
                    name: "com.anders.fancytree.view.NSValueHelp",
                    controller: this
                }).then(function (oValueHelpDialog) {
                    this._oValueHelpDialog = oValueHelpDialog;
                    this.getView().addDependent(this._oValueHelpDialog);
                    // this._configValueHelpDialog();
                    this._oValueHelpDialog.open();
                }.bind(this));
            } else {
                // this._configValueHelpDialog();
                this._oValueHelpDialog.open();
            }
        },
        handleValueHelpClose: function (oEvent) {
            var oSelItem = oEvent.getParameter("selectedItem");
            if (oSelItem !== undefined) {

                var sNS = oSelItem.getBindingContext().getObject().ns;
                //var oInput = this.byId("NSInput");
                //oInput.setValue(sNS);
                var oCreateSerObjDialog = this.byId("createSerObjDialog");
                if (oCreateSerObjDialog.isOpen()) {
                    var oNewNs = this.byId("NSNew");
                    oNewNs.setValue(sNS);

                } else {
                    this._oNSInput.setValue(sNS);
                }

            }
        },
        handleSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new Filter("ns", sap.ui.model.FilterOperator.Contains, sValue);
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },
        onCreateSerObj: function (oEvent) {
            /*             var oContext = this._oTable.getBinding("rows").create({
                            "namespace_serobj": "",
                            "serial_object": "",
            
                            "max_no_retries": 0,
                            "wait_time_sec": 0,
                            "start_ext_index": 0
                        }, false, true); */

            var oCreateSerObjDialog = this.byId("createSerObjDialog");
            //var that = this;

            // select the newly created one
            /*   this._oTable.setSelectedItem(
                  this._oTable.getRows()[oContext.getIndex()]);  */

            /*             this._oTable.setSelectedIndex(
                            oContext.getIndex()); */

            //oCreateSerObjDialog.setBindingContext(oContext);
            oCreateSerObjDialog.open();

            /*             this.oCurrentCreateContext = oContext;
                        // Note: this promise fails only if the transient entity is deleted
                        oContext.created().then(function () {
                            // in case of multiple create, select current
                            if (oContext === that.oCurrentCreateContext) {
            
                            }
                            MessageBox.success("SerObj created: " + oContext.getProperty("namespace_serobj")
                                + ", " + oContext.getProperty("serial_object"));
                        }, function (oError) {
                            // delete of transient entity
                        }); */

        },
        onDeleteSerObj: function (oEvent) {
            var aSelI = this._oTable.getSelectedIndices();
            aSelI.forEach(function (iIdx) {
                this._oTable.getContextByIndex(iIdx).delete(this._oSerObjModel.getGroupId()).then(function () {
                    MessageBox.alert("Deletion finishe!", {
                        icon: MessageBox.Icon.SUCCESS,
                        title: "Success"
                    });
                });
            }.bind(this));
        },
        onSaveSerObjList: function (oEvent) {

            // TODO this should be the default for submitBatch
            this._oSerObjModel.submitBatch("updateSerObj").then(function () {
                // TODO the success handler could get all errors of failed parts
                MessageBox.alert("Changes have been saved", {
                    icon: MessageBox.Icon.SUCCESS,
                    title: "Success"
                });
            }, function (oError) {
                MessageBox.alert(oError.message, {
                    icon: MessageBox.Icon.ERROR,
                    title: "Unexpected Error"
                });
            });
        },
        onCloseSerObjDialog: function (oEvent) {
            var oSource = oEvent.getSource();
            var sType = oSource.getType();
            if (sType === "Accept") {
                var oNewNs = this.byId("NSNew");
                var oNewSerObj = this.byId("SerObjNew");
                /*  var oContext = oSource.getBindingContext();
                 oContext.setProperty("namespace_serobj", oNewNs.getValue());
                 oContext.setProperty("serial_object", oNewSerObj.getValue()); */
                var oContext = this._oTable.getBinding("rows").create({
                    "namespace_serobj": oNewNs.getValue(),
                    "serial_object": oNewSerObj.getValue()
                }, false, true);
                this._oTable.setSelectedIndex(
                    oContext.getIndex());
                oContext.created().then(function () {
                    // in case of multiple create, select current
                    /*   if (oContext === that.oCurrentCreateContext) {
  
                      } */
                    MessageBox.success("SerObj created: " + oContext.getProperty("namespace_serobj")
                        + ", " + oContext.getProperty("serial_object"));
                }, function (oError) {
                    // delete of transient entity
                });
            }
            this.byId("createSerObjDialog").close();
            // move the focus to the row of the newly created sales order
            this._oTable.getRows()[0].focus();
        },
        onNavigation: function (oEvent) {
            var oRow = oEvent.getParameter("row");
        },
        onBeforeRendering: function () {

        },
        onAfterRendering: function () {
            //var sTreeId = this.byId("tree").getDomRef().getId();
            this._addNavigation();

        },
        _addNavigation: function () {
            var fnNavigation = this.onNavigation.bind(this);
            var oRowActionTemplate = new sap.ui.table.RowAction({
                items: [
                    new sap.ui.table.RowActionItem({
                        type: sap.ui.table.RowActionType.Navigation,
                        text: "Details",
                        press: fnNavigation
                        // visible: !this._oUIControModel.getProperty("/isTechnicalInterface")
                    })
                ]
            });

            // Create navigation column
            this._oTable.setRowActionTemplate(oRowActionTemplate);
            this._oTable.setRowActionCount(1);
        },
        onShowHello: function () {
            var treeData = [
                { title: "item1 with key and tooltip", tooltip: "Look, a tool tip!" },
                { title: "item2: selected on init", selected: true },
                {
                    title: "Folder", folder: true, key: "id3",
                    children: [
                        {
                            title: "Sub-item 3.1",
                            children: [
                                { title: "Sub-item 3.1.1", key: "id3.1.1" },
                                { title: "Sub-item 3.1.2", key: "id3.1.2" }
                            ]
                        },
                        {
                            title: "Sub-item 3.2",
                            children: [
                                { title: "Sub-item 3.2.1", key: "id3.2.1" },
                                { title: "Sub-item 3.2.2", key: "id3.2.2" }
                            ]
                        }
                    ]
                },
                {
                    title: "Document with some children (expanded on init)", key: "id4", expanded: true,
                    children: [
                        {
                            title: "Sub-item 4.1 (active on init)", active: true,
                            children: [
                                { title: "Sub-item 4.1.1", key: "id4.1.1" },
                                { title: "Sub-item 4.1.2", key: "id4.1.2" }
                            ]
                        },
                        {
                            title: "Sub-item 4.2 (selected on init)", selected: true,
                            children: [
                                { title: "Sub-item 4.2.1", key: "id4.2.1" },
                                { title: "Sub-item 4.2.2", key: "id4.2.2" }
                            ]
                        },
                        { title: "Sub-item 4.3 (hideCheckbox)", checkbox: false },
                        { title: "Sub-item 4.4 (unselectable)", unselectable: true }
                    ]
                },
                { title: "Lazy folder", folder: true, lazy: true }
            ];


            var sTreeId = this.byId("tree").getDomRef().id;
            var oBtun = this.byId("btnHello");

            /*             $("#" + sTreeId).fancytree({
                            checkbox: true,
                            selectMode: 1,
                            source: treeData,
                            activate: function (event, data) {
                                MessageToast.show(data.node.title);
                            },
                            select: function (event, data) {
                                // Display list of selected nodes
                                var s = data.tree.getSelectedNodes().join(", ");
                                // $("#echoSelection1").text(s);
                                MessageToast.show(s);
                            },
                            dblclick: function (event, data) {
                                data.node.toggleSelected();
                            },
                            keydown: function (event, data) {
                                if (event.which === 32) {
                                    data.node.toggleSelected();
                                    return false;
                                }
                            }
                        }); */

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
    })
});