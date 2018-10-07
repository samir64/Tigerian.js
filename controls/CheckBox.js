/**
 * Created by samir on 8/26/16.
 */

'use strict';


/**
 * @extends {Tigerian.Control}
 * @implements {Tigerian.Select}
 * @constructor
 */
Tigerian.CheckBox = Tigerian.Control.extend({
	/**
	 * @constructs
	 * @param {string} [text = ""]
	 * @param {string} [theme = ""]
	 * @param {Tigerian.UI} parent
	 */
	init: function (parent, text, theme) {
		var elmCheckBox = document.createElement("div");
		var elmLabel = document.createElement("div");

		this.super(parent, theme);
		this.config("select");
		this.config("text", elmLabel);


		//NOTE Alias Super Members
		var superSelected = Object.getOwnPropertyDescriptor(this, "selected");


		//NOTE Private Variables
		var instance = this;

		//NOTE Attributes
		this.setAttribute("element-name", "container");
		this.setAttribute("element-type", "CheckBox");

		elmCheckBox.setAttribute("element-name", "check");
		elmCheckBox.setAttribute("element-type", "CheckBox");
		elmCheckBox.setAttribute("element-situation", "");
		elmCheckBox.setAttribute("element-hoverable", "true");

		elmLabel.setAttribute("element-name", "label");
		elmLabel.setAttribute("element-type", "CheckBox");

		//NOTE Append Children
		this.addControl(elmCheckBox);
		this.addControl(elmLabel);

		this.text = text;

		Object.defineProperty(this, "indeterminate", {
			enumerable: true,
			configerable: true,
			get: function () {
				return instance.getAttribute("selected") == "indeterminate";
			},
			set: function (value) {
				if (Tigerian.Class.isInstance(value, "boolean")) {
					var lastValue = instance.indeterminate;

					instance.setAttribute("selected", value ? "indeterminate" : "false");

					if (value != lastValue) {
						instance.dispatchEvent(Tigerian.Event.onIndeterminateChange);
					}
				}
			}
		});

		Object.defineProperty(this, "selected", {
			enumerable: true,
			configerable: true,
			get: superSelected.get.bind(this),
			set: function (v) {
				if (Tigerian.Class.isInstance(v, "boolean")) {
					instance.indeterminate = false;
					superSelected.set.bind(this)(v);
				}
			}
		});
	},
}, Tigerian.BSelect, Tigerian.BText);