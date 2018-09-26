import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';


/**
 * 
 * @param {*} WrappedComponent 
 * @param {*} simpleStore The SimpleStore object to monitor
 * @param {*} keyNames The keys to monitor from the store, if null the entire store will be monitored (if null shouldComponentUpdate should be implemented).
 * @param {*} propName Name of the injected property object, null to inject as direct properties of component
 */
export default function withSimpleStorage(WrappedComponent, simpleStore, keyNames=[], propName=null) {
    return class extends React.Component {
        constructor(props) {
            super(props);
            
            this._simpleStore = simpleStore;
            this._propName = propName;
            this._keyNames = keyNames;
            this._hasInitialState = false;
            this.state = {};
        }
  
        _storeStateChanged = (val, storeValues) => {
            const prevHasInitialState = this._hasInitialState;
            this._hasInitialState = true;
            // Check if val contains any key we are monitoring
            if(!this._keyNames) {
                this._safeSetState({ [this._propName]: storeValues });
                return;
            }

            for(let k in this._keyNames) {
                if(this._keyNames[k] in val) {
                    if(!this._propName) {
                        this._safeSetState({ ...this._createStateObject(storeValues) });
                    } else {
                        this._safeSetState({ [this._propName]: this._createStateObject(storeValues) });                        
                    }
                    
                    return;
                }
            }

            // If we have not set a state in order to trigger update, we force it here when this._hasInitialState is false
            if(!prevHasInitialState) {
                this.forceUpdate();
            }
        }

        _createStateObject(storeValues) {
            return this._keyNames.reduce((result, item, index, array) => {
                    result[item] = storeValues[item];
                    return result;
                }, {});
        }

        componentDidMount() {
            this._isMounted = true;
            this._storeStateUnregister = this._simpleStore.registerChangeCallback(this._storeStateChanged, true);
        }

        componentWillUnmount() {
            this._isMounted = false;
            this._storeStateUnregister && this._storeStateUnregister();
        }

        _safeSetState(state) {
            this._isMounted && this.setState(state);
        }

        render() {
            const { innerRef, ...restProps } = this.props;
            
            // Prevent double rendering when initial store data is received
            if(!this._hasInitialState) {
                return null;
            }

            return <WrappedComponent ref={innerRef} {...restProps} {...this.state} />;
        }

        /*getInstance() {
            return this._wrappedComponent;
        }*/

        /*_wrappedRef = (el) => {
            this._wrappedComponent = el;
            if(this.props.innerRef) {
                this.props.innerRef(el);
            }
        }*/
    };
}