import {
  instanceOf
} from "../core/Tigerian.js";
import {
  Control
} from "../core/Control.js";
import {
  BFixElement,
  EFixElement
} from "../behaviors/BFixElement.js";
import {
  BModal
} from "../behaviors/BModal.js";

("use strict");

/**
 * @constructor
 * @extends {Control}
 * @implements {BFixElement}
 * @implements {BModal}
 */
export class Loading extends Control {
  /**
   * @param {UI} parent
   * @param {string} theme = ""
   */
  constructor(parent, theme = "") {
    super(parent, theme);
    this.config(BFixElement, EFixElement.TOP);
    this.config(BModal, parent);

    let elmBar = document.createElement("div");
    let loaded = 0;
    let that = this;

    this.setAttribute("element-type", "Loading");
    this.setAttribute("element-name", "container");
    this.setAttribute("element-situation", "opposite");

    elmBar.setAttribute("element-type", "Loading");
    elmBar.setAttribute("element-name", "bar");
    elmBar.setAttribute("element-situation", "error");

    this.setAttribute("state", "indeterminate");

    this.addControl(elmBar);

    this.status = BModal.EClose;
    this.fixed = true;

    /**
     * @member {number}
     */
    this.defineProperty("loaded", {
      get() {
        return loaded;
      },
      set(v) {
        if (instanceOf(v, "number")) {
          v = Math.max(0, Math.min(100, v));
          loaded = v;
          if (that.state === Loading.EDeterminate) {
            elmBar.style.width = `${v}%`;
          } else {
            elmBar.style.width = "";
          }
        }
      }
    });

    /**
     * @member {symbol}
     */
    this.defineProperty("state", {
      get() {
        let v = elmBar.getAttribute("state");
        switch (v) {
          case "determinate":
            return Loading.EDeterminate;

          case "indeterminate":
          default:
            return Loading.EIndeterminate;
        }
      },
      set(v) {
        switch (v) {
          case Loading.EDeterminate:
            that.setAttribute("state", "determinate");
            elmBar.style.width = `${loaded}%`;
            break;

          case Loading.EIndeterminate:
            that.setAttribute("state", "indeterminate");
            elmBar.style.width = "";
            break;

          default:
        }
      }
    });

    /**
     * @member {symbol}
     */
    this.defineProperty("barSituation", {
      get() {
        let v = elmBar.getAttribute("element-situation");

        switch (v) {
          case "title":
            return EControl.TITLE;

          case "default":
            return EControl.DEFAULT;

          case "transparent":
            return EControl.TRANSPARENT;

          case "opposite":
            return EControl.OPPOSITE;

          case "warning":
            return EControl.WARNING;

          case "error":
            return EControl.error;

          case "ok":
            return EControl.OK;

          default:
            return EControl.NONE;
        }
      },
      set(v) {
        switch (v) {
          case EControl.TITLE:
            elmBar.setAttribute("element-situation", "title");
            break;

          case EControl.DEFAULT:
            elmBar.setAttribute("element-situation", "default");
            break;

          case EControl.TRANSPARENT:
            elmBar.setAttribute("element-situation", "transparent");
            break;

          case EControl.OPPOSITE:
            elmBar.setAttribute("element-situation", "opposite");
            break;

          case EControl.WARNING:
            elmBar.setAttribute("element-situation", "warning");
            break;

          case EControl.ERROR:
            elmBar.setAttribute("element-situation", "error");
            break;

          case EControl.OK:
            elmBar.setAttribute("element-situation", "ok");
            break;

          case EControl.NONE:
          default:
            elmBar.setAttribute("element-situation", "");
            break;
        }
      }
    });

    delete this.addControl;
  }
}

export const ELoading = Object.freeze({
  INDETERMINATE: Symbol("indeterminate"),
  DETERMINATE: Symbol("determinate")
});