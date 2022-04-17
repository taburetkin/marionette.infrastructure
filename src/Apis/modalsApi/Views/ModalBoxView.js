import { HamburgerView } from "../../../Views/HamburgerView.js";

export const ModalBoxView = HamburgerView.extend({
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