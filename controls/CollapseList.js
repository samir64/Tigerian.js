"use strict";

/**
 * @constructor
 * @extends {Tigerian.Control}
 * @implements {Tigerian.BGroup}
 */
Tigerian.CollapseList = Tigerian.Control.extend({
    /**
     * @constructs
     * @param {Tigerian.Control} parent
     * @param {string} theme
     */
    init: function (parent, theme) {
        this.super(parent, theme);
        this.config("group");

        var superAddItem = this.addItem.bind(this);

        this.setAttribute("element-type", "CollapseList");
        this.setAttribute("element-name", "container");

        this.addControl = this.addItem = function (item) {
            if (Tigerian.Class.isInstance(item, Tigerian.CollapseItem)) {
                superAddItem(item);
            }
        };
    },
}, Tigerian.BGroup);