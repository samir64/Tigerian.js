import "./Responsive.js";

import { Behavior } from "./Behavior.js";
import { BIterator } from "../behaviors/BIterator.js";

("use strict");

export class Tigerian {
  constructor() {
    let behaviors = [];

    abstract(this, Tigerian);

    Object.defineProperty(this, "behaviors", {
      enumerable: true,
      configurable: false,
      get() {
        return clone(behaviors);
      }
    });

    let that = this;

    Object.defineProperty(this, "config", {
      enumerable: false,
      configurable: true,
      writable: false,
      value(behavior, ...params) {
        if (Object.getPrototypeOf(behavior) === Behavior) {
          behaviors.push(behavior);
          new behavior().config(that, ...params);
        }
      }
    });
  }

  get [Symbol.toStringTag]() {
    return this.constructor.name;
  }

  /**
   * @param {String} name
   * @param {Function} descriptor
   * @param {Object} dataTypes
   */
  defineMethod(name, descriptor, dataTypes = {}) {
    return defineMethod(this, name, descriptor, dataTypes);
  }

  /**
   * @param {string} name
   * @param {Function} get
   * @param {Function} set
   * @param {boolean} configurable
   * @param {boolean} enumurable
   */
  defineProperty(
    name,
    {
      value = undefined,
      get = undefined,
      set = undefined,
      type = undefined,
      configurable = true,
      enumerable = true,
      writable = true
    }
  ) {
    defineProperty(this, name, {
      value,
      get,
      set,
      type,
      configurable,
      enumerable,
      writable
    });
  }
}

export function abstract(that, type) {
  if (that.constructor === type) {
    throw new Error(`${type.name} is an abstract class.`);
  }
}

/**
 * @param {Object} obj1
 * @param {Object} obj2
 * @returns {Boolean}
 */
export function compare(obj1, obj2) {
  if (typeof obj1 !== typeof obj2) {
    return false;
  }

  if (obj1 instanceof Array && obj2 instanceof Array) {
    if (obj1.length === obj2.length) {
      return obj1.every((value, index) => {
        if (value instanceof Array) {
          if (obj2[index] instanceof Array) {
            return compare(value, obj2[index]);
          } else {
            return false;
          }
        } else {
          return compare(value, obj2[index]);
        }
      });
    } else {
      return false;
    }
  } else if (instanceOf(obj1, Object) && instanceOf(obj2, Object)) {
    let result = true;

    let key;
    for (key in obj1) {
      if (result) {
        if (key in obj2) {
          result = compare(obj1[key], obj2[key]);
        } else {
          result = false;
        }
      }
    }

    for (key in obj2) {
      result = result && key in obj1;
    }

    return result;
  } else {
    return obj1 === obj2;
  }
}

/**
 * @param {Object} obj
 * @param {Function} type
 */
export function instanceOf(obj, type) {
  if (obj === undefined) {
    return type === undefined;
  }

  if (typeof type === "string") {
    return typeof obj === type;
  } else if (typeof type === "function") {
    let superClass = obj;
    let result = false;

    while (superClass !== null && !result) {
      result = superClass.constructor === type;
      superClass = Object.getPrototypeOf(superClass);
    }

    return result || obj instanceof type;
  } else {
    return false;
  }
}

/**
 * @param {Function} type1
 * @param {Function} type2
 */
export function isA(type1, type2) {
  let result;
  if (instanceOf(type1, Function) && instanceOf(type2, Function)) {
    let superClass = type1;

    result = false;

    do {
      superClass = Object.getPrototypeOf(superClass);
      result = superClass === type2;
    } while (superClass !== null && !result);
  }

  return result;
}

/**
 * @param {Object} obj
 * @param {Object} appendTo
 * @returns {Object}
 */
export function clone(obj, appendTo) {
  let result = {};

  forEach(obj, (item, name, that) => {
    let member = Object.getOwnPropertyDescriptor(that, name);
    if (appendTo !== undefined) {
      if ("value" in member) {
        Object.defineProperty(appendTo, name, {
          enumerable: member.enumerable,
          configurable: member.configurable,
          value: member.value
        });
      } else {
        Object.defineProperty(appendTo, name, {
          enumerable: member.enumerable,
          configurable: member.configurable,
          get: member.get,
          set: member.set
        });
      }
    }
    if ("value" in member) {
      Object.defineProperty(result, name, {
        enumerable: member.enumerable,
        configurable: member.configurable,
        value: member.value
      });
    } else {
      Object.defineProperty(result, name, {
        enumerable: member.enumerable,
        configurable: member.configurable,
        get: member.get,
        set: member.set
      });
    }
  });

  return result;
}

/**
 * @param {Object} obj
 * @param {Function} callback
 */
export function forEach(obj, callback) {
  if (callback instanceof Function) {
    if (
      (obj !== undefined &&
        obj[Symbol.toStringTag] !== undefined &&
        obj[Symbol.toStringTag].split(" ")[1] === "Iterator") ||
      instanceOf(obj, BIterator)
    ) {
      for (let item of obj) {
        callback(item, obj.iterator.index, obj);
      }
    } else {
      for (let index in obj) {
        callback(obj[index], index, obj);
      }
    }
  }
}

/**
 * @this {String}
 * @param {Number|String} ...params
 * @returns {String}
 */
export function strFormat(str, ...params) {
  if (params.length == 1 && typeof params[0] == "object") {
    return str.replace(/\{(\w+)\}/g, (match, name, offset, mainStr) => {
      return params[0][name] ? params[0][name] : "";
    });
  } else {
    for (let i = 0, pat = /\{\}/g; pat.exec(str) != null; i++) {
      str =
        str.substr(0, pat.lastIndex - 2) +
        "{" +
        i.toString() +
        "}" +
        str.substr(pat.lastIndex);
    }
    return str.replace(/\{(\d+)\}/g, (match, number) => {
      return params[number] !== undefined ? params[number] : match;
    });
  }
}

/**
 * @param {Number|String} str
 * @param {Number} before
 * @param {Number} after
 * @returns {String}
 */
export function padNumbers(str, before, after) {
  return str
    .toString()
    .replace(
      /(?:(\d+\.\d+)|(\d+)\.[^\d]?|[^\d]?\.(\d+)|(\d+)[^\.\d]?)/g,
      (matched, two, left, right, pure) => {
        if (two) {
          left = two.split(".")[0];
          right = two.split(".")[1];
        }
        if (pure) {
          left = pure;
        }

        let result = matched;
        let fix = "";
        let i = 0;

        if (left) {
          if (!right) {
            if (result[left.length] !== ".") {
              fix = ".";
            } else {
              i = 1;
            }

            fix += "0".repeat(after);

            result =
              result.substring(0, left.length + i) +
              fix +
              result.substring(left.length + i);
          }

          if (before > left.length) {
            result = result.padStart(result.length + before - left.length, "0");
            // result = "0".repeat(before - left.length) + result;
          }
        }

        if (right) {
          if (!left) {
            fix = "0".repeat(before);

            result =
              result.substring(0, result.length - right.length - 1) +
              fix +
              result.substring(result.length - right.length - 1);
          }

          if (after > right.length) {
            result = result.padEnd(result.length + after - right.length, "0");
            // result = result + "0".repeat(after - right.length);
          }
        }

        return result;
      }
    );
}

/**
 * @this {string}
 * @param {boolean} addHashSign true
 * @param {boolean} toLower true
 */
export function strToTag(str, addHashSign = true, toLower = true) {
  let result = str;

  while (result[0] === "#") {
    addHashSign = true;
    result = result.substring(1);
  }
  result = result.replace(/[^\w]/g, "_");
  return Array.from(result)
    .map((ch, index, str) => {
      if (ch >= "A" && ch <= "Z" && index > 0) {
        ch = "_" + ch;
      }
      if (addHashSign !== false && index === 0) {
        ch = "#" + ch;
      }

      if (toLower !== false) {
        ch = ch.toLowerCase();
      }

      return ch;
    })
    .join("")
    .replace(/_{2,}/g, "_");
}

/**
 * @param {String} str
 * @returns {String}
 */
export function strSplitCapital(str) {
  let result = [];
  for (let i = 0, s = 0; i <= str.length; i++) {
    if (i === str.length || str[i].toUpperCase() === str[i]) {
      if (i > 0 && str[i - 1].toUpperCase() !== str[i - 1]) {
        result.push(str.substring(s, i).toLowerCase());
        s = i;
      }
    }
  }
  return result;
}

/**
 * @param {Function} descriptor
 * @param {Object} dataTypes
 */
export function defineMethod(obj, name, descriptor, dataTypes = {}) {
  obj[name] = (...params) => {
    if (!(compare(dataTypes, {}) || instanceOf(dataTypes, Array))) {
      params = params[0];
    }

    forEach(params, (param, index) => {
      let pName = "";
      let pType = "";
      let validType = true;
      let pConsName = "";

      if (instanceOf(dataTypes[index], Array)) {
        validType = dataTypes[index].some(type => {
          return instanceOf(param, type);
          // return (param.constructor === type);
        });
        pType = dataTypes[index]
          .map(type => {
            return type.name;
          })
          .join("' or '");
      } else if (instanceOf(dataTypes[index], Function)) {
        validType = instanceOf(param, dataTypes[index]);
        // validType = (param.constructor === dataTypes[index]);
        pType = dataTypes[index].name;
      }

      if (dataTypes[index] !== undefined && !validType) {
        if (instanceOf(dataTypes, Array)) {
          pName = `Argument #${Number(index) + 1}`;
        } else {
          pName = index;
        }

        if (param === undefined) {
          pConsName = "undefined";
        } else {
          pConsName = param.constructor.name;
        }

        throw new Error(
          `${pName} type error\nExpected '${pType}', got '${pConsName}'`
        );
      }
    });

    return descriptor(...params);
  };
}

/**
 * @param {string} name
 * @param {Any} value
 * @param {Function} get
 * @param {Function} set
 * @param {Function|Function[]} type
 * @param {boolean} configurable
 * @param {boolean} enumurable
 */
export function defineProperty(
  obj,
  name,
  {
    value = undefined,
    writable = true,
    get = undefined,
    set = undefined,
    type = undefined,
    configurable = true,
    enumerable = true
  }
) {
  if (value !== undefined) {
    Object.defineProperty(obj, name, {
      value,
      writable,
      enumerable,
      configurable
    });
  } else {
    Object.defineProperty(obj, name, {
      get,
      set(v) {
        let pType = "";
        let validType = true;

        if (instanceOf(type, Array)) {
          validType = type.some(t => {
            return instanceOf(v, t);
            // return v.constructor === t;
          });
          pType = type
            .map(t => {
              return t !== undefined ? t.name : "undefined";
            })
            .join("' or '");
        } else if (instanceOf(type, Function)) {
          validType = instanceOf(v, type);
          // validType = v.constructor === type;
          pType = type.name;
        }

        if (type === undefined || validType) {
          if (instanceOf(set, Function)) {
            set(v);
          }
        } else {
          throw new Error(
            `Type error\nExpected '${pType}', got '${
              v !== undefined ? v.constructor.name : "undefined"
            }'`
          );
        }
      },
      enumerable,
      configurable
    });
  }
}
