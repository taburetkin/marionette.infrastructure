import { 
    destroyView as originalDestroyView,
    renderView as originalRenderView,
    triggerMethod as vendorTriggerMethod
} from 'backbone.marionette';

import { domApi } from '../Apis/domApi/index.js';




///
/// ATTACH
///

function attachView(view, el) {

    if (el == null) {
        throw new Error('dom element was not provided');
    }

    viewTriggerMethod(view, 'before:attach', view);
    
    domApi.appendContents(el, view.el);

    view._isAttached = true;
    viewTriggerMethod(view, 'attach', view);

}


///
/// DETACH
///

function _destroyViewEl(view) {
    if (view.Dom && view.Dom.destroyEl) {
        view.Dom.destroyEl(view.$el);
    } else {
        domApi.destroyEl(view.$el);
    }
}

function _detachViewEl(view) {
    if (view.Dom) {
        view.Dom.detachEl(view.el, view.$el);
    } else {
        domApi.detachEl(view.el, view.$el);
    }
}

function detachView(view, shouldDestroy) {

    const shouldTriggerDetach = view._isAttached && !view._disableDetachEvents;
    if (shouldTriggerDetach) {
        viewTriggerMethod(view, 'before:detach', view);
    }


    let action = shouldDestroy ? _destroyViewEl : _detachViewEl;
    action(view);


    if (shouldTriggerDetach) {
        view._isAttached = false;
        viewTriggerMethod(view, 'detach', view);
    }

}

///
/// RENDER
///

const renderView = originalRenderView || function(view) {
    if (view._isRendered) {
        return;
    }

    let shouldTrigger = !view.supportsRenderLifecycle;

    if (shouldTrigger) {
        viewTriggerMethod(view, 'before:render', view);
    }

    view.render();
    view._isRendered = true;

    if (shouldTrigger) {
        viewTriggerMethod(view, 'render', view);
    }

}


///
/// DESTROY
///

const destroyView = originalDestroyView || function(view, disableDetachEvents) {

    // Attach flag for public destroy function internal check
    view._disableDetachEvents = disableDetachEvents;

    let shouldTrigger = !view.supportsDestroyLifecycle;

    let destroyImplemented = !!view.destroy;


    // Destroy for non-Marionette Views
    if (shouldTrigger) {
        viewTriggerMethod(view, 'before:destroy', view);
    }

    if (destroyImplemented) {
        view.destroy();
    } else {
        detachView(view, true);
    }
    view._isDestroyed = true;


        
    if (shouldTrigger) {
        viewTriggerMethod(view, 'destroy', view);
    }

    if (!destroyImplemented) {
        view.stopListening();
        delete view.model;
		delete view.collection;
		delete view.options;
		delete view.$el;
		delete view.el;
    }
}


///
/// utilities
///


function viewTriggerMethod(view, ...args)
{
    if (view.triggerMethod) {
        return view.triggerMethod.apply(view, args);
    }
    return vendorTriggerMethod.apply(null, arguments);
}



export {
    renderView,
    attachView,
    detachView,
    destroyView, 
}
