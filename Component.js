sap.ui.requireSync("com/anders/fancytree/lib/jquery-ui/jquery-ui.min");
sap.ui.requireSync("com/anders/fancytree/lib/fancytree/modules/jquery.fancytree.ui-deps");
sap.ui.requireSync("com/anders/fancytree/lib/fancytree/modules/jquery.fancytree");
sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "jquery.sap.global",
    "sap/f/FlexibleColumnLayoutSemanticHelper"
], function (UIComponent, JSONModel, jQuery, FlexibleColumnLayoutSemanticHelper) {
    "use strict";
    return UIComponent.extend("com.anders.fancytree.Component", {
        metadata: {
            manifest: "json"
        },
        init: function () {
            // call the init function of the parent
            UIComponent.prototype.init.apply(this, arguments);


            var oModel = new JSONModel();
            this.setModel(oModel, "ui");

            this.getRouter().initialize();
        },
        createContent: function () {
            return sap.ui.view({
                viewName: "com.anders.fancytree.view.FlexibleColumnLayout",
                type: "XML"
            });
        },
        /**
     * Returns an instance of the semantic helper
     * @returns {sap.f.FlexibleColumnLayoutSemanticHelper} An instance of the semantic helper
     */
        getHelper: function () {
            var oFCL = this.getRootControl().byId("fcl"),
                oParams = jQuery.sap.getUriParameters(),
                oSettings = {
                    defaultTwoColumnLayoutType: sap.f.LayoutType.TwoColumnsMidExpanded,
                    defaultThreeColumnLayoutType: sap.f.LayoutType.ThreeColumnsMidExpanded,
                    mode: oParams.get("mode"),
                    maxColumnsCount: oParams.get("max")
                };

            return FlexibleColumnLayoutSemanticHelper.getInstanceFor(oFCL, oSettings);
        }
    });
});