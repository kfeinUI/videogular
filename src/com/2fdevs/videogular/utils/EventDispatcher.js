define(["require", "exports"], function (require, exports) {
    var EventDispatcher = (function () {
        function EventDispatcher() {
        }
        EventDispatcher.prototype.apply = function (obj) {
            obj.addEventListener = EventDispatcher.prototype.addEventListener;
            obj.hasEventListener = EventDispatcher.prototype.hasEventListener;
            obj.removeEventListener = EventDispatcher.prototype.removeEventListener;
            obj.dispatchEvent = EventDispatcher.prototype.dispatchEvent;
        };
        EventDispatcher.prototype.addEventListener = function (type, listener) {
            if (this._listeners === undefined) {
                this._listeners = {};
            }
            var listeners = this._listeners;
            if (listeners[type] === undefined) {
                listeners[type] = [];
            }
            if (listeners[type].indexOf(listener) === -1) {
                listeners[type].push(listener);
            }
        };
        EventDispatcher.prototype.hasEventListener = function (type, listener) {
            if (this._listeners === undefined) {
                return false;
            }
            var listeners = this._listeners;
            if (listeners[type] !== undefined && listeners[type].indexOf(listener) !== -1) {
                return true;
            }
            return false;
        };
        EventDispatcher.prototype.removeEventListener = function (type, listener) {
            if (this._listeners === undefined)
                return;
            var listeners = this._listeners;
            var listenerArray = listeners[type];
            if (listenerArray !== undefined) {
                var index = listenerArray.indexOf(listener);
                if (index !== -1) {
                    listenerArray.splice(index, 1);
                }
            }
        };
        EventDispatcher.prototype.dispatchEvent = function (event) {
            if (this._listeners === undefined)
                return;
            var listeners = this._listeners;
            var listenerArray = listeners[event.type];
            if (listenerArray !== undefined) {
                event.target = this;
                var array = [];
                var length = listenerArray.length;
                for (var i = 0; i < length; i++) {
                    array[i] = listenerArray[i];
                }
                for (var i = 0; i < length; i++) {
                    array[i].call(this, event);
                }
            }
        };
        return EventDispatcher;
    })();
    exports.EventDispatcher = EventDispatcher;
});
//# sourceMappingURL=EventDispatcher.js.map