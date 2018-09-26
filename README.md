# Simple Store

A simple class for storing data where callback functions may be registered to be notified when data changes. A very simplified "global" react state type of storage.

## Usage

The store allows you to register callbacks that are called whenever a value is set or removed from the store. All the callbacks will be called whenever the store is updated, so it is the responsibility of the callback to check which values are being updated.

Basic usage of the store:
```
import SimpleStore from '@trt2/simple-store';

function storeCallback(updatedValues, currentStoreValues) {
    console.log(updatedValues);
}

let store = new SimpleStore();

const unregisterCallback = store.registerChangeCallback(storeCallback);

store.set({testValue: 5});

unregisterCallback();

```

Typical usage from React:

```
/*
MyAppStore.js:
import SimpleStore from '@trt2/simple-store';
export default new SimpleStore();
*/

import MyAppStore from './MyAppStore'; 

class MyComponent extends React.Component {
    componentDidMount() {
        this._unregisterStoreCallback = 
            MyAppStore.registerChangeCallback(this_storeChanged, true);
    }

    componentWillUnmount() {
        this._unregisterStoreCallback && this._unregisterStoreCallback();
    }

    render() {
        ...
    }

    _storeChanged = (updatedValues, currentStoreValues) => {
        if('relevantValue' in updateValues) {
            this.setState({relevantValue: updateValues.relevantValue});
        }
    }
}
```

## Method Parameters
The SimpleStorage class has the following methods:

`set(values)`
- values - Object that will be merged into the store.

This will trigger all the registered callbacks to be called with both the updated values, and the current state of the complete store.

`get()`

Returns an object containing all values in store.

`clear()`

This will remove all values from the store. This method will also trigger all
the registered callbacks to be called with all the keys in the store set to undefined.

`remove(param)`
- param - Either an array of key names to remove, an object whose keys will be used as key names to remove, or a string specifying the key to remove.

When a value is removed from the store, the registered callbacks are called with an object containing the keys of the removed values, and their values are set to undefined.

`registerChangeCallback(cb, triggerInitialCallback)`
* cb - The callback that is called when store is updated, this callback will receive 2 parameters:
  * updatedValues - Object containing only the values that triggered the callback
  * currentStoreValues - Object containing all the values currently in the store
* triggerInitialCallback - If set to true, the callback function will be triggered immediately after it is registered, with the entire store as both parameters.

The `registerChangeCallback()` method will return a function that may be used to unregister the callback.

`unregisterChangeCallback(cb)`
- cb - The callback function to unregister from the store.
    
