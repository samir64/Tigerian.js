import {
  instanceOf
} from "../core/Tigerian.js";

("use strict");

/**
 * @constructor
 * @extends {Control}
 * @implements {BText}
 * @implements {BCascade}
 */
export class MenuItem extends Control {
  /**
   * @constructs
   * @param {UI} parent
   * @param {string} text
   * @param {string} theme = ""
   */
  construcotr(parent, text, theme = "") {
    super(parent, theme);

    var elmText = document.createElement("div");
    var ctrlMenu = new Menu(null, this.theme);
    var superAddControl = this.addControl.bind(this);

    this.config(BText, elmText, text);
    this.config(BCascade);

    var superAddChild = this.addChild.bind(this);
    var canChangeChildState = true;
    var touchStarted = false;
    var openByClick = false;

    var that = this;

    superAddControl(elmText);
    this.hoverable = true;

    this.setAttribute("element-type", "MenuItem");
    this.setAttribute("element-name", "container");

    elmText.setAttribute("element-type", "MenuItem");
    // elmText.setAttribute("element-name", "text");

    /**
     * @param {MenuItem|Spacer} item
     */
    this.defineMethod("addControl", (item) => {
      if (instanceOf(item, MenuItem) || instanceOf(item, Spacer)) {
        if (!that.hasSubmenu) {
          superAddChild(ctrlMenu);
        }
        ctrlMenu.addControl(item);
      }
    });

    this.addEvent("mouseover", function (e) {
      if (canChangeChildState && !touchStarted) {
        that.viewChild(true);
      }
    });
    this.addEvent("mouseleave", function (e) {
      if (canChangeChildState && !touchStarted) {
        that.viewChild(false);
      }
    });

    elmText.addEventListener("touchstart", function (e) {
      if (canChangeChildState) {
        touchStarted = true;
      }
    });

    elmText.addEventListener("touchend", function (e) {
      if (
        canChangeChildState &&
        touchStarted &&
        document.elementFromPoint(
          e.changedTouches[0].pageX,
          e.changedTouches[0].pageY
        ) === e.changedTouches[0].target
      ) {
        that.viewChild();
        canChangeChildState = false;
        touchStarted = false;
      }

      setTimeout(function () {
        canChangeChildState = true;
      }, 100);
    });
  }
}