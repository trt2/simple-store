# React: withSimpleStorage

Wrap a component with `withSimpleStorage` to inject store values into props.

In this example, the `globalTimespan` value from the store will be injected into the properties of TestComponent
```
import withSimpleStorage from './withSimpleStorage';
import AppState from './AppState';   //This is our SimpleStore

function TestComponent(props) {
    const { globalTimespan } = props;
   
    return <div>
        ...
        <SomeOtherComponent globalTimespan={globalTimespan}/>
        ...
    </div>;
}

export default withSimpleStorage(TestComponent, AppState, ['globalTimespan']);
```

`function withSimpleStorage(WrappedComponent, simpleStore, keyNames=[], propName=null)`
- WrappedComponent - Component to inject props into.
- simpleStore - The SimpleStore object to monitor.
- keyNames - The keys to monitor from the store, if null the entire store will be monitored (if null shouldComponentUpdate should be implemented).
- propName - Name of the injected property object, null to inject as direct properties of component.