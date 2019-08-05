("use strict");

/**
 * @constructor
 * @extends {Control}
 * @implements {BText}
 */
export class TableCell extends Control {
  /**
   * @constructs
   * @param {UI} parent
   * @param {string} text = ""
   * @param {string} theme = ""
   */
  constructor(parent, text = "", theme = "") {
    var elmText = document.createElement("div");
    super(parent, theme);
    this.config(BText, elmText, text);

    var superAddControl = this.addControl;

    this.addControl(elmText);

    this.setAttribute("element-type", "TableCell");
    this.setAttribute("element-name", "container");

    elmText.setAttribute("element-type", "TableCell");
    // elmText.setAttribute("element-name", "text");

    this.situation = Control.ETransparent;
  }
}