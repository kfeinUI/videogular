/// <reference path='../../../../../typings/angular2/angular2.d.ts' />

import {EventDispatcher} from 'com/2fdevs/videogular/utils/EventDispatcher';

export class VgAPI extends EventDispatcher {
    medias:Object = {};

    constructor(){
        super();
    }

    getMediaById(id:string) {
        return this.medias[id];
    }

    play(id:string) {
        if (!id){
            this.all('play');
        }
        else {
            this.getMediaById(id).play();
        }
    }

    pause(id:string) {
        if (!id){
            this.all('pause');
        }
        else {
            this.getMediaById(id).pause();
        }
    }

    setVolume(id:string, volume:number=0.5) {
        if (!id){
            this.all('setVolume', volume);
        }
        else {
            this.getMediaById(id).volume = volume;
        }
    }

    all(...args) {
        var copy = [].slice.call(args);
        for(var id in this.medias){
            copy[0] = id;
            this[args[0]].apply(this, copy);
        }
    }

    registerMedia(media:HTMLVideoElement|HTMLAudioElement) {
        this.medias[media.id] = media;

        this.connect(media);
    }

    connect(media:HTMLVideoElement|HTMLAudioElement) {
        media.addEventListener('canplay', this.dispatchEvent.bind(this));
        media.addEventListener('canplaythrough', this.dispatchEvent.bind(this));
        media.addEventListener('loadedmetadata', this.dispatchEvent.bind(this));
        media.addEventListener('waiting', this.dispatchEvent.bind(this));
        media.addEventListener('ended', this.dispatchEvent.bind(this));
        media.addEventListener('playing', this.dispatchEvent.bind(this));
        media.addEventListener('play', this.dispatchEvent.bind(this));
        media.addEventListener('pause', this.dispatchEvent.bind(this));
        media.addEventListener('volumechange', this.onVolumeChange.bind(this));
        media.addEventListener('playbackchange', this.dispatchEvent.bind(this));
        media.addEventListener('timeupdate', this.dispatchEvent.bind(this));
        media.addEventListener('error', this.dispatchEvent.bind(this));
    }

    onVolumeChange(event) {
        console.log('Volume change: ' + event.type);
    }

    dispatchEvent(event) {
        console.log('dispatch event: ' + event.type);
    }
}
