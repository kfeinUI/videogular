/// <reference path="../../../../../typings/angular2/angular2.d.ts" />

import {EventDispatcher} from 'com/2fdevs/videogular/utils/EventDispatcher';

export class VgAPI extends EventDispatcher {
    medias:Array<HTMLVideoElement|HTMLAudioElement> = [];

    constructor(){
        super();
    }

    getMediaById(id:string="all") {
        return this.medias[0];
    }

    play(id:string="all") {
        var media = this.getMediaById(id);
        media.play();
    }

    setVolume(id:string="all", volume:number=0.5) {
        var media = this.getMediaById(id);
        media.volume = volume;
    }

    registerMedia(media:HTMLVideoElement|HTMLAudioElement) {
        this.medias.push(media);

        this.connect(media);
    }

    connect(media:HTMLVideoElement|HTMLAudioElement) {
        media.addEventListener("canplay", this.dispatchEvent.bind(this));
        media.addEventListener("canplaythrough", this.dispatchEvent.bind(this));
        media.addEventListener("loadedmetadata", this.dispatchEvent.bind(this));
        media.addEventListener("waiting", this.dispatchEvent.bind(this));
        media.addEventListener("ended", this.dispatchEvent.bind(this));
        media.addEventListener("playing", this.dispatchEvent.bind(this));
        media.addEventListener("play", this.dispatchEvent.bind(this));
        media.addEventListener("pause", this.dispatchEvent.bind(this));
        media.addEventListener("volumechange", this.onVolumeChange.bind(this));
        media.addEventListener("playbackchange", this.dispatchEvent.bind(this));
        media.addEventListener("timeupdate", this.dispatchEvent.bind(this));
        media.addEventListener("error", this.dispatchEvent.bind(this));
    }

    onVolumeChange(event) {
        console.log("Volume change: " + event.type);
    }

    dispatchEvent(event) {
        console.log("dispatch event: " + event.type);
    }
}
