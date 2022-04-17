import { _ } from "../vendors/index.js";

const emptyObj = {};
const emptyArr = [];

function isValue(arg) {
    return arg != null && arg !== '';
}


function stateValue(value, falsyValue, trueValue) {
    if (isValue(value)) {
      if (trueValue && value === true) {
          return trueValue;
      }
      return value;
    } else {
        return falsyValue;
    }
}


function textValue(view, key) {
    let value = getStateValue(view, key);
    return stateValue(value, '', key);
}


function getState(view) {
    return {
        ...getModelState(view),
        ...getViewState(view)
    }
}

function getViewState(view) {
    return view._state || emptyObj
}

function getModelState(view) {
    if (!view.model) return emptyObj;
    let keys = getModelStateKeys(view, view.model);
    if (!keys || !keys.length) return emptyObj;
    return keys.reduce((hash, key) => {
        hash[key] = view.model.get(key);
        return hash;
    }, {});
}

function getModelStateKeys(view) {

    _ensureModelStateKeys(view);

    return view._modelStateKeys;
}

function isModelStateKey(view, key) {    
    _ensureModelStateKeys(view);
    return key in view._modelStateKeysHash;
}

// view side effects:
// view._modelStateKeys = [ ... ]
// view._modelStateKeysHash = { ... }
function _ensureModelStateKeys(view) {

    if ('_modelStateKeys' in view) return;

    let keys = view.getOption('modelStateKeys', true) || emptyArr;
    view._modelStateKeys = keys;
    view._modelStateKeysHash = keys.reduce((all, key) => {
        all[key] = 1;
        return all;
    }, {});
}

// view side effects:
// view._state = { ... }
function _ensureViewState(view)
{
    if (view._state) return;
    view._state = {}
}


function setState(view, valuesHash) {
    let hasModelValues;
    let changes = _.reduce(valuesHash, (memo, value, key) => {

        let oldValue = getStateValue(view, key);
        if (_.isEqual(oldValue, value)) { return memo; }

        let obj = memo.own;
        if (isModelStateKey(view, key)) {
            obj = memo.model;
            hasModelValues = true;
        }

        obj[key] = value;
        memo.all[key] = value;
        return memo;
    }, {
        all: {},
        model: {},
        own: {}
    });

    _ensureViewState(view);
    let state = getViewState(view);
    Object.assign(state, changes.own);

    if (hasModelValues) {
        view.model.set(changes.model, { initiator: 'viewStateApi' });
    }

    if (!view._isStateful) return;

    _.each(changes.own, (value, key) => {
        view.triggerMethod('state:' + key, value);
    });
    view.triggerMethod('state', changes.all);

}


function getStateValue(view, key)
{
    if (isModelStateKey(view, key)) {
        return view.model && view.model.get(key);
    } else {
        return getViewState(view)[key];
    }
}


function initializeStateApi(view, stateful) {

    if (view._stateApiInitialized) return;
    view._stateApiInitialized = true;

    view.on('destroy', view => {
        delete view._state;
        delete view._modelStateKeys;
        delete view._modelStateKeysHash;
    });

    let initialState = view.getOption('initialState', true);    
    setState(view, initialState);
    
    // if (arguments.length === 1) {
    //     let viewstateful = view.getOption('stateful', true);
    //     if (viewstateful != null)
    //         stateful = viewstateful === true;
    // }

    if (stateful != null) {
        view._isStateful = stateful === true;
    }

    if (!view._isStateful) return;

    let modelKeys = getModelStateKeys(view);
    if (view.model) {
        let eventsHash = modelKeys.reduce((hash, key) => {
            hash['change:'+key] = (model, value, options) => view.triggerMethod('state:' + key, value);
            return hash;
        }, {
            change: (model, options) => {

                if (options.initiator === 'viewStateApi') return;

                let stateChanges = _.reduce(model.changes, (memo, value, key) => {
                    if (isModelStateKey(key)) {
                        memo[key] = value;
                    }
                    return memo;
                }, {});

                if (_.size(stateChanges)) {
                    view.triggerMethod('state', stateChanges);
                }
            }
        });
        view.listenTo(view.model, eventsHash);
    }

}

/*

view's options:
{
    modelStateKeys: ['property1', 'property2', .... ], // will provide values of those properties as part of view state 
}

*/

export const viewStateApi = {

    value: stateValue,

    // state(view) returns state object
    // state(view, key) return state key value
    // state(view, key, value) sets state key value
    // state(view, keyValues) sets state values by given keyValues hash
    state(view, key, value) {

        if (!view) {
            throw new Error('first argument must be a stateful object');
        }

        if (arguments.length === 1) {
            return getState(view);
        } 

        if (!isValue(key)) {
            throw new Error('second argument must be an object or a state key name')
        }

        if (typeof key === 'object') {
            return setState(view, key);
        }

        if (arguments.length === 2) {
            return getStateValue(view, key);
        }

        return setState(view, { [key]:value });
    },

    text: textValue,

    texts(view, keys, joinChar) {
        if (!keys || !Array.isArray(keys)) return joinChar ? '' : emptyArr;

        let values = keys.reduce((all, key) => {
            let value = textValue(view, key);
            if (value) {
                all.push(value);
            }
            return all;
        }, []);

        if (joinChar) {
            values = values.join(joinChar);
        }

        return values;
    },

    init: initializeStateApi
}