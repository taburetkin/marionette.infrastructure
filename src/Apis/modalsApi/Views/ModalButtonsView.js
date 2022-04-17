import { PromiseButtonsView } from "../../../Views/PromiseButtonsView.js";
import { HamburgerView } from "../../../Views/HamburgerView.js";
import { SimpleView } from "../../../Views/SimpleView.js";
import { _ } from '../../../vendors/index.js';

const SeparatorView = SimpleView.extend({
    template: false,
    baseClassName: 'buttons-separator',
    isSeparator: true,
});

const buildSeparator = (thisClassName) => new SeparatorView({ thisClassName });

const old_ModalButtonsView = HamburgerView.extend({
    tagName: 'footer',
    attributes: { 'data-role': 'modal-promise-buttons' },

    initialize() {
        this.buttonsViews = [];
        this.on('before:render', () => this.buttonsViews.length = 0);
    },

    getChildrenViews() {
        let buttons = [];

        let resolveButton = this.getOption('resolveButton', true);
        let rejectButton = this.getOption('rejectButton', true);
        let rejectHardButton = this.getOption('rejectHardButton', true);

        if (resolveButton) {
            buttons.push(resolveButton);
        }
    
        if (rejectButton) {
            if (buttons.length) {
                buttons.push(buildSeparator('resolve-reject'));
            }
            buttons.push(rejectButton);
        }

        if (rejectHardButton) {
            if (buttons.length) {
                buttons.push(buildSeparator('reject-rejecthard'));
            }
            buttons.push(rejectHardButton);
        }
    
        if (buttons.length) {
            buttons.unshift(buildSeparator('before'));
            buttons.push(buildSeparator('after'));
        }
    
        console.log('*btns*', buttons);
        return buttons;
    
    },

    setupChildView(view) {

        if(!view || _.result(view, 'isSeparator')) {
            return;
        }

        this.buttonsViews.push(view);

        if (view.hasOption('clickAction')) { return; }

        let buttonName = view.getOption('buttonName');
        if (!buttonName) { return; }

        let action = buttonName + 'Action';
        let modalView = this.getOption('modalView');
        let actionMethod = modalView[action];
        if (!actionMethod) { return; }

        view.clickAction = actionMethod;


    },
    childViewTriggers:{
        'resolve':'resolve:modal',
    },
    childViewEvents: {
        'reject'(buttonView, event, value) {
            this.trigger('reject:modal', 'soft', value);
        },
        'rejectHard'(buttonView, event, value) {
            this.trigger('reject:modal', 'hard', value);
        },

        'before:click':'disable',
        'after:click after:click:failed':'enable',
        'after:click:failed':'enable',

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
        // if (*TODO: check if button can be enabled) {
        //    let buttonName = btn.getOption('buttonName');
        // }
        _.result(btn, 'enable');
    },

});

export const ModalButtonsView = PromiseButtonsView.extend({
    tagName: 'footer',
    attributes: { 'data-role': 'modal-promise-buttons' },
    eventPostfix: 'modal',
    _getActionMethod(buttonName) {
        let action = buttonName + 'Action';
        let modalView = this.getOption('modalView');
        let actionMethod = modalView.getOption(action);
        console.log('-actionmethod-', action, actionMethod);
        return actionMethod;
    },
});