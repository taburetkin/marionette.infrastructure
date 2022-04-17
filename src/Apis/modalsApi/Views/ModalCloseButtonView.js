import { ButtonView } from "../../../Views/ButtonView.js";

export const ModalCloseButtonView = ButtonView.extend({
    
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