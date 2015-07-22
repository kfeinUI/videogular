import {VgEvents} from 'com/2fdevs/videogular/events/VgEvents';

import {VgFullscreenAPI} from 'com/2fdevs/videogular/services/vg-fullscreen-api';

export class VgAPI {
    medias:Object = {};

    constructor() {
        VgFullscreenAPI.init();
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
            this.getMediaById(id).media.play();
        }
    }

    pause(id:string) {
        if (!this.validId(id)){
            this.all('pause');
        }
        else {
            this.getMediaById(id).media.pause();
        }
    }

    getState(id:string) {
        var state;

        if (!this.validId(id)) {
            state = this.medias[this.getFirstId()].currentState;
        }
        else {
            state = this.getMediaById(id).currentState;
        }

        return state;
    }

    setVolume(id:string, volume:number=0.5) {
        if (!this.validId(id)){
            this.all('setVolume', volume);
        }
        else {
            this.getMediaById(id).media.volume = volume;
        }
    }

    seekTime(id:string, value:number=0, byPercent:boolean=false) {
        if (!this.validId(id)){
            this.all('seekTime', value, byPercent);
        }
        else {
            var second;
            if (byPercent) {
                second = value * this.getMediaById(id).media.duration / 100;
                // TODO: Not working unit on-media-ready is available
            }
            else {
                second = value;
            }

            this.getMediaById(id).media.currentTime = second;
        }
    }

    all(...args) {
        var copy:Array<Object> = [].slice.call(args);
        for(var id in this.medias){
            copy[0] = id;
            this[args[0]].apply(this, copy);
        }
    }

    getFirstId() {
        for (var item in this.medias) {
            return item;
        }
    }

    registerElement(elem:HTMLElement) {
        this.videogularElement = elem;
    }

    registerMedia(media:HTMLVideoElement|HTMLAudioElement) {
        this.medias[media.id] = {
            media: media,
            volume: 1,
            currentTime: 0,
            currentState: 'stop'
        };

        this.connect(media);
    }

    toggleFullscreen() {
        if (VgFullscreenAPI.isFullscreen()) {
            VgFullscreenAPI.exit();
        }
        else {
            VgFullscreenAPI.request(this.videogularElement);
        }
    }

    isFullscreen() {
        return VgFullscreenAPI.isFullscreen();
    }

    connect(media:HTMLVideoElement|HTMLAudioElement) {
        media.addEventListener(VgEvents.VG_CAN_PLAY, this.onCanPlay.bind(this, media.id), false);
        media.addEventListener(VgEvents.VG_CAN_PLAY_THROUGH, this.onCanPlayThrough.bind(this, media.id), false);
        media.addEventListener(VgEvents.VG_LOADED_METADATA, this.onLoadMetadata.bind(this, media.id), false);
        media.addEventListener(VgEvents.VG_WAITING, this.onWait.bind(this, media.id), false);
        media.addEventListener(VgEvents.VG_ENDED, this.onComplete.bind(this, media.id), false);
        media.addEventListener(VgEvents.VG_PLAYING, this.onStartPlaying.bind(this, media.id), false);
        media.addEventListener(VgEvents.VG_PLAY, this.onPlay.bind(this, media.id), false);
        media.addEventListener(VgEvents.VG_PAUSE, this.onPause.bind(this, media.id), false);
        media.addEventListener(VgEvents.VG_TIME_UPDATE, this.onTimeUpdate.bind(this, media.id), false);
        media.addEventListener(VgEvents.VG_VOLUME_CHANGE, this.onVolumeChange.bind(this, media.id), false);
        media.addEventListener(VgEvents.VG_ERROR, this.onError.bind(this, media.id), false);
    }

    onCanPlay(id:string) {
        this.medias[id].canPlay = true;
    }

    onCanPlayThrough(id:string) {
        this.medias[id].canPlayThrough = true;
    }

    onLoadMetadata(id:string) {
        this.medias[id].isMetadataLoaded = true;
    }

    onWait(id:string) {
        this.medias[id].isWaiting = true;
    }

    onComplete(id:string) {
        this.medias[id].isCompleted = true;
        this.medias[id].currentState = 'stop';
    }

    onStartPlaying(id:string) {
        this.medias[id].currentState = 'play';
    }

    onPlay(id:string) {
        this.medias[id].currentState = 'play';
    }

    onPause(id:string) {
        this.medias[id].currentState = 'pause';
    }

    onTimeUpdate(id:string) {
        this.medias[id].currentTime = this.medias[id].media.currentTime;
    }

    onVolumeChange(id:string) {
        this.medias[id].volume = this.medias[id].media.volume;
    }

    onError(id:string) {
        console.log('error');
    }
}
