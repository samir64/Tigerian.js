"use strict";

/**
 * @constructor
 * @extends {Tigerian.Control}
 * @implements {Tigerian.BModal}
 */
Tigerian.ModalForm = Tigerian.Control.extend({
    /**
     * @constructs
     * @param {Tigerian.UI} parent
     * @param {string} theme
     */
    init: function (parent, theme) {
        this.super(parent, theme);

        var ctrlHeader = new Tigerian.Header(null, true, this.theme);
        var ctrlBody = new Tigerian.Control(null, this.theme);
        var ctrlFooter = new Tigerian.Footer(null, false, this.theme);

        this.config("modal", parent);
        this.config("cancel", this, ctrlHeader);

        this.addControl(ctrlHeader);
        this.addControl(ctrlBody);
        this.addControl(ctrlFooter);

        this.setAttribute("element-type", "ModalForm");
        this.setAttribute("element-name", "container");

        ctrlBody.setAttribute("element-type", "ModalForm");
        ctrlBody.setAttribute("element-name", "Body");

        this.addControl = ctrlBody.addControl.bind(this);
        this.footerAddControl = ctrlFooter.addControl.bind(this);
        this.headerAddControl = ctrlHeader.addControl.bind(this);

    },
}, Tigerian.BModal, Tigerian.BCancel);