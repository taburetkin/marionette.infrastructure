import { viewStateApi } from '../../Apis/viewStateApi.js';
import { _ } from '../../vendors/index.js';

export const StateMixin = {

    state(...args) {
        return viewStateApi.state(this, ...args);
    },

    // calling this without argument explicitly enables state listeners
    _initializeStateMixin(stateful) {
        if (arguments.length === 0) {
            stateful = this.getOption('stateful', true) !== false;
        }
        viewStateApi.init(this, stateful);
    },

}