"use strict";

/**
 * @constructor
 * @extends {Tigerian.Behavior}
 */
Tigerian.BCascade = Tigerian.Behavior.extend({
    /**
     * @constructs
     */
    init: function () {
        this.super("cascade");

        this.addChild = function () {

        };

        this.viewSubmenu = function (visible) {

        };
    },
    config: function (behavior) {
        if (behavior === "cascade" && Tigerian.Class.isInstance(this, Tigerian.Control) && this["Behavior:cascade"]) {
            var ctrlSubMenu;

            var instance = this;
            var superAddControl = this.addControl;

            this.setAttribute("has-child", "false");
            this.setAttribute("open-child", "false");

            this.viewChild = function (visible) {
                if (instance.hasChild) {
                    if (Tigerian.Class.isInstance(visible, "boolean")) {
                        ctrlSubMenu.visible = visible;
                    } else {
                        ctrlSubMenu.visible = !ctrlSubMenu.visible;
                    }

                    this.setAttribute("open-child", (ctrlSubMenu.visible ? "true" : "false"));
                }
            };

            /**
             * @member {boolean}
             */
            Object.defineProperty(this, "hasChild", {
                enumerable: true,
                configurable: true,
                get: function () {
                    return (this.getAttribute("has-child") === "true");
                },
            });

            /**
             * @param {Tigerian.Control|Tigerian.BGroup} child 
             */
            this.addControl = this.addChild = function (child) {
                if (Tigerian.Class.isInstance(child, Tigerian.Control) && child["Behavior:group"]) {
                    ctrlSubMenu = child;
                    child.visible = false;
                    this.setAttribute("has-child", "true");
                    superAddControl(child);
                }
            };
        }
    },
});