const buttonTexts = {
    resolve: 'ok',
    reject: false,
    rejectHard: false
}

const unset = void 0;

const showOptions = {

    showAsIs: false,
    catchPromise: true,
    closeButton: true,
    showBg: true,


    buttonsView: unset,
    headerView: unset,
    header: unset,

    autoDestroyAfter: unset,
    //destroyOnPromiseSettle: true,

    modalClassName: 'mi-modal',
    modalOptions: unset,

    bgClassName: unset,
    
    boxClassName: unset,

    boxContentClassName: unset,
    boxContentOptions: unset,

    headerClassName: unset,
    headerOptions: unset,

    headerContentClassName: unset,
    headerContentOptions: unset,

    contentClassName: unset,
    contentOptions: unset,

    buttonsClassName: unset,
    buttonsOptions: unset,

    closeButtonClassName: unset,
    closeButtonOptions: unset,

};

export const config = {
    DEBUG: true,
    buttonTexts,
    showOptions
}