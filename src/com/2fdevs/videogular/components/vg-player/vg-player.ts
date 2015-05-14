/// <reference path="../../../../../../typings/angular2/angular2.d.ts" />

import {Component, View, bootstrap, EventEmitter} from 'angular2/angular2';
import {VgAPI} from 'com/2fdevs/videogular/services/vg-api';

@Component({
    selector: 'vg-player',
    events: ['onPlayerReady','onMediaReady'],
    injectables: [VgAPI]
})
@View({
    templateUrl: 'com/2fdevs/videogular/components/vg-player/vg-player.html'
})
export class VgPlayer {
    API:VgAPI;
    onPlayerReady:EventEmitter = new EventEmitter();
    onMediaReady:EventEmitter = new EventEmitter();

    constructor(API:VgAPI) {
        this.API = API;
        setTimeout(function(){
            this.onPlayerReady.next(this.API);
        }.bind(this), 16);
    }
}
