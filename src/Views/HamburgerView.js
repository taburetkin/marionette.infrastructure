import { CommonMixin } from "./mixins/common.js";
import { DestroyLifeCycleMixin } from "./mixins/destroyLifeCycle.js";
import { RenderLifeCycleMixin } from "./mixins/renderLifeCycle.js";
import { RenderTemplateMixin } from "./mixins/renderTemplate.js";
import { StaticMixin } from "./mixins/static.js";
import { BbView, MnView, Region, MnCollectionView, _, monitorViewEvents } from "../vendors/index.js";
import { ChildrenViews } from "./children-views.js";
import { ClassNameMixin } from "./mixins/className.js";
import { StateMixin } from "./mixins/state.js";
import { ListenToMixin } from "./mixins/listenTo.js";
import { buildView } from '../utils/builders.js';
import { destroyView } from '../utils/view';


const ClassOptions = [
    'buildChildView',
    'setupChildView',
    'behaviors',
    'childViewEventPrefix',
    'childViewEvents',
    'childViewTriggers',
    'collectionEvents',
    'events',
    'modelEvents',
    'triggers',
];

/**
 * HamburgerView is a Marionette View with children views.
 */



const HamburgerView = BbView.extend({
	constructor: function(options) {
        this._setOptions(options, ClassOptions);
		monitorViewEvents(this);

        // StateMixin
		this._initializeStateMixin();

        this._children = new ChildrenViews();

		BbView.prototype.constructor.apply(this, arguments);

        this._initializeClassNameMixin();
        this._initializeListenToMixin();
	},

    delegateEvents: MnView.prototype.delegateEvents,
    _proxyBehaviorViewProperties: MnView.prototype._proxyBehaviorViewProperties,
    _buildEventProxies: MnView.prototype._buildEventProxies,
    normalizeMethods: MnView.prototype.normalizeMethods,
    _getEventPrefix: MnView.prototype._getEventPrefix,
    _getBehaviorEvents: MnView.prototype._getBehaviorEvents,
    _getEvents: MnView.prototype._getEvents,
    _getBehaviorTriggers: MnView.prototype._getBehaviorTriggers,
    _getTriggers: MnView.prototype._getTriggers,
    _childViewEventHandler: MnView.prototype._childViewEventHandler,


    _setupChildView: Region.prototype._setupChildView,
    _proxyChildViewEvents: MnView.prototype._proxyChildViewEvents,
    _getBuffer: MnCollectionView.prototype._getBuffer,
    _attachChildren: MnCollectionView.prototype._attachChildren,
    attachHtml: MnCollectionView.prototype.attachHtml,

}, StaticMixin);

_.extend(HamburgerView.prototype, 
    CommonMixin, RenderLifeCycleMixin, DestroyLifeCycleMixin, RenderTemplateMixin, 
    ClassNameMixin, StateMixin, ListenToMixin, 
    {
        destroyChildren() {
            while(this._children.views.length) {
                let view = this._children.views.pop();
                destroyView(view);
            }
        },
    
        renderChildren() {
    
            this.destroyChildren();
    
            this.triggerMethod('before:render:children', this);
    
            this._updateChildrenContainer();
    
            let views = this._getChildrenViews();
    
            this._children.reset(views);
            const els = this._getBuffer(views);
            this._attachChildren(els, views);
    
            this.triggerMethod('render:children', this);
        },
    
        _updateChildrenContainer() {
            let containerSelector = this.getOption('childViewContainer', true);
            if (containerSelector) {
                this.$container = this.$(containerSelector);
            } else {
                this.$container = this.$el;
            }
        },
    
        _getChildrenViews() {
            let views = this.getChildrenViews();
            return views.reduce((passed, arg, index) => {
                let view = this._buildChildView(arg, index);
                if (view && !view.isDestroyed()) {
                    passed.push(view);
                }
                return passed;
            }, []);
        },
    
        getChildrenViews() {
            return this.getOption('childrenViews', true) || [];
        },
    
        _buildChildView(view, index) {

            if (this.buildChildView) {
                let options = this._getChildViewOptions();
                view = this.buildChildView(view, options, this.getOption('childView', false), index);
            }

            if (!view) { return view; }

            this._setupChildView(view);

            if (this.setupChildView)
                this.setupChildView(view, index);

            return view;
        },
    
        _getChildViewOptions() {
            return this.getOption('childViewOptions', true);
        },

        buildChildView(arg, options, defClass, index) {
            return buildView(arg, this, options, undefined, defClass);
        },

        // for monitorViewEvents
        _getImmediateChildren() {
            return this._children.views;
        }
});



export { HamburgerView };