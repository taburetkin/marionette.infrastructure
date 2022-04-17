(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('backbone.marionette'), require('yaff-entitybuilder'), require('backbone'), require('underscore'), require('jquery')) :
    typeof define === 'function' && define.amd ? define(['exports', 'backbone.marionette', 'yaff-entitybuilder', 'backbone', 'underscore', 'jquery'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.MnInfra = {}, global.Mn, global.YaffEb, global.Backbone, global._, global.$));
})(this, (function (exports, backbone_marionette, yaffEntitybuilder, backbone, _, $) { 'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var ___default = /*#__PURE__*/_interopDefaultLegacy(_);
    var $__default = /*#__PURE__*/_interopDefaultLegacy($);

    const renderView = backbone_marionette.renderView || function(view) {
        if (view._isRendered) {
            return;
        }

        if (!view.supportsRenderLifecycle) {
            view.triggerMethod('before:render', view);
        }

        view.render();
        view._isRendered = true;

        if (!view.supportsRenderLifecycle) {
            view.triggerMethod('render', view);
        }
    };

    const destroyView = backbone_marionette.destroyView || function(view, disableDetachEvents) {
        if (view.destroy) {
            // Attach flag for public destroy function internal check
            view._disableDetachEvents = disableDetachEvents;
            view.destroy();
            return;
        }

        // Destroy for non-Marionette Views
        if (!view.supportsDestroyLifecycle) {
            view.triggerMethod('before:destroy', view);
        }

        const shouldTriggerDetach = view._isAttached && !disableDetachEvents;

        if (shouldTriggerDetach) {
            view.triggerMethod('before:detach', view);
        }

        view.remove();

        if (shouldTriggerDetach) {
            view._isAttached = false;
            view.triggerMethod('detach', view);
        }

        view._isDestroyed = true;
            
        if (!view.supportsDestroyLifecycle) {
            view.triggerMethod('destroy', view);
        }
    };

    function attachView(view, el) {
        view.trigger('before:attach', view);
        view.Dom.appendContents(el, view.el);
        view._isAttached = true;
        view.trigger('attach', view);
    }

    // adding backbone view to known ctros store
    yaffEntitybuilder.addKnownCtor(backbone.View);

    const emptyObj$1 = {};

    function take(obj, property, defaultValue) {
        if (property in obj) {
            return obj[property];
        } else {
            return defaultValue;
        }
    }

    function isObject(arg, undefinedForNullable) {
        if (arg == null) {
            return undefinedForNullable ? arg : false;
        }
        return typeof arg === 'object';
    }

    function isEmpty(value, options) {
        if (value === undefined) { return true; }

        let { nullIsEmpty = true, zeroIsEmpty = false, emptyStringIsEmpty = true} = options;

        if (value === null) {
            return nullIsEmpty;
        }

        if (value === 0) {
            return zeroIsEmpty;
        }

        if (value === '') {
            return emptyStringIsEmpty;
        }

        return !value;
    }

    const invokeOptions = {
        invoke: true,
    };
    const defaultOptions = { };

    function normalizeInvokeOptionValueOptions(optionsParam) {

        if (optionsParam === true) {

            return invokeOptions;

        } else if (optionsParam && typeof optionsParam === 'object') {

            return optionsParam;

        }

        return defaultOptions;
    }

    function invokeOptionValue(value, options, entity) 
    {
        options = normalizeInvokeOptionValueOptions(options);
        if (options.invoke) {
            let invokeArgs = take(options, 'invokeArgs', entity);
            let invokeContext = take(options, 'invokeContext', entity);        
            value = yaffEntitybuilder.invokeValue(value, invokeArgs, invokeContext);
        }
        return value;
    }


    function invokeProperty(obj, property, third, fourth) {
        if (obj == null) { return; }

        let propertyIsObject = isObject(property, true);
        if (propertyIsObject == null) { return; }
        
        let options = emptyObj$1;
        let optionsFounded;
        let defaultValue;

        if (propertyIsObject) {
            if (property.property) {
                options = property;
                property = options.property;
                optionsFounded = true;
            } else {
                throw new Error('property was not provided');
            }
        } else {
            let thirdIsObject = isObject(third, true);
            if (thirdIsObject) {
                options = third;
                optionsFounded = true;
            } else if (thirdIsObject !== undefined) {
                defaultValue = third;
            }

            if (!optionsFounded && isObject(fourth)) {
                options = fourth;
                optionsFounded = true;
            }
        }


        defaultValue = take(options, 'defaultValue', defaultValue);
        let invokeArgs = take(options, 'invokeArgs', obj);
        let invokeContext = take(options, 'invokeContext', obj);
        let value = yaffEntitybuilder.invokeValue(obj[property], invokeArgs, invokeContext);
        return isEmpty(value, options) ? defaultValue : value;
    }


    /*
    const emptyOptions = { };
    const invokeOptions = { invoke: true };
    */
    /**
     * invokeOptions:
     * {
     *  invoke: boolean,
     *  invokeContext: object, optional
     *  invokeArgs: [], optional
     * }
     * 
     * example:
     * functionValue.apply(invokeOptions.invokeContext, invokeOptions.invokeArgs)
     * 
     */
    /*
    export function invokeValue(value, options, context) {
        
        if (typeof value !== 'function') { return value; }

        //normalizing options
        options = options === true ? invokeOptions
            : !options ? emptyOptions
            : options;
            
        if (!options.invoke) { return value; }

        // default invoke context is instance by itself
        let invokeContext = options.invokeContext || context;


        if (options.invokeArgs) {
            // if there are invokeArgs using apply
            value = value.apply(invokeContext, options.invokeArgs);
        } else {
            // if invokeArgs are not provided using instance as argument
            value = value.call(invokeContext, context || invokeContext);
        }

        return value;
    }
    */

    const emptyObj = {};
    const emptyArr$1 = [];

    function isValue(arg) {
        return arg != null && arg !== '';
    }


    function stateValue(value, falsyValue, trueValue) {
        if (isValue(value)) {
          if (trueValue && value === true) {
              return trueValue;
          }
          return value;
        } else {
            return falsyValue;
        }
    }


    function textValue(view, key) {
        let value = getStateValue(view, key);
        return stateValue(value, '', key);
    }


    function getState(view) {
        return {
            ...getModelState(view),
            ...getViewState(view)
        }
    }

    function getViewState(view) {
        return view._state || emptyObj
    }

    function getModelState(view) {
        if (!view.model) return emptyObj;
        let keys = getModelStateKeys(view, view.model);
        if (!keys || !keys.length) return emptyObj;
        return keys.reduce((hash, key) => {
            hash[key] = view.model.get(key);
            return hash;
        }, {});
    }

    function getModelStateKeys(view) {

        _ensureModelStateKeys(view);

        return view._modelStateKeys;
    }

    function isModelStateKey(view, key) {    
        _ensureModelStateKeys(view);
        return key in view._modelStateKeysHash;
    }

    // view side effects:
    // view._modelStateKeys = [ ... ]
    // view._modelStateKeysHash = { ... }
    function _ensureModelStateKeys(view) {

        if ('_modelStateKeys' in view) return;

        let keys = view.getOption('modelStateKeys', true) || emptyArr$1;
        view._modelStateKeys = keys;
        view._modelStateKeysHash = keys.reduce((all, key) => {
            all[key] = 1;
            return all;
        }, {});
    }

    // view side effects:
    // view._state = { ... }
    function _ensureViewState(view)
    {
        if (view._state) return;
        view._state = {};
    }


    function setState(view, valuesHash) {
        let hasModelValues;
        let changes = ___default["default"].reduce(valuesHash, (memo, value, key) => {

            let oldValue = getStateValue(view, key);
            if (___default["default"].isEqual(oldValue, value)) { return memo; }

            let obj = memo.own;
            if (isModelStateKey(view, key)) {
                obj = memo.model;
                hasModelValues = true;
            }

            obj[key] = value;
            memo.all[key] = value;
            return memo;
        }, {
            all: {},
            model: {},
            own: {}
        });

        _ensureViewState(view);
        let state = getViewState(view);
        Object.assign(state, changes.own);

        if (hasModelValues) {
            view.model.set(changes.model, { initiator: 'viewStateApi' });
        }

        if (!view._isStateful) return;

        ___default["default"].each(changes.own, (value, key) => {
            view.triggerMethod('state:' + key, value);
        });
        view.triggerMethod('state', changes.all);

    }


    function getStateValue(view, key)
    {
        if (isModelStateKey(view, key)) {
            return view.model && view.model.get(key);
        } else {
            return getViewState(view)[key];
        }
    }


    function initializeStateApi(view, stateful) {

        if (view._stateApiInitialized) return;
        view._stateApiInitialized = true;
        let initialState = view.getOption('initialState', true);
        
        setState(view, initialState);
        
        // if (arguments.length === 1) {
        //     let viewstateful = view.getOption('stateful', true);
        //     if (viewstateful != null)
        //         stateful = viewstateful === true;
        // }

        if (stateful != null) {
            view._isStateful = stateful === true;
        }

        if (!view._isStateful) return;

        let modelKeys = getModelStateKeys(view);
        if (view.model) {
            let eventsHash = modelKeys.reduce((hash, key) => {
                hash['change:'+key] = (model, value, options) => view.triggerMethod('state:' + key, value);
                return hash;
            }, {
                change: (model, options) => {

                    if (options.initiator === 'viewStateApi') return;

                    let stateChanges = ___default["default"].reduce(model.changes, (memo, value, key) => {
                        if (isModelStateKey(key)) {
                            memo[key] = value;
                        }
                        return memo;
                    }, {});

                    if (___default["default"].size(stateChanges)) {
                        view.triggerMethod('state', stateChanges);
                    }
                }
            });
            view.listenTo(view.model, eventsHash);
        }

    }

    /*

    view's options:
    {
        modelStateKeys: ['property1', 'property2', .... ], // will provide values of those properties as part of view state 
    }

    */

    const viewStateApi = {

        value: stateValue,

        // state(view) returns state object
        // state(view, key) return state key value
        // state(view, key, value) sets state key value
        // state(view, keyValues) sets state values by given keyValues hash
        state(view, key, value) {

            if (!view) {
                throw new Error('first argument must be a stateful object');
            }

            if (arguments.length === 1) {
                return getState(view);
            } 

            if (!isValue(key)) {
                throw new Error('second argument must be an object or a state key name')
            }

            if (typeof key === 'object') {
                return setState(view, key);
            }

            if (arguments.length === 2) {
                return getStateValue(view, key);
            }

            return setState(view, { [key]:value });
        },

        text: textValue,

        texts(view, keys, joinChar) {
            if (!keys || !Array.isArray(keys)) return joinChar ? '' : emptyArr$1;

            let values = keys.reduce((all, key) => {
                let value = textValue(view, key);
                if (value) {
                    all.push(value);
                }
                return all;
            }, []);

            if (joinChar) {
                values = values.join(joinChar);
            }

            return values;
        },

        init: initializeStateApi
    };

    const emptyArr = [];

    const addValue = (value, hash, context) => {
        value = yaffEntitybuilder.invokeValue(value, true, context);
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
    };

    const addValues = (values = emptyArr, hash, context) => {
        for (let x = 0; x < values.length; x++) {
            addValue(values[x], hash, context);
        }
    };

    const ClassNameMixin = {

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
                this._debouncedUpdateElClassName = ___default["default"].debounce(() => {
                    let css = yaffEntitybuilder.invokeValue(this._className, true, this);
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
    };

    function getOption(entity, optionName, options)
    {
        if (arguments.length < 2 || entity == null) { return; }

        let value;
        if (entity.options && (entity.options[optionName] !== undefined)) {
            value = entity.options[optionName];
        } else {
            value = entity[optionName];
        }


        return invokeOptionValue(value, options, entity);
    }

    const proto = backbone_marionette.View.prototype;



    const CommonMixin = {
        Dom: backbone_marionette.DomApi,
        // used in a view constructor
        _setOptions: proto._setOptions,

        setElement: proto.setElement,
        _isElAttached: proto._isElAttached,

        triggerMethod: proto.triggerMethod,

        isAttached: proto.isAttached,
        isRendered: proto.isRendered,
        isDestroyed: proto.isDestroyed,

        // MODIFIED: allows pass options object to specify behavior for func result
        // options: null | boolean | { invoke: true, invokeArgs: [], invokeContext: object | undefined }, invokeArgs[] is used as passed arguments
        getOption(optionName, options) {
            return getOption(this, optionName, options);
        },

        getOptions(optionNames, options) {
            return optionNames.reduce((memo, optionName) => {
                memo[optionName] = this.getOption(optionName, options);
                return memo;
            }, {});
        },

        hasOption(key, optionsOnly) {
            if (this.options[key] !== undefined) {
                return true;
            }
            if (!optionsOnly) {
                return this[key] !== undefined;
            }
            return false;
        },

        // MODIFIED: accepts invokeOptions for invoking
        mergeOptions(options, keys, invokeOptions) {
            if (!options) { return; }

            invokeOptions = normalizeInvokeOptionValueOptions(invokeOptions);

            ___default["default"].each(keys, (key) => {
                
              const option = invokeOptionValue(options[key], invokeOptions, this);

              if (option !== undefined) {
                this[key] = option;
              }

            });
        },


        //refresh() { },

    };

    const DestroyLifeCycleMixin = {
        supportsDestroyLifecycle: true,
    	destroy() {
    		
    		if (this._isDestroyed || this._isDestroying)
    			return;
    		
    		this._isDestroying = true;
    		
    		this.triggerMethod('before:destroy', this);

            if (this.destroyChildren)
    		    this.destroyChildren();
    		
    		const shouldTriggerDetach = this._isAttached && !this._disableDetachEvents;
    		if (shouldTriggerDetach) {
    			this.triggerMethod('before:detach', this);
    		}

    		this.remove();

    		if (shouldTriggerDetach) {
    			this._isAttached = false;
    			this.triggerMethod('detach', this);
    		}
    		
    		this._isDestroyed = true;
    		
    		this.stopListening();
    		this.triggerMethod('destroy', this);
    		this.off();
    	},
    };

    const ListenToMixin = {
        _initializeListenToMixin() {
            let listen = this.getOption('listen', true);
            if (!listen || typeof listen !== 'object') { return; }
            if (!Array.isArray(listen)) {
                listen = [listen];
            }
            ___default["default"].each(listen, context => {
                let { entity, event, handler, once } = context;
                console.log(':', event, handler);
                if (!entity || !event || !handler) { return; }
                let method = once ? this.listenToOnce : this.listenTo;
                if (typeof handler === 'string' && this[handler]) {
                    handler = this[handler];
                }
                method.call(this, entity, event, handler);
            });
        }
    };

    const RenderLifeCycleMixin = {
        supportsRenderLifecycle: true,	
    	render() {
    		this.triggerMethod('before:render', this);
            if (this.renderTemplate) {
    		    this.renderTemplate();
            }
            if (this.renderChildren) {
    		    this.renderChildren();
            }
    		this._isRendered = true;
    		this.triggerMethod('render', this);
    	},
    };

    const RenderTemplateMixin = {

        renderTemplate() {
            const template = this.getTemplate();
            if (template) {
                //console.log('-template-', template({ cid: 0, value: 0 }));
                this._renderTemplate(template);
            }
        },

        _renderTemplate: backbone_marionette.View.prototype._renderTemplate,

        //defaultTemplate: undefined,

        // MODIFIED: allows pass string as template with lazy initialization;
        // template: func | string | falsy
        getTemplate() {
            if (this._template) {
                return this._template;
            }

            let template = this.getOption('template', false);
            if (template == null) {
                if (!this.defaultTemplate) {
                    return;
                }
                else {
                    template = this.defaultTemplate;
                }
            }

            let type = typeof template;
            if (type === 'function') {
                this._template = template;
                return template;
            }
            else if (type === 'string') {
                this._template = ___default["default"].template(template);
                return this._template;
            }

            return;
        },


        // override for providing some `static` properties to context
        getTemplateContext() {
            return this.getOption('templateContext', true);
        },

        // MODIFIED: this.getOption('templateContext') replaced with this.getTemplateContext()
        // purpose: allow user to implement additional/global templateContext mixins
        mixinTemplateContext(serializedData) {
            const templateContext = this.getTemplateContext();
            if (!templateContext) { return serializedData; }
            if (!serializedData) { return templateContext; }
            return ___default["default"].extend({}, serializedData, templateContext);
        },

        // returns serializeModel or serializeCollection result
        serializeData: backbone_marionette.View.prototype.serializeData,

        serializeModel: backbone_marionette.View.prototype.serializeModel,
        serializeCollection: backbone_marionette.View.prototype.serializeCollection,

        _renderHtml: backbone_marionette.View.prototype._renderHtml,
        attachElContent: backbone_marionette.View.prototype.attachElContent,

    };

    const StateMixin = {

        state(...args) {
            return viewStateApi.state(this, ...args);
        },

        // calling this without argument explicitly enables state listeners
        _initializeStateMixin(stateful) {
            if (arguments.length === 0) {
                stateful = this.getOption('stateful', true) !== false;
            }
            viewStateApi.init(this, stateful);
        },

    };

    const StaticMixin = {
        setDomApi: backbone_marionette.View.setDomApi,
        setRenderer: backbone_marionette.View.setRenderer
    };

    function buildView(arg, context, options, defOptions, defClass)
    {
        if (arg instanceof backbone.View || arg == null)
            return arg;

        arg = yaffEntitybuilder.normalizeBuildOptions(arg, context, context);

        if (arg == null) {
            return;
        }

        let buildOptions = ___default["default"].extend({ class: defClass }, defOptions, arg, options);

        if (!buildOptions.class) {
            throw new Error('class not defined');
        }

        return yaffEntitybuilder.build(buildOptions);

    }

    const ClassOptions$3 = [];

    /**
     * SimpleView is a Marionette View with just template.
     */

    const SimpleView = backbone.View.extend({
    	constructor: function(options) {
            this._setOptions(options, ClassOptions$3);
    		backbone_marionette.monitorViewEvents(this);

    		// StateMixin
    		this._initializeStateMixin();

    		backbone.View.prototype.constructor.apply(this, arguments);

    		// ClassNameMixin
    		this._initializeClassNameMixin();
    		this._initializeListenToMixin();
    	},
    }, StaticMixin);

    ___default["default"].extend(SimpleView.prototype, CommonMixin, RenderLifeCycleMixin, DestroyLifeCycleMixin, RenderTemplateMixin, ClassNameMixin, StateMixin, ListenToMixin);

    const ClassOptions$2 = ['initializeClickHandler','clickAction','canBeEnabled', 'canBeDisabled'];

    const ButtonView = SimpleView.extend({
        
        constructor: function(options) {

            this.mergeOptions(options, ClassOptions$2);

            SimpleView.apply(this, arguments);
            
            ___default["default"].result(this, 'initializeClickHandler');

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
                return  ___default["default"].result(this, property) !== false;
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
            if (___default["default"].result(this, 'canBeDisabled') === false) { return; }
            this._disable();
        },
        _disable() {
            this.state('disabled', true);
            this.$el.prop('disabled', true);
        },

        enable() {
            if (___default["default"].result(this, 'canBeEnabled') === false) { return; }
            this._enable();
        },
        _enable() {
            this.state('disabled', false);
            this.$el.prop('disabled', false);
        },


    });

    class ChildrenViews {
        constructor() {
            this.views = [];
            this._byCid = {};       
        }

        _clean() {
            this.views.length = 0;
            for (let x = 0; x < this.views.length; x ++) {
                this._removeListener(this.views[x]);
            }
            this._byCid = {};
        }

        _toggleListener(view, method) {
            view[method].call(view, 'destroy', this.remove, this);
        }

        _addListener(view) {
            this._toggleListener(view, 'on');
        }
        _removeListener(view) {
            this._toggleListener(view, 'off');
        }

        add(view) {
            this.views.push(view);
            this._byCid[view.cid] = view;
            this._addListener(view);
        }

        remove(view) {
            delete this._byCid[view.cid];
            let index = this.views.indexOf(view);
            if (index > -1) {
                this.views.splice(index, 1);            
            }
            this._removeListener(view);
        }

        set(views) {
            for(let x = 0; x < views.length; x ++) {
                this.add(views[x], x);
            }
        }

        reset(views = []) {
            this._clean();
            if (views.length) {
                this.set(views);
            }
        }
    }

    const ClassOptions$1 = [
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

    console.log(':::', backbone_marionette.View.prototype._setupChildView);

    const HamburgerView = backbone.View.extend({
    	constructor: function(options) {
            this._setOptions(options, ClassOptions$1);
    		backbone_marionette.monitorViewEvents(this);

            // StateMixin
    		this._initializeStateMixin();

            this._children = new ChildrenViews();

    		backbone.View.prototype.constructor.apply(this, arguments);

            this._initializeClassNameMixin();
            this._initializeListenToMixin();
    	},

        delegateEvents: backbone_marionette.View.prototype.delegateEvents,
        _proxyBehaviorViewProperties: backbone_marionette.View.prototype._proxyBehaviorViewProperties,
        _buildEventProxies: backbone_marionette.View.prototype._buildEventProxies,
        normalizeMethods: backbone_marionette.View.prototype.normalizeMethods,
        _getEventPrefix: backbone_marionette.View.prototype._getEventPrefix,
        _getBehaviorEvents: backbone_marionette.View.prototype._getBehaviorEvents,
        _getEvents: backbone_marionette.View.prototype._getEvents,
        _getBehaviorTriggers: backbone_marionette.View.prototype._getBehaviorTriggers,
        _getTriggers: backbone_marionette.View.prototype._getTriggers,
        _childViewEventHandler: backbone_marionette.View.prototype._childViewEventHandler,


        _setupChildView: backbone_marionette.Region.prototype._setupChildView,
        _proxyChildViewEvents: backbone_marionette.View.prototype._proxyChildViewEvents,
        _getBuffer: backbone_marionette.CollectionView.prototype._getBuffer,
        _attachChildren: backbone_marionette.CollectionView.prototype._attachChildren,
        attachHtml: backbone_marionette.CollectionView.prototype.attachHtml,

    }, StaticMixin);

    ___default["default"].extend(HamburgerView.prototype, 
        CommonMixin, RenderLifeCycleMixin, DestroyLifeCycleMixin, RenderTemplateMixin, 
        ClassNameMixin, StateMixin, ListenToMixin, 
        {
            destroyChildren() {
                while(this._children.views.length) {
                    let view = this._children.views.pop();
                    view.destroy();
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

            _getImmediateChildren() {
                return this._children.views;
            }
    });

    const PromiseButtonsView = HamburgerView.extend({

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

            let btn = ___default["default"].extend({
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

            if(!view || ___default["default"].result(view, 'isSeparator')) {
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
                prefix = '';
            }

            let postfix = this.getOption('eventPostfix');
            if (postfix != null) { 
                postfix = ':' + postfix;
            } else {
                postfix = '';
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
            ___default["default"].result(btn, 'disable');
        },

        enable() {
            this.buttonsViews.forEach(button => this._enableButton(button));
        },
        _enableButton(btn) {
            ___default["default"].result(btn, 'enable');
        },
    });

    const SeparatorView = SimpleView.extend({
        template: false,
        baseClassName: 'buttons-separator',
        isSeparator: true,
    });

    const buildSeparator = (thisClassName) => new SeparatorView({ thisClassName });

    HamburgerView.extend({
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

            if(!view || ___default["default"].result(view, 'isSeparator')) {
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
            ___default["default"].result(btn, 'disable');
        },

        enable() {
            this.buttonsViews.forEach(button => this._enableButton(button));
        },
        _enableButton(btn) {
            // if (*TODO: check if button can be enabled) {
            //    let buttonName = btn.getOption('buttonName');
            // }
            ___default["default"].result(btn, 'enable');
        },

    });

    const ModalButtonsView = PromiseButtonsView.extend({
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

    const ModalHeaderContentView = SimpleView.extend({
        attributes: { 'data-role': 'modal-header-content' },
    });

    const ModalBoxView = HamburgerView.extend({
        attributes: { 'data-role': 'modal-box-content' },
        childViewOptions() {
            return {
                modalView: this.getOption('modalView'),
                modalBoxView: this,
            }
        },
        getChildrenViews() {
            return [
                this.getOption('headerView', true),
                this.getOption('contentView', true),
                this.getOption('buttonsView', true)            
            ];
        },
        childViewTriggers:{
            'resolve:modal':'resolve:modal',
            'reject:modal':'reject:modal',
        }

    });

    const ModalCloseButtonView = ButtonView.extend({
        
        attributes: { 'data-role': 'modal-close-button' },
        buildHtml() {
            return '';
        },
        onClick() {
            let modal = this.getOption('modalView');
            modal.trigger('destroy:modal');
            //modal.destroy();
        }
    });


    // export const ModalCloseButtonSchema = { 
    //     class: ModalCloseButtonView,
    //     //onClick: () => modalView.destroy()
    // }

    // export function getModalCloseButtonSchema(ext) {
    //     return Object.assign({}, ModalCloseButtonSchema, ext);
    // }

    const ModalHeaderView = HamburgerView.extend({
        tagName: 'header',
        attributes: { 'data-role': 'modal-header' },
        childViewOptions() {
            return {
                modalView: this.getOption('modalView'),
                modalBoxView: this.getOption('modalBoxView'),
                modalHeaderView: this
            }
        },
        getChildrenViews() {
            
            let headerView = this.getOption('headerView', true);
            let addCloseButton = this.getOption('closeButton', true);
            let views = [ headerView ];
            if (addCloseButton) {
                let modalView = this.getOption('modalView');
                let { closeButtonClassName, closeButtonOptions } = modalView.showOptions;

                let closeButton = ___default["default"].extend({
                    class: ModalCloseButtonView,
                    thisClassName: closeButtonClassName,
                }, closeButtonOptions);

                views.push(closeButton);
            }
            return views;
        }
    });

    const ModalBoxContentView = HamburgerView.extend({
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

    const buttonTexts = {
        resolve: 'ok',
        reject: 'cancel',
        rejectHard: false
    };

    const unset = void 0;

    const showOptions = {
        showAsIs: false,
        catchPromise: true,
        closeButton: true,

        buttonsView: unset,
        headerView: unset,
        header: unset,

        autoDestroyAfter: unset,
        //destroyOnPromiseSettle: true,

        modalClassName: 'mn-modal',
        modalOptions: unset,

        bgClassName: unset,
        
        boxClassName: unset,

        boxContentClassName: unset,
        boxContentOptions: unset,

        headerClassName: unset,
        headerOptions: unset,

        headerContentClassName: unset,
        headerContentOptions: unset,

        contentClassName: unset,
        contentOptions: unset,

        buttonsClassName: unset,
        buttonsOptions: unset,

        closeButtonClassName: unset,
        closeButtonOptions: unset,

    };

    const config = {
        DEBUG: true,
        buttonTexts,
        showOptions
    };

    //import { ousideClickHandlersApi } from "./domEventsApi.js";

    const ModalView = HamburgerView.extend({

        destroyOnPromiseSettle: true,

        attributes: { 'data-role': 'modal' },

        template: `
        <% if(showBg) { %><div data-role="modal-bg"<%= bgClassAttr %>></div><% } %>
        <div data-role="modal-box"<%=boxClassAttr%>></div>
    `,

        templateContext() {
            let { bgClassName, boxClassName } = this.showOptions;

            let bgClassAttr = !bgClassName ? '' : ` class="${bgClassName}"`;
            let boxClassAttr = !boxClassName ? '' : ` class="${boxClassName}"`;

            return {
                showBg: this.getOption('showBg', true),
                bgClassAttr, boxClassAttr
            }
        },
        
        initialize(options) {
            this.mergeOptions(options, ['showOptions']);
            this.initializeOutsideClickHandler();
        },

        initializeOutsideClickHandler() {

            if (this._outsideClickHandler) { return; }

            let destroyOnOutsideClickAllowed = this.getOption('destroyOnOutsideClickAllowed', true);
            if (destroyOnOutsideClickAllowed === false) { return; }
            
            let handler = this._handleOutsideClick.bind(this);
            this.delegate('click', '[data-role="modal-box"]', handler);
            this.delegate('click', '[data-role="modal-bg"]', handler);
            this.delegate('click', handler);
            // ousideClickHandlersApi.add(handler);
            // this.on('destroy', () => ousideClickHandlersApi.remove(handler));

        },

        _handleOutsideClick(event) {

            let isModalItself = event.target == this.el;
            let isModalBox = !isModalItself && event.target === this.$('[data-role="modal-box"]').get(0);
            let isBg = !(isModalItself || isModalBox) 
                && $__default["default"](event.target).closest('[data-role="modal-bg"]').length > 0;

            if (isBg || isModalBox || isModalItself) {
                this.trigger('outside:click');
            }

        },


        /** */

        childViewContainer: '[data-role="modal-box"]',

        childViewOptions() {
            return {
                modalView: this,
            }
        },

        getChildrenViews() {
            let headerView = this.getOption('headerView', true);
            let closeButton = this.getOption('closeButton', true);
            let content = this.getOption('content', true);
            let buttonsView = this.getOption('buttonsView', true);
            
            let { 
                headerClassName, headerOptions, 
                boxContentClassName, boxContentOptions,
                contentClassName, contentOptions  
            } = this.showOptions;

            let boxHeader = headerView || closeButton ? ___default["default"].extend({
                class: ModalHeaderView,
                thisClassName: headerClassName,
                headerView,
                closeButton,
            }, headerOptions) : null;
            
            let contentView = ___default["default"].extend({
                class: ModalBoxContentView,
                thisClassName: contentClassName,
                content,
            }, contentOptions);

            let boxView = ___default["default"].extend({
                class: ModalBoxView,
                thisClassName: boxContentClassName,
                headerView: boxHeader,
                contentView,
                buttonsView,
            }, boxContentOptions);

            {
                console.log('modal box buildOptions', boxView);
            }

            return [boxView];
        },

        setPromiseSettleAction(action, func) {
            this[action + 'Action'] = func;
        },

        childViewTriggers: {
            'resolve:modal':'resolve:modal',
            'reject:modal':'reject:modal',
        }

    });

    function getHeaderView(showOptions) {
        if (showOptions.headerView) {
            return showOptions.headerView;
        }
        if (showOptions.header) {
            let { headerContentClassName, headerContentOptions } = showOptions;
            return ___default["default"].extend({
                    class: ModalHeaderContentView,
                    thisClassName: headerContentClassName,
                    template: showOptions.header.toString()
                }, headerContentOptions);
        }
    }

    function getButtonView(buttonName, showOptions)
    {
        let keyButtonView = buttonName + 'ButtonView';
        let keyButtonText = buttonName + 'ButtonText';
        let keyButtonOptions = buttonName + 'ButtonOptions';

        if (showOptions[keyButtonView]) {
            return showOptions[keyButtonView];
        }

        let buttonText = showOptions[keyButtonText] || config.buttonTexts[buttonName];
        let buttonOptions = showOptions[keyButtonOptions];

        if (!buttonText && !buttonOptions) {
            return;
        }

        console.log('buton', buttonName, buttonText, buttonOptions);

        return Object.assign({
            class: ButtonView,
            buttonName,
            text: buttonText,
            triggerClickEvent: [buttonName, 'after:click']
        }, buttonOptions);

    }

    function getButtonsView(showOptions) {

        if (showOptions.buttonsView) {
            return showOptions.buttonsView;
        } else if (showOptions.buttonsView === false) {
            return;
        }

        let resolveButton = getButtonView('resolve', showOptions);
        let rejectButton = getButtonView('reject', showOptions);
        let rejectHardButton = getButtonView('rejectHard', showOptions);
        let buttonsDefined = resolveButton || rejectButton || rejectHardButton;
        if (!buttonsDefined) { return; }
        let { buttonsClassName, buttonsOptions } = showOptions;
        return ___default["default"].extend({
            class: ModalButtonsView,
            thisClassName: buttonsClassName,
            resolveButton,
            rejectButton,
            rejectHardButton,
        }, buttonsOptions);

    }

    function modalOptionsToBuildOptions(view, buildViewOptions, showOptions) {

        if (showOptions.showAsIs && buildViewOptions) {
            return buildViewOptions;
        }

        let headerView = getHeaderView(showOptions);

        let content = view 
            ? [view]
            : Array.isArray(buildViewOptions)
                ? buildViewOptions
                : [buildViewOptions];

        let buttonsView = getButtonsView(showOptions);

        let { modalClassName, modalOptions } = showOptions;

        let buildOptions = ___default["default"].extend({
            class: ModalView,
            thisClassName: modalClassName,
            showBg: !!showOptions.showBg,
            closeButton: !!showOptions.closeButton,
            headerView,
            content,
            buttonsView,
            showOptions
        }, modalOptions);

        {
            console.log('modal buildOptions:', buildOptions);
        }

        return buildOptions;

        // return {
        //     headerView,
        //     closeButton,
        //     content,
        //     buttonsView,
        //     showBg: bg === true,
        // }

        //return getModalViewSchema(modalSchema);

    }

    function to$El(el) {
        return el instanceof $__default["default"] ? el : $__default["default"](el);
    }

    ___default["default"].extend(backbone_marionette.DomApi, {
        addEventListener(target, type, listener, options) {
            let $el = to$El(target);
            return $el.on(type, listener);
        },
        removeEventListener(target, type, listener, options) {
            let $el = to$El(target);
            return $el.off(type, listener);
        }
    });

    // export default {
    //     getDoc() {
    //         if (!this.$doc)  {
    //             this.$doc = $(document);
    //         }
    //         return this.$doc;
    //     },

    //     getBody() {
    //         if (!this.$body)  {
    //             this.$body = $(document.body);
    //         }
    //         return this.$body;
    //     },

    //     settleEvent($el, event, handler) {
    //         return $el.on(event, handler);
    //     },

    //     removeEvent($el, event, handler) {
    //         return $el.off(event, handler);
    //     },    
    // }

    const destroyerMixin = {
        add(view) {
            let handler = this.handler.bind(view);
            this.settleEvent(handler);
            view.on('destroy', () => this.removeEvent(handler));
        },
        settleEvent(handler) {
            backbone_marionette.DomApi.addEventListener(this.getEl(), this.event, handler);
        },
        removeEvent(handler) {
            backbone_marionette.DomApi.removeEventListener(this.getEl(), this.event, handler);
        }
    };

    const escapeDestroyer = {
        event: 'keyup',
        getEl: () => document,
        handler(event) {
            if (event.which !== 27 || !stack.isLast(this)) { return; }
            event.stopPropagation();
            this.destroy();
        },
        ...destroyerMixin
    };

    const outsideClickDestroyer = {
        event: 'click',
        getEl: () => document,

        handler(event) {

            
            if (!stack.isLast(this)) { return; }

            let inside = (this.el === event.target || $__default["default"].contains(this.el, event.target));
            if (inside) { return; }

            event.stopPropagation();
            this.destroy();
            
        },

        insideHandler() {
            if (!stack.isLast(this)) { return; }
            this.destroy();
        },

        ...destroyerMixin
    };

    const stack = {

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
            return view === ___default["default"].last(this.modals);
        },

        remove(view) {
            let index = this.modals.indexOf(view);
            if (index == -1) return;
            this.modals.splice(index, 1);
        }
    };

    function getModalView(modalOptions, showOptions) {
        if (!modalOptions) return;

        let contentView;
        let buildContentViewOptions;

        if (modalOptions instanceof backbone.View) {
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
        console.log('?', destroyOnPromiseSettle);
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
        if (attachTo) { return yaffEntitybuilder.invokeValue(attachTo); }
        return invokeProperty(modalsApi, 'attachTo');
    }



    function normalizeShowOptions(arg) {
        if (arg === true) {
            return Object.assign({}, config.showOptions, { showAsIs: true });
        }
        return ___default["default"].extend({}, config.showOptions, arg);
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
    };

    // import { createPopper } from '@popperjs/core';

    // if (!createPopper) {
    //     console.warn('you are going to use @popperjs/core functionality but this lib is not installed. You should install it.');
    // }
    let createPopper;

    const popperApi = {
        create() {
            console.log(typeof createPopper);
        }
    };

    const ClassOptions = ['property', 'ifEmpty', 'displayValue'];


    /**
     * ModelPropertyView is a Marionette View for defined model property. supports optional template.
     */


    const ModelPropertyView = backbone.View.extend({
    	constructor: function(options) {
            this._setOptions(options, ClassOptions);
    		backbone_marionette.monitorViewEvents(this);

    		// StateMixin
    		this._initializeStateApi();
            
    		backbone.View.prototype.constructor.apply(this, arguments);
            this._setupModelListener();
    	},
    }, StaticMixin);

    ___default["default"].extend(ModelPropertyView.prototype, CommonMixin, RenderLifeCycleMixin, DestroyLifeCycleMixin, RenderTemplateMixin, ClassNameMixin, StateMixin, {
        defaultTemplate: '<%= value %>',

        getPropertyValue() {
            return this.model.get(this.property);
        },

        getDisplayValue() {
            let value = this.getPropertyValue();
            if (this.displayValue) {
                return this.displayValue(value, this.ifEmpty);
            }
            if (this.ifEmpty == null) {
                return value;
            }
            else {
                let hasValue = value != null && value !== '';
                return hasValue ? value : this.ifEmpty;
            }
        },

        serializeModel() {
            return {
                value: this.getDisplayValue()
            }
        },

        _setupModelListener() {
            let event = 'change:' + this.property;
            this.listenTo(this.model, event, ___default["default"].debounce(this._updateHtmlValue.bind(this), 0));
        },

        _updateHtmlValue() {
            let $el = this._getValueContainer();
            $el.html(this.getDisplayValue());
        },

        _getValueContainer() {
            let selector = this.getOption('valueSelector', true);
            if (selector) {
                return this.$(selector);
            } else {
                return this.$el;
            }
        },

    });

    Object.defineProperty(exports, 'invokeValue', {
        enumerable: true,
        get: function () { return yaffEntitybuilder.invokeValue; }
    });
    exports.ButtonView = ButtonView;
    exports.ClassNameMixin = ClassNameMixin;
    exports.CommonMixin = CommonMixin;
    exports.DestroyLifeCycleMixin = DestroyLifeCycleMixin;
    exports.HamburgerView = HamburgerView;
    exports.ListenToMixin = ListenToMixin;
    exports.ModelPropertyView = ModelPropertyView;
    exports.RenderLifeCycleMixin = RenderLifeCycleMixin;
    exports.RenderTemplateMixin = RenderTemplateMixin;
    exports.SimpleView = SimpleView;
    exports.StateMixin = StateMixin;
    exports.StaticMixin = StaticMixin;
    exports.attachView = attachView;
    exports.destroyView = destroyView;
    exports.modals = modalsApi;
    exports.popper = popperApi;
    exports.renderView = renderView;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
