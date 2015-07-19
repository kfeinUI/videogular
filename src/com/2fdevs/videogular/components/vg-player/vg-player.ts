import {Component, View, bootstrap, EventEmitter, ElementRef} from 'angular2/angular2';

import {VgAPI} from 'com/2fdevs/videogular/services/vg-api';


@Component({
    selector: 'vg-player',
    viewInjector: [VgAPI],
    events: ['onPlayerReady', 'onMediaReady']
})
@View({
    templateUrl: 'com/2fdevs/videogular/components/vg-player/vg-player.html'
})
export class VgPlayer {
    elem:HTMLElement;
    API:VgAPI;

    onPlayerReady:EventEmitter = new EventEmitter();
    onMediaReady:EventEmitter = new EventEmitter();

    constructor(ref:ElementRef, API:VgAPI) {
        this.API = API;
        this.elem = ref.nativeElement;

        var slice:Function = Array.prototype.slice;
        var videos:Array<HTMLVideoElement> = slice.call(this.elem.querySelectorAll("video"));
        var audios:Array<HTMLAudioElement> = slice.call(this.elem.querySelectorAll("audio"));
        var medias:Array<HTMLVideoElement|HTMLAudioElement> = videos.concat(audios);

        for (var i=0, l=medias.length; i<l; i++) {
            this.API.registerMedia(medias[i]);
        }

        setTimeout(() => this.onPlayerReady.next(this.API), 16);
    }

    onVgMediaReady(event) {
        this.onMediaReady.next(this.API);
    }
}
