import { invokeValue } from "../vendors/index.js";

const emptyObj = {};

function take(obj, property, defaultValue) {
    if (property in obj) {
        return obj[property];
    } else {
        return defaultValue;
    }
}

/**
 * 
 * @param {*} arg 
 * @param {boolean} [undefinedForNullable] - defines what should be returned for nullable arg. arg itself or strict false
 * @returns {boolean|null|undefined}
 */
function isObject(arg, undefinedForNullable) {
    if (arg == null) {
        return undefinedForNullable ? arg : false;
    }
    return typeof arg === 'object';
}

function isEmpty(value, options) {
    if (value === undefined) { return true; }

    let { nullIsEmpty = true, zeroIsEmpty = false, emptyStringIsEmpty = true} = options;

    if (value === null) {
        return nullIsEmpty;
    }

    if (value === 0) {
        return zeroIsEmpty;
    }

    if (value === '') {
        return emptyStringIsEmpty;
    }

    return !value;
}

export {
    invokeValue
}

const invokeOptions = {
    invoke: true,
};
const defaultOptions = { };

export function normalizeInvokeOptionValueOptions(optionsParam) {

    if (optionsParam === true) {

        return invokeOptions;

    } else if (optionsParam && typeof optionsParam === 'object') {

        return optionsParam;

    }

    return defaultOptions;
}

export function invokeOptionValue(value, options, entity) 
{
    options = normalizeInvokeOptionValueOptions(options);
    if (options.invoke) {
        let invokeArgs = take(options, 'invokeArgs', entity);
        let invokeContext = take(options, 'invokeContext', entity);        
        value = invokeValue(value, invokeArgs, invokeContext);
    }
    return value;
}


export function invokeProperty(obj, property, third, fourth) {
    if (obj == null) { return; }

    let propertyIsObject = isObject(property, true);
    if (propertyIsObject == null) { return; }
    
    let options = emptyObj;
    let optionsFounded;
    let defaultValue;

    if (propertyIsObject) {
        if (property.property) {
            options = property;
            property = options.property;
            optionsFounded = true;
        } else {
            throw new Error('property was not provided');
        }
    } else {
        let thirdIsObject = isObject(third, true);
        if (thirdIsObject) {
            options = third;
            optionsFounded = true;
        } else if (thirdIsObject !== undefined) {
            defaultValue = third;
        }

        if (!optionsFounded && isObject(fourth)) {
            options = fourth;
            optionsFounded = true;
        }
    }


    defaultValue = take(options, 'defaultValue', defaultValue);
    let invokeArgs = take(options, 'invokeArgs', obj);
    let invokeContext = take(options, 'invokeContext', obj);
    let value = invokeValue(obj[property], invokeArgs, invokeContext);
    return isEmpty(value, options) ? defaultValue : value;
}


/*
const emptyOptions = { };
const invokeOptions = { invoke: true };
*/
/**
 * invokeOptions:
 * {
 *  invoke: boolean,
 *  invokeContext: object, optional
 *  invokeArgs: [], optional
 * }
 * 
 * example:
 * functionValue.apply(invokeOptions.invokeContext, invokeOptions.invokeArgs)
 * 
 */
/*
export function invokeValue(value, options, context) {
    
    if (typeof value !== 'function') { return value; }

    //normalizing options
    options = options === true ? invokeOptions
        : !options ? emptyOptions
        : options;
        
    if (!options.invoke) { return value; }

    // default invoke context is instance by itself
    let invokeContext = options.invokeContext || context;


    if (options.invokeArgs) {
        // if there are invokeArgs using apply
        value = value.apply(invokeContext, options.invokeArgs);
    } else {
        // if invokeArgs are not provided using instance as argument
        value = value.call(invokeContext, context || invokeContext);
    }

    return value;
}
*/