import { attachView, renderView } from "../../utils/view.js";
import { invokeProperty, invokeValue } from "../../utils/invoke.js";

import { _, BbView } from '../../vendors/index.js';

import { buildView } from '../../utils/builders.js';
// import { ModalView } from "./Views/ModalView.js";
// import { ModalBoxView } from "./ModalBoxView.js";
// import { ModalHeaderView } from "./ModalHeaderView.js";
// import { ModalCloseButtonView } from './ModalCloseButtonView.js';

import { modalOptionsToBuildOptions } from './modalOptionsToBuildOptions.js';
import { stack } from './stack.js';

import { config } from './config.js';


function getModalView(modalOptions, showOptions) {
    if (!modalOptions) return;

    let contentView;
    let buildContentViewOptions;

    if (modalOptions instanceof BbView) {
        if (showOptions.showAsIs) {
            return modalOptions;
        } else {
            contentView = modalOptions;
        }
    } else {
        buildContentViewOptions = modalOptions;
    }

    let buildOptions = modalOptionsToBuildOptions(contentView, buildContentViewOptions, showOptions);
    let context, options, defOptions, defClass;
    return buildView(buildOptions, context, options, defOptions, defClass);

}

function _tryDestroyOnSettle(view) {
    let destroyOnPromiseSettle = view.getOption('destroyOnPromiseSettle', true);
    //console.log('?', destroyOnPromiseSettle);
    if (destroyOnPromiseSettle) {
        view.destroy();
    }
}


function setupModalView(view, options) {

    stack.add(view);
    let promise = addSettledPromise(view, options);

    if (options.autoDestroyAfter > 0) {
        view._autoDestroyTimeout = setTimeout(() => view.destroy(), options.autoDestroyAfter);
    }

    return {
        view,
        promise,
        then() {
            return this.promise.then.apply(this.promise, arguments);
        },
        catch() {
            return this.promise.catch.apply(this.promise, arguments);
        },
    }
}


function addSettledPromise(view, options) {
    let promise = new Promise((res, rej) => {
        let settled;
        view.once({
            'resolve:modal'(value) {
                if (settled) { return; }
                settled = true;
                res({ ok: true, value });
                _tryDestroyOnSettle(this);
            },
            'reject:modal'(type, value) {
                if (settled) { return; }
                settled = true;
                rej({ ok: false, value, type });
                _tryDestroyOnSettle(this);
            },
            'destroy'() {
                if (settled) { return; }
                settled = true;
                rej({ ok: false });
            }
        });
    });

    if (options.catchPromise) {
        promise = promise.catch(rejected => Promise.resolve(rejected));
    }

    return promise;
}


function getAttachToElement({ attachTo } = {}) {
    if (attachTo) { return invokeValue(attachTo); }
    return invokeProperty(modalsApi, 'attachTo');
}



function normalizeShowOptions(arg) {
    if (arg === true) {
        return Object.assign({}, config.showOptions, { showAsIs: true });
    }
    return _.extend({}, config.showOptions, arg);
    // return arg && typeof arg === 'object' 
    //     ? Object.assign({}, defaultShowOptions, arg) 
    //     : Object.assign({}, defaultShowOptions);
}


const modalsApi = {

    attachTo: () => document.body,

    show(modalOptions, showOptions) {

        showOptions = normalizeShowOptions(showOptions);

        let view = getModalView(modalOptions, showOptions);

        if (!view) {
            throw new Error('modals: unable to show modal view, view is undefined');
        }

        let el = getAttachToElement(showOptions);
        if (!el) {
            throw new Error('modals: unable to attach modal view, attachTo element is undefined');
        }

        let context = setupModalView(view, showOptions);

        renderView(view);
        attachView(view, el);

        return context;

    }
}

export {
    modalsApi
}