/// <reference path="../typings/angular2/angular2.d.ts" />
if (typeof __decorate !== "function") __decorate = function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
define(["require", "exports", 'angular2/angular2', 'com/2fdevs/videogular/components/vg-player/vg-player', 'com/2fdevs/videogular/components/vg-media/vg-media', 'com/2fdevs/videogular/plugins/vg-overlay-play/vg-overlay-play'], function (require, exports, angular2_1, vg_player_1, vg_media_1, vg_overlay_play_1) {
    var MyAppComponent = (function () {
        function MyAppComponent() {
            this.sources = [
                {
                    src: "http://static.videogular.com/assets/videos/videogular.mp4",
                    type: "video/mp4"
                },
                {
                    src: "http://static.videogular.com/assets/videos/videogular.ogg",
                    type: "video/ogg"
                },
                {
                    src: "http://static.videogular.com/assets/videos/videogular.webm",
                    type: "video/webm"
                }
            ];
        }
        MyAppComponent.prototype.onClickLayer = function () {
            console.log("app");
        };
        MyAppComponent = __decorate([
            angular2_1.Component({
                selector: 'my-app'
            }),
            angular2_1.View({
                templateUrl: 'app.html',
                directives: [vg_player_1.VgPlayer, vg_media_1.VgMedia, vg_overlay_play_1.VgOverlayPlay]
            })
        ], MyAppComponent);
        return MyAppComponent;
    })();
    angular2_1.bootstrap(MyAppComponent);
});
//# sourceMappingURL=app.js.map