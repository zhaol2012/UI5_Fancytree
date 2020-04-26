sap.ui.requireSync("com/anders/fancytree/lib/jquery-ui/jquery-ui.min");
sap.ui.requireSync("com/anders/fancytree/lib/fancytree/modules/jquery.fancytree.ui-deps");
sap.ui.requireSync("com/anders/fancytree/lib/fancytree/modules/jquery.fancytree");
sap.ui.define([
    "sap/ui/core/UIComponent"
], function (UIComponent) {
    "use strict";
    return UIComponent.extend("com.anders.fancytree.Component", {
        metadata: {
            manifest: "json"
        },
        init: function () {
            // call the init function of the parent
            UIComponent.prototype.init.apply(this, arguments);
        }
    });
});