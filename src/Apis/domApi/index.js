import { $, _, DomApi as domApi } from '../../vendors/index.js';

function to$El(el) {
    return el instanceof $ ? el : $(el);
}

function toEl($el) {
    return $el instanceof $ ? $el.get(0) : el;
}

_.extend(domApi, {
    
    destroyEl(el) {
        let $el = to$El(el);
        el = toEl(el);
        $el.off().removeData();
        this.detachEl(el, $el);
    },

    addEventListener(target, type, listener, options) {
        let $el = to$El(target);
        return $el.on(type, listener);
    },
    removeEventListener(target, type, listener, options) {
        let $el = to$El(target);
        return $el.off(type, listener);
    }
});

export { domApi };

// export default {
//     getDoc() {
//         if (!this.$doc)  {
//             this.$doc = $(document);
//         }
//         return this.$doc;
//     },

//     getBody() {
//         if (!this.$body)  {
//             this.$body = $(document.body);
//         }
//         return this.$body;
//     },

//     settleEvent($el, event, handler) {
//         return $el.on(event, handler);
//     },

//     removeEvent($el, event, handler) {
//         return $el.off(event, handler);
//     },    
// }