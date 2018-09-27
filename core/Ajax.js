'use strict';

/**
 * @class
 * @extends {Tigerian.Class}
 */
Tigerian.Ajax = Tigerian.Class.extend({
    /**
     * @constructs
     * @param {string} url
     */
    init: function (url) {
        var httpRequest;
        var success = function (responseText, responseXml, responseJson) {};
        var unsuccess = function (readyState, status, statusText) {};
        var progress = function (percent, loaded, total) {};

        if (window.XMLHttpRequest) {
            // code for modern browsers
            httpRequest = new XMLHttpRequest();
        } else {
            // code for old IE browsers
            httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
        }

        httpRequest.onreadystatechange = changeState;
        httpRequest.onprogress = function (e) {
            if (e.lengthComputable) {
                progress(100 * e.loaded / e.total, e.loaded, e.total);
            }
        };

        function jsonToQuery(params) {
            if (typeof params !== "object") {
                params = {};
            }

            return encodeURI(Object.keys(params).map(function (key) {
                var json = JSON.stringify(params[key]);
                return key + "=" + (json !== "\"" + params[key] + "\"" ? json : params[key]);
            }).join("&"));
        }

        function changeState() {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    var jsonObject;
                    try {
                        jsonObject = JSON.parse(this.responseText);
                    } catch (e) {}
                    success(this.responseText, this.responseXML, jsonObject);
                } else {
                    unsuccess(this.readyState, this.status, this.statusText);
                }
            }
        }

        function request(method, params) {
            httpRequest.open(method, url + ((method == "GET") ? "?" + jsonToQuery(params) : ""), true);
            // httpRequest.open(method, url, true);
            // httpRequest.setRequestHeader("Content-Type", "application/json; charset=utf-8");

            httpRequest.send(JSON.stringify(params));
        }

        this.addHeader = function (label, value) {
            httpRequest.setRequestHeader(label, value);
        };

        this.abort = function () {
            httpRequest.abort();
        };

        this.get = function (parameters) {
            request("GET", parameters);
        };

        this.post = function (parameters) {
            request("POST", parameters);
        };

        this.put = function (parameters) {
            request("PUT", parameters);
        };

        this.delete = function (parameters) {
            request("DELETE", parameters);
        };

        /**
         * @member {Function}
         */
        Object.defineProperty(this, "success", {
            enumerable: false,
            configurable: true,
            get: function () {
                return success;
            },
            set: function (v) {
                if (v instanceof Function) {
                    success = v;
                }
            },
        });

        /**
         * @member {Function}
         */
        Object.defineProperty(this, "unsuccess", {
            enumerable: false,
            configurable: true,
            get: function () {
                return progress;
            },
            set: function (v) {
                if (v instanceof Function) {
                    progress = v;
                }
            },
        });

        /**
         * @member {Function}
         */
        Object.defineProperty(this, "progress", {
            enumerable: false,
            configurable: true,
            get: function () {
                return unsuccess;
            },
            set: function (v) {
                if (v instanceof Function) {
                    unsuccess = v;
                }
            },
        });

        /**
         * @member {string}
         */
        Object.defineProperty(this, "url", {
            enumerable: false,
            configurable: false,
            get: function () {
                return url;
            },
            set: function (v) {
                if (typeof v === "string") {
                    url = v;
                }
            },
        });
    },
});