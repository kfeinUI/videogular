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

    validId(id:string) {
        return !!id && !!this.medias[id];
    }

    play(id:string) {
        if (!this.validId(id)){
            this.all('play');
        }
        else {
            this.getMediaById(id).play();
        }
    }

    pause(id:string) {
        if (!this.validId(id)){
            this.all('pause');
        }
        else {
            this.getMediaById(id).pause();
        }
    }

    setVolume(id:string, volume:number=0.5) {
        if (!this.validId(id)){
            this.all('setVolume', volume);
        }
        else {
            this.getMediaById(id).volume = volume;
        }
    }

    seekTime(id:string, value:number=0, byPercent:boolean=false) {
        if (!this.validId(id)){
            this.all('seekTime', value, byPercent);
        }
        else {
            var second;
            if (byPercent) {
                second = value * this.getMediaById(id).duration / 100;
                // TODO: Not working unit on-media-ready is available
            }
            else {
                second = value;
            }

            this.getMediaById(id).currentTime = second;
        }
    }

    all(...args) {
        var copy:Array<Object> = [].slice.call(args);
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
        media.addEventListener('loadedmetadata', this.onLoadedMetadata.bind(this));
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

    onLoadedMetadata(event) {
        var allLoaded:boolean = true;
        for(var id in this.medias){
            if(!(this.medias[id].duration > 0)){
                allLoaded = false;
                break;
            }
        }
        if(allLoaded){
            this.onLoadedAllMetadata();
        }
    }

    onLoadedAllMetadata() {
        var event: CustomEvent = new CustomEvent('vgLoadedAllMetadata');
        this.dispatchEvent(event);
    }
}
