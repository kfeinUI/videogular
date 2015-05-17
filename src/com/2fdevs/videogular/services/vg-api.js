/// <reference path="../../../../../typings/angular2/angular2.d.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", 'com/2fdevs/videogular/utils/EventDispatcher'], function (require, exports, EventDispatcher_1) {
    var VgAPI = (function (_super) {
        __extends(VgAPI, _super);
        function VgAPI() {
            _super.call(this);
            this.medias = [];
        }
        VgAPI.prototype.play = function () {
            this.medias[0].play();
        };
        VgAPI.prototype.registerMedia = function (media) {
            this.medias.push(media);
            media.addEventListener("canplay", this.dispatchEvent.bind(this));
            media.addEventListener("canplaythrough", this.dispatchEvent.bind(this));
            media.addEventListener("loadedmetadata", this.dispatchEvent.bind(this));
            media.addEventListener("waiting", this.dispatchEvent.bind(this));
            media.addEventListener("ended", this.dispatchEvent.bind(this));
            media.addEventListener("playing", this.dispatchEvent.bind(this));
            media.addEventListener("play", this.dispatchEvent.bind(this));
            media.addEventListener("pause", this.dispatchEvent.bind(this));
            media.addEventListener("volumechange", this.dispatchEvent.bind(this));
            media.addEventListener("playbackchange", this.dispatchEvent.bind(this));
            media.addEventListener("timeupdate", this.dispatchEvent.bind(this));
            media.addEventListener("error", this.dispatchEvent.bind(this));
        };
        VgAPI.prototype.dispatchEvent = function (event) {
            console.log("dispatch event: " + event.type);
        };
        return VgAPI;
    })(EventDispatcher_1.EventDispatcher);
    exports.VgAPI = VgAPI;
});
//# sourceMappingURL=vg-api.js.map