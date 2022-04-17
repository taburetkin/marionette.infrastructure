import { _ } from '../vendors/index.js';

import { invokeOptionValue, normalizeInvokeOptionValueOptions } from './invoke.js';



export function getOption(entity, optionName, options)
{
    if (arguments.length < 2 || entity == null) { return; }

    let value;
    if (entity.options && (entity.options[optionName] !== undefined)) {
        value = entity.options[optionName];
    } else {
        value = entity[optionName];
    }


    return invokeOptionValue(value, options, entity);
}


export function mergeOptions(entity, options, keys, invokeOptions) {
    if (!options) { return; }

    invokeOptions = normalizeInvokeOptionValueOptions(invokeOptions);

    _.each(keys, (key) => {
        
      const option = invokeOptionValue(options[key], invokeOptions, entity);

      if (option !== undefined) {
        entity[key] = option;
      }

    });
}