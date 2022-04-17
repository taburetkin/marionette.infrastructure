import { _, MnView } from '../../vendors/index.js';
import { getOption, mergeOptions } from '../../utils/options.js';

export const OptionsMixin = {

    // used in a view constructor
    _setOptions: MnView.prototype._setOptions,


    // MODIFIED: allows pass options object to specify behavior for func result
    // options: null | boolean | { invoke: true, invokeArgs: [], invokeContext: object | undefined }, invokeArgs[] is used as passed arguments
    getOption(optionName, options) {
        return getOption(this, optionName, options);
    },

    getOptions(optionNames, options) {
        return optionNames.reduce((memo, optionName) => {
            memo[optionName] = this.getOption(optionName, options);
            return memo;
        }, {});
    },

    hasOption(key, optionsOnly) {
        if (this.options && this.options[key] !== undefined) {
            return true;
        }
        if (!optionsOnly) {
            return this[key] !== undefined;
        }
        return false;
    },

    // MODIFIED: accepts invokeOptions for invoking
    mergeOptions(options, keys, invokeOptions) {
        return mergeOptions(this, options, keys, invokeOptions);
    },
}