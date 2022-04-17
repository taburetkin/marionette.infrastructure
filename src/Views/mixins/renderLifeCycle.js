export const RenderLifeCycleMixin = {
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
}