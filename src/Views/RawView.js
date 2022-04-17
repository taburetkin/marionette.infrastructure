import { BbView } from '../vendors/index.js';
import { CommonMixin } from './mixins/common';

const RawViewClassOptions = ['options'];

export const RawView = BbView.extend({
    
    ...CommonMixin,

    constructor: function(options) {
        this._setOptions(options, RawViewClassOptions)
        BbView.prototype.constructor.apply(this, arguments);
    },


});