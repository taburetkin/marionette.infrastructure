import { _ } from "../vendors/index.js";
import { SimpleView } from "./SimpleView.js";

const ClassOptions = ['initializeClickHandler','clickAction','canBeEnabled', 'canBeDisabled'];

export const ButtonView = SimpleView.extend({
    
    constructor: function(options) {

        this.mergeOptions(options, ClassOptions);

        SimpleView.apply(this, arguments);
        
        _.result(this, 'initializeClickHandler');

        this.on('before:render', this._updateDisabledState);

    },

    tagName: 'button',
    template: '<%= html %>',
    stateful: true,
    stateClassNames: ['waiting'],

    initializeClickHandler() {
        this.delegate('click', this._clickHandler.bind(this));
    },

    _updateDisabledState() {
        if (this.isRendered()) {
            let isDisabled = this.state('disabled');
            let shouldBeEnabled = this._canBe('Enabled', true);
            if (isDisabled && shouldBeEnabled) {
                this._enable();
            } else if (!isDisabled && !shouldBeEnabled) {
                this._disable();
            }
        } else {
            //first render
            if (this.getOption('disabled', true) || !this._canBe('Enabled', true)) {
                this.disable();
            }

        }
    },

    templateContext() {
        return {
            html: this.buildHtml()
        }
    },

    buildHtml() {
        return this.getOption('text', true);
    },

    _isActive() {
        if (this.hasOption('isActive')) {
            return this.getOption('isActive', true);
        }
        if (this.state('disabled') || this.state('waiting')) {
            return false;
        }
        return true;
    },

    _canBe(type, ifUndefined) {
        let property = 'canBe' + type;
        if (property in this) {
            return  _.result(this, property) !== false;
        } else {
            return ifUndefined;
        }
    },

    _clickHandler(event) {

        if (!this._isActive()) { return; }


        this.state('waiting', true);

        this.triggerMethod('before:click', this, event);

        let result = this._takeAction(event);

        if (result && typeof result.then === 'function') {
            result.then((arg) => {
                if (this.isDestroyed()) { return; }
                this.state('waiting', false);
                this._afterClick(event, arg);
            }, (exc) => {
                if (this.isDestroyed()) { return; }
                this.state('waiting', false);
                this._afterClick(event, exc, true);
            });
        } else {
            this.state('waiting', false);
            let failed = result === false;
            this._afterClick(event, result, failed);
        }

    },

    _takeAction(event) {
        let res;
        if (this.clickAction) {
            res = this.clickAction(event);
                //this.getOption('clickAction', { invoke: true, invokeArgs: [this, event], invokeContext: this });
        } else if (this.hasOption('onClick')) {
            res = this.triggerMethod('click', this, event);
        }
        return res;
    },

    _afterClick(event, result, failed) {
        let eventName = this._getTriggerClickEvent(failed);
        if (!eventName) { return; }
        this.triggerMethod(eventName, this, event, result);
    },

    _getTriggerClickEvent(failed) {
        let eventName = this.getOption('triggerClickEvent', true);
        if (eventName === false) { return; }

        if (!eventName) {
            eventName = ['click'];
        }

        if (!Array.isArray(eventName)) {
            eventName = [eventName];
        }

        if (failed) {
            eventName = eventName.map(name => name + ":failed");
        }
            
        return eventName.join(' ');
    },

    disable() {
        if (_.result(this, 'canBeDisabled') === false) { return; }
        this._disable();
    },
    _disable() {
        this.state('disabled', true);
        this.$el.prop('disabled', true);
    },

    enable() {
        if (_.result(this, 'canBeEnabled') === false) { return; }
        this._enable();
    },
    _enable() {
        this.state('disabled', false);
        this.$el.prop('disabled', false);
    },


});