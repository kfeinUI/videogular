/// <reference path="../../../../../../typings/angular2/angular2.d.ts" />

import {Component, View, bootstrap, EventEmitter, ElementRef} from 'angular2/angular2';
import {Inject} from 'angular2/di';

import {VgAPI} from 'com/2fdevs/videogular/services/vg-api';


@Component({
    selector: 'vg-player',
    injectables: [VgAPI],
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

    constructor(@Inject(ElementRef) ref:ElementRef, API:VgAPI) {
        this.API = API;
        this.elem = ref.domElement;

        this.elem.addEventListener('vgPlay', this.onPlay);
        this.API.addEventListener('vgLoadedAllMetadata', this.onVgMediaReady.bind(this));

        var slice:Function = Array.prototype.slice;
        var videos:Array<HTMLAudioElement> = slice.call(this.elem.querySelectorAll("video"));
        var audios:Array<HTMLAudioElement> = slice.call(this.elem.querySelectorAll("audio"));
        var medias:Array<HTMLVideoElement|HTMLAudioElement> = videos.concat(audios);

        for (var i=0, l=medias.length; i<l; i++) {
            this.API.registerMedia(medias[i]);
        }

        setTimeout(function(){
            this.onPlayerReady.next(this.API);
        }.bind(this), 16);
    }

    onPlay(event) {
        console.log(event);
    }

    onVgMediaReady(event) {
        this.onMediaReady.next(this.API);
    }
}
