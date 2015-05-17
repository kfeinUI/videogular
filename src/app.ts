/// <reference path="../typings/angular2/angular2.d.ts" />

import {Component, View, For, bootstrap} from 'angular2/angular2';
import {VgPlayer} from 'com/2fdevs/videogular/components/vg-player/vg-player';
import {VgOverlayPlay} from 'com/2fdevs/videogular/plugins/vg-overlay-play/vg-overlay-play';

@Component({
    selector: 'my-app'
})
@View({
    templateUrl: 'app.html',
    directives: [VgPlayer, VgOverlayPlay, For]
})
class MyAppComponent {
    sources:Array<Object>;
    player:VgPlayer;
    controls:boolean = true;
    autoplay:boolean = false;
    loop:boolean = false;
    preload:string = 'auto';

    constructor() {
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

        this.player = document.querySelector("vg-player");
        console.log(this.player);
    }

    onClickLayer() {
        console.log("click layer");
    }

    onPlayerReady(API) {
        console.log("player ready");
        console.log(API);

        API.play();
    }

    onVideoEvent(event) {
        console.log(event.target.id + " --> " + event.type);
    }
}

bootstrap(MyAppComponent);
