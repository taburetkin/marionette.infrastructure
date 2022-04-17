import { ButtonView } from "../../Views/ButtonView.js";
import { ModalButtonsView } from "./Views/ModalButtonsView.js";
import { ModalHeaderContentView } from "./Views/ModalHeaderContentView.js";
import { ModalView } from "./Views/ModalView.js";
import { _ } from '../../vendors/index.js';
import { config } from './config.js';

function getHeaderView(showOptions) {
    if (showOptions.headerView) {
        return showOptions.headerView;
    }
    if (showOptions.header) {
        let { headerContentClassName, headerContentOptions } = showOptions;
        return _.extend({
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
    let keyButtonOptions = buttonName + 'ButtonOptions'

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
    return _.extend({
        class: ModalButtonsView,
        thisClassName: buttonsClassName,
        resolveButton,
        rejectButton,
        rejectHardButton,
    }, buttonsOptions);

}

export function modalOptionsToBuildOptions(view, buildViewOptions, showOptions) {

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

    let buildOptions = _.extend({
        class: ModalView,
        thisClassName: modalClassName,
        showBg: !!showOptions.showBg,
        closeButton: !!showOptions.closeButton,
        headerView,
        content,
        buttonsView,
        showOptions
    }, modalOptions);

    if (config.DEBUG) {
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