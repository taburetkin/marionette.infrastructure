import { CommonMixin } from "./mixins/common.js";
import { DestroyLifeCycleMixin } from "./mixins/destroyLifeCycle.js";
import { RenderLifeCycleMixin } from "./mixins/renderLifeCycle.js";
import { RenderTemplateMixin } from "./mixins/renderTemplate.js";
import { StaticMixin } from "./mixins/static.js";
import { BbView, _, monitorViewEvents } from "../vendors/index.js";
import { ClassNameMixin } from "./mixins/className.js";
import { StateMixin } from "./mixins/state.js";

const ClassOptions = ['property', 'ifEmpty', 'displayValue'];


/**
 * ModelPropertyView is a Marionette View for defined model property. supports optional template.
 */


const ModelPropertyView = BbView.extend({
	constructor: function(options) {
        this._setOptions(options, ClassOptions);
		monitorViewEvents(this);

		// StateMixin
		this._initializeStateApi();
        
		BbView.prototype.constructor.apply(this, arguments);
        this._setupModelListener();
	},
}, StaticMixin);

_.extend(ModelPropertyView.prototype, CommonMixin, RenderLifeCycleMixin, DestroyLifeCycleMixin, RenderTemplateMixin, ClassNameMixin, StateMixin, {
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
        this.listenTo(this.model, event, _.debounce(this._updateHtmlValue.bind(this), 0));
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

export { ModelPropertyView };