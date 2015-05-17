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
define(["require", "exports", 'angular2/angular2', 'angular2/di'], function (require, exports, angular2_1, di_1) {
    var VgOverlayPlay = (function () {
        function VgOverlayPlay(player, ref) {
            this.onClickLayer = new angular2_1.EventEmitter();
            console.log(player);
            this.elem = ref.domElement;
        }
        VgOverlayPlay.prototype.onClick = function () {
            console.log("on click play");
            var event = new CustomEvent('vgPlay', { bubbles: true, cancelable: true });
            console.log(event);
            this.elem.dispatchEvent(event);
        };
        VgOverlayPlay = __decorate([
            angular2_1.Component({
                selector: 'vg-overlay-play',
                events: ['onClickLayer']
            }),
            angular2_1.View({
                templateUrl: 'com/2fdevs/videogular/plugins/vg-overlay-play/vg-overlay-play.html'
            }),
            __param(0, angular2_1.Parent()),
            __param(1, di_1.Inject(angular2_1.ElementRef))
        ], VgOverlayPlay);
        return VgOverlayPlay;
    })();
    exports.VgOverlayPlay = VgOverlayPlay;
});
//# sourceMappingURL=vg-overlay-play.js.map