import { $, _ } from '../../../vendors/index.js';

import { HamburgerView } from "../../../Views/HamburgerView.js";
import { ModalBoxView } from "./ModalBoxView.js";
import { ModalHeaderView } from "./ModalHeaderView.js";
import { ModalBoxContentView } from "./ModalBoxContentView.js";
import { config } from "../config.js";
//import { ousideClickHandlersApi } from "./domEventsApi.js";

export const ModalView = HamburgerView.extend({

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
            && $(event.target).closest('[data-role="modal-bg"]').length > 0;

        if (isBg || isModalBox || isModalItself) {
            this.trigger('outside:click');
        }

    },



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

        let boxHeader = headerView || closeButton ? _.extend({
            class: ModalHeaderView,
            thisClassName: headerClassName,
            headerView,
            closeButton,
        }, headerOptions) : null;
        
        let contentView = _.extend({
            class: ModalBoxContentView,
            thisClassName: contentClassName,
            content,
        }, contentOptions);

        let boxView = _.extend({
            class: ModalBoxView,
            thisClassName: boxContentClassName,
            headerView: boxHeader,
            contentView,
            buttonsView,
        }, boxContentOptions);

        if (config.DEBUG) {
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

