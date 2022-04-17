export class ChildrenViews {
    constructor() {
        this.views = [];
        this._byCid = {};       
    }

    _clean() {
        this.views.length = 0;
        for (let x = 0; x < this.views.length; x ++) {
            this._removeListener(this.views[x]);
        }
        this._byCid = {};
    }

    _toggleListener(view, method) {
        view[method].call(view, 'destroy', this.remove, this)
    }

    _addListener(view) {
        this._toggleListener(view, 'on');
    }
    _removeListener(view) {
        this._toggleListener(view, 'off');
    }

    add(view) {
        this.views.push(view);
        this._byCid[view.cid] = view;
        this._addListener(view);
    }

    remove(view) {
        delete this._byCid[view.cid];
        let index = this.views.indexOf(view);
        if (index > -1) {
            this.views.splice(index, 1);            
        }
        this._removeListener(view);
    }

    set(views) {
        for(let x = 0; x < views.length; x ++) {
            this.add(views[x], x);
        }
    }

    reset(views = []) {
        this._clean();
        if (views.length) {
            this.set(views);
        }
    }
}