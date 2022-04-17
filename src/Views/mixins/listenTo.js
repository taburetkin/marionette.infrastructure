import { _ } from "../../vendors/index.js";

export const ListenToMixin = {
    _initializeListenToMixin() {
        let listen = this.getOption('listen', true);
        if (!listen || typeof listen !== 'object') { return; }
        if (!Array.isArray(listen)) {
            listen = [listen];
        }
        _.each(listen, context => {
            let { entity, event, handler, once } = context;
            console.log(':', event, handler);
            if (!entity || !event || !handler) { return; }
            let method = once ? this.listenToOnce : this.listenTo;
            if (typeof handler === 'string' && this[handler]) {
                handler = this[handler];
            }
            method.call(this, entity, event, handler);
        });
    }
}