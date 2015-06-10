/// <reference path='../../../../../typings/tsd.d.ts' />

import {EventDispatcher} from 'com/2fdevs/videogular/utils/EventDispatcher';
import {VgEvents} from 'com/2fdevs/videogular/events/VgEvents';

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
        media.addEventListener(VgEvents.VG_CAN_PLAY, this.onEvent.bind(this), false);
        media.addEventListener(VgEvents.VG_CAN_PLAY_THROUGH, this.onEvent.bind(this), false);
        media.addEventListener(VgEvents.VG_LOADED_METADATA, this.onEvent.bind(this), false);
        media.addEventListener(VgEvents.VG_WAITING, this.onEvent.bind(this), false);
        media.addEventListener(VgEvents.VG_ENDED, this.onEvent.bind(this), false);
        media.addEventListener(VgEvents.VG_PLAYING, this.onEvent.bind(this), false);
        media.addEventListener(VgEvents.VG_PLAY, this.onEvent.bind(this), false);
        media.addEventListener(VgEvents.VG_PAUSE, this.onEvent.bind(this), false);
        media.addEventListener(VgEvents.VG_VOLUME_CHANGE, this.onEvent.bind(this), false);
        media.addEventListener(VgEvents.VG_PLAYBACK_CHANGE, this.onEvent.bind(this), false);
        media.addEventListener(VgEvents.VG_TIME_UPDATE, this.onEvent.bind(this), false);
        media.addEventListener(VgEvents.VG_ERROR, this.onEvent.bind(this), false);
    }

    onEvent(event) {
        event.stopPropagation();
        this.dispatchEvent(event);
    }
}
