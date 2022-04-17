import { detachView } from '../../utils/view.js';

function releaseObjects(arg) {
	if (!arg) { return }

	Object.keys(arg).forEach(key => {
		let propertyValue = arg[key];
		if (!propertyValue) { return; }

		let type = typeof propertyValue;

		if (type === 'object' || type === 'function') {
			delete arg[key];
		}
		
	});

}

export const DestroyLifeCycleMixin = {
    supportsDestroyLifecycle: true,
	destroy() {
		
		if (this._isDestroyed || this._isDestroying)
			return;
		
		this._isDestroying = true;
		
		this.triggerMethod('before:destroy', this);

        if (this.destroyChildren)
		    this.destroyChildren();
		

		detachView(this, true);


		this._isDestroyed = true;
		
		this.triggerMethod('destroy', this);

		this.stopListening();

		delete this.model;
		delete this.collection;
		delete this.options;
		delete this.$el;
		delete this.el;

	},
}