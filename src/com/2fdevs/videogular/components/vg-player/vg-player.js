/// <reference path="../../../../../../typings/angular2/angular2.d.ts" />
if (typeof __decorate !== "function") __decorate = function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
if (typeof __param !== "function") __param = function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
define(["require", "exports", 'angular2/angular2', 'angular2/di', 'com/2fdevs/videogular/services/vg-api'], function (require, exports, angular2_1, di_1, vg_api_1) {
    var VgPlayer = (function () {
        function VgPlayer(ref, API) {
            this.onPlayerReady = new angular2_1.EventEmitter();
            this.onVideoEvent = new angular2_1.EventEmitter();
            this.API = API;
            this.elem = ref.domElement;
            this.elem.addEventListener('vgPlay', this.onPlay);
            var slice = Array.prototype.slice;
            var videos = slice.call(this.elem.querySelectorAll("video"));
            var audios = slice.call(this.elem.querySelectorAll("audio"));
            var medias = videos.concat(audios);
            for (var i = 0, l = medias.length; i < l; i++) {
                this.API.registerMedia(medias[i]);
            }
            setTimeout(function () {
                this.onPlayerReady.next(this.API);
            }.bind(this), 16);
        }
        VgPlayer.prototype.onPlay = function (event) {
            console.log(event);
        };
        VgPlayer = __decorate([
            angular2_1.Component({
                selector: 'vg-player',
                injectables: [vg_api_1.VgAPI],
                events: ['onPlayerReady', 'onVideoEvent']
            }),
            angular2_1.View({
                templateUrl: 'com/2fdevs/videogular/components/vg-player/vg-player.html'
            }),
            __param(0, di_1.Inject(angular2_1.ElementRef))
        ], VgPlayer);
        return VgPlayer;
    })();
    exports.VgPlayer = VgPlayer;
});
//# sourceMappingURL=vg-player.js.map