import {VgEvents} from 'com/2fdevs/videogular/events/VgEvents';

import {VgFullscreenAPI} from 'com/2fdevs/videogular/services/vg-fullscreen-api';

export class VgAPI {
    medias:Object = {};

    constructor() {
        VgFullscreenAPI.init();
    }

    getDefaultMedia() {
        for (var item in this.medias) {
            return this.medias[item];
        }
    }

    getMediaById(id:string) {
        return this.medias[id];
    }

    play(id:string) {
        for (var id in this.medias) {
            this.medias[id].play();
        }
    }

    pause(id:string) {
        for (var id in this.medias) {
            this.medias[id].pause();
        }
    }

    get duration() {
        var result = [];

        for (var id in this.medias) {
            result.push({id: id, duration: this.medias[id].duration});
        }

        if (result.length === 1) result = result[0];

        return result;
    }

    set state(newState:string) {
        for (var id in this.medias) {
            this.medias[id].state = newState;
        }
    }

    get state() {
        var result = [];

        for (var id in this.medias) {
            result.push({id: id, state: this.medias[id].state});
        }

        if (result.length === 1) result = result[0];

        return result;
    }

    set volume(volume:number) {
        for (var id in this.medias) {
            this.medias[id].volume = volume;
        }
    }

    get volume() {

    }

    seekTime(value:number = 0, byPercent:boolean = false) {
        for (var id in this.medias) {
            this.$$seek(this.medias[id], value, byPercent);
        }
    }

    $$seek(media:HTMLVideoElement|HTMLAudioElement, value:number = 0, byPercent:boolean = false) {
        var second;

        if (byPercent) {
            second = value * media.duration / 100;
            // TODO: Not working unit on-media-ready is available
        }
        else {
            second = value;
        }

        media.currentTime = second;
    }

    registerElement(elem:HTMLElement) {
        this.videogularElement = elem;
    }

    registerMedia(media:HTMLVideoElement|HTMLAudioElement) {
        media.time = {
            current: 0,
            total: 0,
            left: 0
        };

        media.canPlay = false;
        media.canPlayThrough = false;
        media.isMetadataLoaded = false;
        media.isWaiting = false;
        media.isCompleted = false;
        media.state = 'stop';
        media.seekTime = (value:number=0, byPercent:boolean=false) => {
            this.$$seek(media, value, byPercent);
        };

        this.medias[media.id] = media;

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

        this.medias[id].time.total = this.medias[id].duration * 1000;
    }

    onWait(id:string) {
        this.medias[id].isWaiting = true;
    }

    onComplete(id:string) {
        this.medias[id].isCompleted = true;
        this.medias[id].state = 'stop';
    }

    onStartPlaying(id:string) {
        this.medias[id].state = 'play';
    }

    onPlay(id:string) {
        this.medias[id].state = 'play';
    }

    onPause(id:string) {
        this.medias[id].state = 'pause';
    }

    onTimeUpdate(id:string) {
        this.medias[id].time.current = this.medias[id].currentTime * 1000;
        this.medias[id].time.left = (this.medias[id].duration - this.medias[id].currentTime) * 1000;
    }

    onVolumeChange(id:string) {
        //this.medias[id].volume = this.medias[id].volume;
    }

    onError(id:string) {
        console.log('error');
    }
}
