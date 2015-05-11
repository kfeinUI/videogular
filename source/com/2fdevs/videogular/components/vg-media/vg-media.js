/// <reference path="../../../../../../typings/angular2/angular2.d.ts" />
if (typeof __decorate !== "function") __decorate = function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
define(["require", "exports", 'angular2/angular2'], function (require, exports, angular2_1) {
    var VgMedia = (function () {
        function VgMedia() {
            this.controls = false;
            this.autoplay = false;
            this.loop = false;
            this.preload = 'auto';
        }
        VgMedia = __decorate([
            angular2_1.Component({
                selector: 'vg-media',
                properties: {
                    sources: 'vg-src',
                    controls: 'vg-native-controls',
                    autoplay: 'vg-autoplay',
                    loop: 'vg-loop',
                    preload: 'vg-preload'
                }
            }),
            angular2_1.View({
                templateUrl: 'com/2fdevs/videogular/components/vg-media/vg-media.html',
                directives: [angular2_1.For]
            })
        ], VgMedia);
        return VgMedia;
    })();
    exports.VgMedia = VgMedia;
});
//# sourceMappingURL=vg-media.js.map