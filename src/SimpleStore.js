export default class SimpleStore {

    constructor() {
        this._values = {};
        this._changeCallbacks = [];
    }

    /**
     * Merges the values specified in the object into the store.
     * In order to set values for keys specified in constants etc in ES6, 
     * use:
     * set({ [MY_CONSTANT]: value })
     */
    set(values) {
        if(values) {
            this._values = { ...this._values, ...values };
            this._triggerChangeCallback(values);
        }
    }

    /**
     * Get the actual value object used for storage.
     * This object must not be modified.
     */
    get() {
        return this._values;
    }

    clear() {
        // Create a map where all values in the original map is set to undefined.
        // This is used for the callback in order to signal that the value is removed.
        let removedKeyMap = Object.keys(this._values)
            .reduce((res, item) => (res[item] = undefined, res), {});

        this._values = {};
        this._triggerChangeCallback(removedKeyMap);
    }

    /**
     * If param is string, the value will be removed from values. 
     * If param is array, each value (specified as a string) will be removed from values.
     * If param is object, each key will be removed from values.
     */
    remove(param) {
        let removeKeys = null;

        if(Array.isArray(param)) {
            removeKeys = param;
        } else if(param !== null && typeof param === 'object') {
            removeKeys = Object.keys(param);
        } else if(typeof param === 'string' || param instanceof String) {
            if(param) {
                removeKeys = [param];
            }
        } else {
            throw new Error('Unsupported parameter type: ' + (typeof param));
        }

        if(removeKeys && removeKeys.length > 0) {
            let removedKeyMap = {};
            removeKeys.forEach((item) => {
                delete this._values[item];
                removedKeyMap[item] = undefined;
            });

            this._triggerChangeCallback(removedKeyMap);
        }
    }

    _triggerChangeCallback(val) {
        const storeValues = this.get();
        const callbacks = this._changeCallbacks.slice(0); // Make copy of callbacks, this will allow the callback function to remove callback
        callbacks.forEach(cb => cb(val, storeValues));
    }

    /**
     * cb                       - The callback that will be called on all updated to the store.
     *                            This callback is defined as (updatedValues, newStoreState) => {}
     *                            New storeStoreState is the same value get() would return.
     * triggerInitialCallback   - Should the callback be triggered with the current store state
     *                            immediately when a callback is registered.
     */
    registerChangeCallback(cb, triggerInitialCallback) {
        this._changeCallbacks.push(cb);
        if(triggerInitialCallback === true) {
            const storeValues = this.get();
            cb(storeValues, storeValues);
        }

        return this.unregisterChangeCallback.bind(this, cb);
    }

    unregisterChangeCallback(cb) {
        let idx = this._changeCallbacks.indexOf(cb);
        if(idx !== -1) {
            this._changeCallbacks.splice(idx, 1);
            return true;
        }

        return false;
    }
}