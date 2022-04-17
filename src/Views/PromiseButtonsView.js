import { HamburgerView } from "./HamburgerView.js";
import { ButtonView } from "./ButtonView.js";
import { SimpleView } from "./SimpleView.js";
import _ from "underscore";

export const PromiseButtonsView = HamburgerView.extend({

    initialize() {
        this.buttonsViews = [];
        this.on('before:render', () => this.buttonsViews.length = 0);
    },

    buildSeparator(thisClassName) {
        let separator = new SimpleView({
            template: false,
            baseClassName: 'buttons-separator',
            thisClassName,
        });
        separator.isSeparator = true;
        return separator;
    },

    getChildrenViews() {
        let buttons = [];

        let resolveButton = this.getResolveButton();
        let rejectButton = this.getRejectButton();
        let rejectHardButton = this.getRejectHardButton();

        if (resolveButton) {
            buttons.push(resolveButton);
        }
    
        if (rejectButton) {
            if (buttons.length) {
                buttons.push(this.buildSeparator('resolve-reject'));
            }
            buttons.push(rejectButton);
        }

        if (rejectHardButton) {
            if (buttons.length) {
                buttons.push(this.buildSeparator('reject-rejecthard'));
            }
            buttons.push(rejectHardButton);
        }
    
        if (buttons.length) {
            buttons.unshift(this.buildSeparator('before'));
            buttons.push(this.buildSeparator('after'));
        }
    
        return buttons;
    
    },

    getResolveButton() {
        return this._getButton('resolve');
    },

    getRejectButton() {
        return this._getButton('reject');
    },

    getRejectHardButton() {
        return this._getButton('rejectHard');
    },

    _getButton(name) {
        let _btn = this.getOption(name + 'Button', true);
        if (_btn == null || _btn === false) { return; }

        let type = typeof _btn;
        
        let options;

        if (type !== 'object' && type !== 'function') {
            options = { text: _btn };
        } else if (type === 'function') {
            options = { class: _btn };
        } else if (type === 'object') {
            options = _btn;
        }

        let btn = _.extend({
            class: ButtonView,
            buttonName: name,
            text: _btn
        }, options);

        return btn;
    },

    _getActionMethod(buttonName) {
        let action = buttonName + 'Action';        
        let actionMethod = this.getOption(action);
        return actionMethod;
    },

    setupChildViewAction(view) {
        if (view.hasOption('clickAction')) { return; }

        let buttonName = view.getOption('buttonName', true);
        if (!buttonName) { return; }

        let actionMethod = this._getActionMethod(buttonName);
        if (typeof actionMethod === 'function') {
            view.clickAction = actionMethod;
        }
    },

    setupChildView(view) {

        if(!view || _.result(view, 'isSeparator')) {
            return;
        }

        this.buttonsViews.push(view);
        let buttonName = view.getOption('buttonName', true);
        this.listenTo(view, {
            'before:click': this.disable,
            'after:click': this.enable,
            'after:click:failed': this.enable,
            // [buttonName]: (buttonView, event, value) => this._settle(buttonName, buttonView, event, value),
            // 'resolve': (buttonView, event, value) => this._settle('resolve', buttonView, event, value),
            // 'reject': (buttonView, event, value) => this._settle('reject', buttonView, event, value),
            // 'rejectHard': (buttonView, event, value) => this._settle('rejectHard', buttonView, event, value),
        });

        if (buttonName) {
            this.listenTo(view, buttonName, (buttonView, event, value) => this._settle(buttonName, buttonView, event, value));
        }

        this.setupChildViewAction(view);

    },

    _getEventName(buttonName) {
        let prefix = this.getOption('eventPrefix');
        if (prefix != null) { 
            prefix += ':';
        } else {
            prefix = ''
        }

        let postfix = this.getOption('eventPostfix');
        if (postfix != null) { 
            postfix = ':' + postfix;
        } else {
            postfix = ''
        }

        return prefix + buttonName + postfix;
    },

    _settle(buttonName, buttonView, event, value) {

        let type = 'soft';
        if (buttonName === 'rejectHard') {
            type = 'hard';
            buttonName = 'reject';
        }

        let eventName = this._getEventName(buttonName);
        if (buttonName === 'resolve') {
            this.trigger(eventName, value);    
        } else {
            this.trigger(eventName, type, value);
        }
    },

    disable() {
        this.buttonsViews.forEach(button => this._disableButton(button));
    },
    _disableButton(btn) {
        _.result(btn, 'disable');
    },

    enable() {
        this.buttonsViews.forEach(button => this._enableButton(button));
    },
    _enableButton(btn) {
        _.result(btn, 'enable');
    },
});