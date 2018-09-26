import { assert, expect } from 'chai';

import SimpleStore from '../src/SimpleStore'; 

describe("SimpleStore", function() {
    it('register before set', function() {
        let store = new SimpleStore();
        
        let valueFromCallback;
        let valueFromCallback2;
        store.registerChangeCallback((updatedValues) => { updatedValues.testValue ? valueFromCallback = updatedValues.testValue : null });
        store.registerChangeCallback((updatedValues) => { updatedValues.testValue2 ? valueFromCallback2 = updatedValues.testValue2 : null });
        store.set({testValue: 5});
        store.set({testValue2: 7});

        expect(valueFromCallback).to.equal(5);
        expect(valueFromCallback2).to.equal(7);
        expect(store.get()).to.eql({testValue: 5, testValue2: 7});
    });
    it('register after set', function() {
        let store = new SimpleStore();
        store.set({testValue: 5});
        store.set({testValue2: 7});
        
        let valueFromCallback = 'not set';
        store.registerChangeCallback((updatedValues) => { updatedValues.testValue ? valueFromCallback = updatedValues.testValue : null });
        expect(valueFromCallback).to.equal('not set');

        store.registerChangeCallback((updatedValues) => { updatedValues.testValue2 ? valueFromCallback = updatedValues.testValue2 : null }, true);
        expect(valueFromCallback).to.equal(7);
    });
    it('register before set', function() {
        let store = new SimpleStore();
        
        let valueFromCallback;
        store.registerChangeCallback((updatedValues) => { updatedValues.testValue ? valueFromCallback = updatedValues.testValue : null });
        store.set({'testValue': 5});
        store.set({'testValue2': 7});

        expect(valueFromCallback).to.equal(5);
        expect(store.get()).to.eql({testValue: 5, testValue2: 7});
    });
    it('register after set', function() {
        let store = new SimpleStore();
        store.set({'testValue': 5});
        store.set({'testValue2': 7});
        
        let valueFromCallback = 'not set';
        store.registerChangeCallback((updatedValues) => { updatedValues.testValue ? valueFromCallback = updatedValues.testValue : null });
        expect(valueFromCallback).to.equal('not set');

        store.registerChangeCallback((updatedValues) => { updatedValues.testValue2 ? valueFromCallback = updatedValues.testValue2 : null }, true);
        expect(valueFromCallback).to.equal(7);
    });
    it('changecallback', function() {
        let store = new SimpleStore();
        
        let valueFromCallback;
        let valueFromCallback2;

        store.registerChangeCallback((updatedValues, newStoreValues) => { 
            valueFromCallback = newStoreValues.testValue;
            valueFromCallback2 = newStoreValues.testValue2;
        });
        
        store.set({testValue: 5});
        expect(valueFromCallback).to.equal(5);
        expect(valueFromCallback2).to.be.undefined;
        
        store.set({testValue2: 7});
        expect(valueFromCallback).to.equal(5);
        expect(valueFromCallback2).to.equal(7);

        expect(store.get()).to.eql({testValue: 5, testValue2: 7});
    });
    it('multiplechangecallback', function() {
        let store = new SimpleStore();
        
        let valueFromCallback1_1;
        let valueFromCallback1_2;

        let valueFromCallback2_1;
        let valueFromCallback2_2;

        store.registerChangeCallback((updatedValues, newStoreValues) => { 
            valueFromCallback1_1 = newStoreValues.testValue;
            valueFromCallback1_2 = newStoreValues.testValue2;
        });

        store.registerChangeCallback((updatedValues, newStoreValues) => { 
            valueFromCallback2_1 = newStoreValues.testValue;
            valueFromCallback2_2 = newStoreValues.testValue2;
        });
        
        store.set({testValue: 5});
        expect(valueFromCallback1_1).to.equal(5);
        expect(valueFromCallback1_2).to.be.undefined;
        
        expect(valueFromCallback2_1).to.equal(5);
        expect(valueFromCallback2_2).to.be.undefined;

        store.set({testValue2: 7});
        expect(valueFromCallback1_1).to.equal(5);
        expect(valueFromCallback1_2).to.equal(7);

        expect(valueFromCallback2_1).to.equal(5);
        expect(valueFromCallback2_2).to.equal(7);

        expect(store.get()).to.eql({testValue: 5, testValue2: 7});
    });     
    it('unregister callback', function() {
        let store = new SimpleStore();
        let valueFromCallback;
        
        let cbFunc = (updatedValues) => { updatedValues.testValue ? valueFromCallback = updatedValues.testValue : null };
        store.registerChangeCallback(cbFunc);
        store.set({testValue: 5});
        expect(store.unregisterChangeCallback(cbFunc)).to.equal(true);
        expect(store.unregisterChangeCallback(cbFunc)).to.equal(false);
        store.set({testValue: 7});

        expect(valueFromCallback).to.equal(5);
        expect(store.get()).to.eql({testValue: 7});
    });
    it('remove value', function() {
        let store = new SimpleStore();
        
        let removedOk = false;
        let removedOk2 = false;
        let removedOk3 = false;

        store.set({testValue: 5});
        store.set({testValue2: 7});
        store.set({testValue3: 9});

        store.registerChangeCallback((updatedValues) => { 
            'testValue' in updatedValues && updatedValues['testValue'] === undefined ? removedOk = true : null;
            'testValue2' in updatedValues && updatedValues['testValue2'] === undefined ? removedOk2 = true : null;
            'testValue3' in updatedValues && updatedValues['testValue3'] === undefined ? removedOk3 = true : null;
        });

        expect(store.get()).to.eql({testValue: 5, testValue2: 7, testValue3: 9});
        store.remove('testValue');
        expect(store.get()).to.eql({testValue2: 7, testValue3: 9});
        store.remove(['testValue2']);
        expect(store.get()).to.eql({testValue3: 9});
        store.remove({testValue3: 'asd'});
        expect(store.get()).to.eql({});
        
        expect(removedOk).to.be.true;
        expect(removedOk2).to.be.true;
        expect(removedOk3).to.be.true;
    });
    it('unregister callback return value', function() {
        let store = new SimpleStore();
        let valueFromCallback;
        
        let cbFunc = (updatedValues) => { updatedValues.testValue ? valueFromCallback = updatedValues.testValue : null };
        let unregisterCb = store.registerChangeCallback(cbFunc);
        store.set({testValue: 5});
        expect(unregisterCb()).to.equal(true);
        expect(unregisterCb()).to.equal(false);
        store.set({testValue: 7});

        expect(valueFromCallback).to.equal(5);
        expect(store.get()).to.eql({testValue: 7});
        expect(store.unregisterChangeCallback(cbFunc)).to.equal(false);
    });
    it('no callback when no values removed', function() {
        let store = new SimpleStore();

        let callbackCallCount = 0;

        let cbFunc = (updatedValues) => { callbackCallCount++ };
        let unregisterCb = store.registerChangeCallback(cbFunc);
        store.remove([]);
        store.remove('');
        store.remove({});
        expect(callbackCallCount).to.equal(0);
    });    
    it('clear', function() {
        let store = new SimpleStore();
        
        let removedOk = false;
        let removedOk2 = false;
        let removedOk3 = false;

        store.registerChangeCallback((updatedValues) => { 
            'testValue' in updatedValues && updatedValues['testValue'] === undefined ? removedOk = true : null;
            'testValue2' in updatedValues && updatedValues['testValue2'] === undefined ? removedOk2 = true : null;
            'testValue3' in updatedValues && updatedValues['testValue3'] === undefined ? removedOk3 = true : null;
        });

        store.set({testValue: 5});
        store.set({testValue2: 7});
        store.set({testValue3: 9});

        expect(store.get()).to.eql({testValue: 5, testValue2: 7, testValue3: 9});
        store.clear();
        expect(store.get()).to.eql({});
        
        expect(removedOk).to.be.true;
        expect(removedOk2).to.be.true;
        expect(removedOk3).to.be.true;
    });    
});