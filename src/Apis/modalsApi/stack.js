import { _, $ } from '../../vendors/index.js';
import { domApi } from "../domApi/index.js";

const destroyerMixin = {
    add(view) {
        let handler = this.handler.bind(view);
        this.settleEvent(handler);
        view.on('destroy', () => this.removeEvent(handler));
    },
    settleEvent(handler) {
        domApi.addEventListener(this.getEl(), this.event, handler);
    },
    removeEvent(handler) {
        domApi.removeEventListener(this.getEl(), this.event, handler);
    }
}

const escapeDestroyer = {
    event: 'keyup',
    getEl: () => document,
    handler(event) {
        if (event.which !== 27 || !stack.isLast(this)) { return; }
        event.stopPropagation();
        this.destroy();
    },
    ...destroyerMixin
}

const outsideClickDestroyer = {
    event: 'click',
    getEl: () => document,

    handler(event) {

        
        if (!stack.isLast(this)) { return; }

        let inside = (this.el === event.target || $.contains(this.el, event.target));
        if (inside) { return; }

        event.stopPropagation();
        this.destroy();
        
    },

    insideHandler() {
        if (!stack.isLast(this)) { return; }
        this.destroy();
    },

    ...destroyerMixin
}

export const stack = {

    modals: [],
    
    add(view) {
        this.modals.push(view);

        if (view.getOption('destroyOnEscAllowed', true) !== false) {
            escapeDestroyer.add(view);
        }

        if (view.getOption('destroyOnOutsideClickAllowed', true) !== false) {
            outsideClickDestroyer.add(view);
            let insideHandler = outsideClickDestroyer.insideHandler.bind(view);
            view.on('outside:click', insideHandler);
            view.on('destroy', () => view.off('outside:click', insideHandler));
        }

        view.on({
            'destroy:modal': () => {
                if(this.isLast(view)) {
                    view.destroy();
                }
            },
            'destroy': () => this.remove(view)
        });

    },

    isLast(view) {
        return view === _.last(this.modals);
    },

    remove(view) {
        let index = this.modals.indexOf(view);
        if (index == -1) return;
        this.modals.splice(index, 1);
    }
}