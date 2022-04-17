import { MnView, _ } from '../../vendors/index.js';
import { domApi } from '../../Apis/domApi/index.js';
import { OptionsMixin } from './options';

const proto = MnView.prototype;



export const CommonMixin = {
    Dom: domApi,

    setElement: proto.setElement,
    _isElAttached: proto._isElAttached,

    triggerMethod: proto.triggerMethod,

    isAttached: proto.isAttached,
    isRendered: proto.isRendered,
    isDestroyed: proto.isDestroyed,


    ...OptionsMixin,

}