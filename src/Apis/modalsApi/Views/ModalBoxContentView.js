import { HamburgerView } from "../../../Views/HamburgerView.js";

export const ModalBoxContentView = HamburgerView.extend({
    attributes: { 'data-role': 'modal-content' },

    childViewOptions() {
        return {
            modalView: this.getOption('modalView'),
            modalBoxView: this.getOption('modalBoxView'),
            modalBoxContentView: this
        }
    },

    getChildrenViews() {
        let content = this.getOption('content');
        if (Array.isArray(content)) {
            return content;
        } else if (content) {
            return [content];
        }
        
    },

    setupChildView(view) {
        this._setPromiseSettleAction('resolve', view);
        this._setPromiseSettleAction('reject', view);
        this._setPromiseSettleAction('rejectHard', view);
    },

    _setPromiseSettleAction(type, view) {
        if (!view) { return; }
        let action = type + 'Action';
        let modalView = this.getOption('modalView');

        console.log('---', type, action, view.hasOption(action));

        if (view.hasOption(action)) {
            modalView.setPromiseSettleAction(type, () => view.isDestroyed() ? undefined : view.getOption(action, true));
            view.on('destroy', () => modalView.setPromiseSettleAction(type));
        }
    },
    // childViewEvents: {
    //     'reject:modal'() {
    //         console.log('-->', arguments);
    //     }
    // }
    childViewTriggers:{
        'resolve:modal':'resolve:modal',
        'reject:modal':'reject:modal',
    }
});