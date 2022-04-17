import { HamburgerView } from "../../../Views/HamburgerView.js";
import { ModalCloseButtonView } from './ModalCloseButtonView.js';
import { _ } from '../../../vendors/index.js';

export const ModalHeaderView = HamburgerView.extend({
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

            let closeButton = _.extend({
                class: ModalCloseButtonView,
                thisClassName: closeButtonClassName,
            }, closeButtonOptions);

            views.push(closeButton);
        }
        return views;
    }
});