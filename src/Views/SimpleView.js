import { CommonMixin } from "./mixins/common.js";
import { DestroyLifeCycleMixin } from "./mixins/destroyLifeCycle.js";
import { RenderLifeCycleMixin } from "./mixins/renderLifeCycle.js";
import { RenderTemplateMixin } from "./mixins/renderTemplate.js";
import { StaticMixin } from "./mixins/static.js";
import { BbView, _, monitorViewEvents } from "../vendors/index.js";
import { ClassNameMixin } from "./mixins/className.js";
import { StateMixin } from "./mixins/state.js";
import { ListenToMixin } from "./mixins/listenTo.js";

const ClassOptions = [];

/**
 * SimpleView is a Marionette View with just template.
 */

const SimpleView = BbView.extend({
	constructor: function(options) {
        this._setOptions(options, ClassOptions);

		monitorViewEvents(this);

		// StateMixin
		this._initializeStateMixin();

		BbView.prototype.constructor.apply(this, arguments);

		// ClassNameMixin
		this._initializeClassNameMixin();
		this._initializeListenToMixin();
	},
}, StaticMixin);

_.extend(SimpleView.prototype, CommonMixin, RenderLifeCycleMixin, DestroyLifeCycleMixin, RenderTemplateMixin, ClassNameMixin, StateMixin, ListenToMixin);

export { SimpleView };