import {
  Control
} from "../core/Control.js";
import {
  BText
} from "../behaviors/BText.js";
import { BLabel, ELabel } from "../behaviors/BLabel.js";

/**
 * Created by samir on 8/26/16.
 */

("use strict");

/**
 * @extends {Control}
 * @implements {BText}
 * @implements {BLabel}
 * @class
 */
export class Label extends Control {
  /**
   * @constructs
   * @param {UI} parent
   * @param {string} text = ""
   * @param {string} theme = ""
   */
  constructor(parent, text, heading = ELabel.NONE, theme = "") {
    let tag;

    switch (heading) {
      case ELabel.HEADING_ONE:
        tag = "h1";
        break;

      case ELabel.HEADING_TWO:
        tag = "h2";
        break;

      case ELabel.HEADING_THREE:
        tag = "h3";
        break;

      case ELabel.HEADING_FOUR:
        tag = "h4";
        break;

      case ELabel.HEADING_FIVE:
        tag = "h5";
        break;

      case ELabel.HEADING_SIX:
        tag = "h6";
        break;

      default:
        tag = "div";
    }

    let elmLabel = document.createElement(tag);
    let elmFormatText;
    let formatTextRenew = true;

    super(parent, theme);
    this.config(BText, elmLabel, text);
    this.config(BLabel);

    let initText = Object.getOwnPropertyDescriptor(this, "text");
    let source;
    let that = this;

    //NOTE Attributes
    this.setAttribute("element-type", "Label");
    this.setAttribute("element-name", "container");

    elmLabel.setAttribute("element-type", "Label");
    // elmLabel.setAttribute("element-name", "text");

    this.setAttribute("inline-mode", "false");

    // if (instanceOf(text, String)) {
    //     elmLabel.innerHTML = text;
    // }

    //NOTE Append Children
    this.addControl(elmLabel);

    let createFormatText = () => {
      if (formatTextRenew) {
        elmFormatText = document.createElement("div");

        elmFormatText.setAttribute("element-type", "Label");
        elmFormatText.setAttribute("element-name", "text");

        formatTextRenew = false;
      }
    };

    //NOTE Properties
    /**
     * @member {Control}
     */
    this.defineProperty("source", {
      get() {
        return source;
      },
      set(v) {
        source = v;
      },
      type: Control
    });

    this.defineProperty("text", {
      get: initText.get.bind(this),
      set(v) {
        elmFormatText.remove();
        createFormatText();
        initText.set.bind(this)(v);
      },
      type: String
    });

    /**
     * @param {string} text
     * @param {Control[]} ...controls
     */
    this.defineMethod("format", (text, controls) => {
      if (instanceOf(text, String)) {
        let lastIndex = 0;
        let pat = /@/g;
        let i = 0;

        controls = Array.from(arguments).slice(1);

        formatTextRenew = true;
        that.text = "";
        that.addControl(elmFormatText);

        while (pat.exec(text) != null && i < controls.length) {
          if (text[pat.lastIndex - 2] !== "\\") {
            if (instanceOf(controls[i], Control)) {
              let subText = text
                .substr(lastIndex, pat.lastIndex - lastIndex - 1)
                .replace("\\@", "@");
              let textNode = document.createTextNode(subText);
              elmFormatText.appendChild(textNode);
              controls[i].parent = elmFormatText;
              lastIndex = pat.lastIndex;
            }
            i++;
          }
        }

        let textNode = document.createTextNode(
          text.substr(lastIndex).replace("\\@", "@")
        );
        elmFormatText.appendChild(textNode);
      }
    });

    elmLabel.addEventListener(
      "click",
      (e) => {
        if (source) {
          source.select();
        }
      },
      true
    );

    // delete this.addControl;
    createFormatText();
  }
}