'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SimpleStore = function () {
    function SimpleStore() {
        _classCallCheck(this, SimpleStore);

        this._values = {};
        this._changeCallbacks = [];
    }

    /**
     * Merges the values specified in the object into the store.
     * In order to set values for keys specified in constants etc in ES6, 
     * use:
     * set({ [MY_CONSTANT]: value })
     */


    _createClass(SimpleStore, [{
        key: 'set',
        value: function set(values) {
            if (values) {
                this._values = _extends({}, this._values, values);
                this._triggerChangeCallback(values);
            }
        }

        /**
         * Get the actual value object used for storage.
         * This object must not be modified.
         */

    }, {
        key: 'get',
        value: function get() {
            return this._values;
        }
    }, {
        key: 'clear',
        value: function clear() {
            // Create a map where all values in the original map is set to undefined.
            // This is used for the callback in order to signal that the value is removed.
            var removedKeyMap = Object.keys(this._values).reduce(function (res, item) {
                return res[item] = undefined, res;
            }, {});

            this._values = {};
            this._triggerChangeCallback(removedKeyMap);
        }

        /**
         * If param is string, the value will be removed from values. 
         * If param is array, each value (specified as a string) will be removed from values.
         * If param is object, each key will be removed from values.
         */

    }, {
        key: 'remove',
        value: function remove(param) {
            var _this = this;

            var removeKeys = null;

            if (Array.isArray(param)) {
                removeKeys = param;
            } else if (param !== null && (typeof param === 'undefined' ? 'undefined' : _typeof(param)) === 'object') {
                removeKeys = Object.keys(param);
            } else if (typeof param === 'string' || param instanceof String) {
                if (param) {
                    removeKeys = [param];
                }
            } else {
                throw new Error('Unsupported parameter type: ' + (typeof param === 'undefined' ? 'undefined' : _typeof(param)));
            }

            if (removeKeys && removeKeys.length > 0) {
                var removedKeyMap = {};
                removeKeys.forEach(function (item) {
                    delete _this._values[item];
                    removedKeyMap[item] = undefined;
                });

                this._triggerChangeCallback(removedKeyMap);
            }
        }
    }, {
        key: '_triggerChangeCallback',
        value: function _triggerChangeCallback(val) {
            var storeValues = this.get();
            var callbacks = this._changeCallbacks.slice(0); // Make copy of callbacks, this will allow the callback function to remove callback
            callbacks.forEach(function (cb) {
                return cb(val, storeValues);
            });
        }

        /**
         * cb                       - The callback that will be called on all updated to the store.
         *                            This callback is defined as (updatedValues, newStoreState) => {}
         *                            New storeStoreState is the same value get() would return.
         * triggerInitialCallback   - Should the callback be triggered with the current store state
         *                            immediately when a callback is registered.
         */

    }, {
        key: 'registerChangeCallback',
        value: function registerChangeCallback(cb, triggerInitialCallback) {
            this._changeCallbacks.push(cb);
            if (triggerInitialCallback === true) {
                var storeValues = this.get();
                cb(storeValues, storeValues);
            }

            return this.unregisterChangeCallback.bind(this, cb);
        }
    }, {
        key: 'unregisterChangeCallback',
        value: function unregisterChangeCallback(cb) {
            var idx = this._changeCallbacks.indexOf(cb);
            if (idx !== -1) {
                this._changeCallbacks.splice(idx, 1);
                return true;
            }

            return false;
        }
    }]);

    return SimpleStore;
}();

exports.default = SimpleStore;