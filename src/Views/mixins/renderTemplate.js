import { _, MnView } from '../../vendors/index.js';


export const RenderTemplateMixin = {

    renderTemplate() {
        const template = this.getTemplate();
        if (template) {
            //console.log('-template-', template({ cid: 0, value: 0 }));
            this._renderTemplate(template);
        }
    },


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
            this._template = this.buildTemplateFunc(template);
                //_.template(template);
            return this._template;
        }

        return;
    },

    // good place to implement compiled string template cache
    buildTemplateFunc(stringTemplate) {
        return _.template(stringTemplate);
    },

    // override for providing some `static` properties to context
    getTemplateContext() {
        return this.getOption('templateContext', true);
    },

    // MODIFIED: this.getOption('templateContext') replaced with this.getTemplateContext()
    // purpose: allow user to implement additional/global templateContext mixins
    mixinTemplateContext(serializedData) {

        const templateContext = this.getTemplateContext();

        let context;
        if (!templateContext) { 
            context = serializedData; 
        } else if (!serializedData) { 
            context = templateContext; 
        } else {
            context = _.extend({}, serializedData, templateContext); 
        }

        if (this.extendTemplateContext) {
            context = this.extendTemplateContext(context, serializedData);
        }

        return context;
    },

    // returns serializeModel or serializeCollection result
    serializeData: MnView.prototype.serializeData,

    serializeModel: MnView.prototype.serializeModel,
    serializeCollection: MnView.prototype.serializeCollection,

    _renderHtml: MnView.prototype._renderHtml,
    attachElContent: MnView.prototype.attachElContent,
    _renderTemplate: MnView.prototype._renderTemplate,

}