import { viewStateApi } from "../../Apis/viewStateApi.js";
import { invokeValue } from "../../utils/invoke.js";
import { _ } from '../../vendors/index.js';

const emptyArr = [];

const addValue = (value, hash, context) => {
    value = invokeValue(value, true, context);
    value = value && value.toString().trim() || undefined;
    if (value == null || value === '') return;

    if (value.indexOf(' ') == -1) {
        hash[value] = 1;
    } else {
        let chunks = value.split(/\s+/gmi);
        chunks.reduce((h, k) => {
            if (k) {
                h[k] = 1;
            }
            return h;
        },hash);
    }
}

const addValues = (values = emptyArr, hash, context) => {
    for (let x = 0; x < values.length; x++) {
        addValue(values[x], hash, context);
    }
}

export const ClassNameMixin = {

    //baseClassName: 'base-component',

    //thisClassName: 'concrete-component',

    // classNames: [ 
    //     'state 1', 
    //     'state 2',
    //     v => v.model && v.model.get('state')
    // ],

    className() { return this._className() },

    _className() {
        let hash = this._getClassNameHash();
        let css = Object.keys(hash).join(' ').trim();
        if (css !== '') { return css; }
    },

    _getClassNameHash() {
        let hash = {};
        addValue(this.getOption('baseClassName', true), hash, this);
        addValue(this.getOption('thisClassName', true), hash, this);
        addValues(this.getOption('classNames', true), hash, this);        
        addValues(viewStateApi.texts(this, this.getOption('stateClassNames', true)), hash, this);
        return hash;
    },

    updateElClassName(css) {
        if (css) {
            this.$el.attr('class', css);
        } else {
            this.$el.removeAttr('class', css);
        }
    },

    _updateElClassName() {
        if (!this._debouncedUpdateElClassName) {
            this._debouncedUpdateElClassName = _.debounce(() => {
                let css = invokeValue(this._className, true, this);
                this.updateElClassName(css);
            }, 0);
        }
        this._debouncedUpdateElClassName();
    },

    updateElClassOn(entity, event, once) {
        if (!event || !entity) return;
        if (entity != this) {
            let method = once ? this.listenToOnce : this.listenTo;
            method.call(this, entity, event, this._updateElClassName);
        } else {
            let method = once ? this.once : this.on;
            method.call(this, event, this._updateElClassName);
        }
    },

    // updateElClassBeforeRender: true | "once"
    _initializeClassNameMixin() {
        if (this._classNamesMixinHandlersInitialized) return;
        this._classNamesMixinHandlersInitialized = true;

        let beforeRender = this.getOption('updateElClassBeforeRender');
        if (beforeRender) {
            this.updateElClassOn(this, 'before:render', beforeRender === 'once');
        }

        let stateClassNames = this.getOption('stateClassNames', true);
        if (stateClassNames && stateClassNames.length) {
            let eventsNames = stateClassNames.map(cn => 'state:' + cn).join(' ');
            this.updateElClassOn(this, eventsNames);
        }
    }
}