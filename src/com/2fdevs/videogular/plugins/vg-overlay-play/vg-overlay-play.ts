/// <reference path="../../../../../../typings/angular2/angular2.d.ts" />

import {Component, View, EventEmitter} from 'angular2/angular2';

@Component({
    selector: 'vg-overlay-play',
    events: ['onClickLayer']
})
@View({
    templateUrl: 'com/2fdevs/videogular/plugins/vg-overlay-play/vg-overlay-play.html'
})
export class VgOverlayPlay {
    onClickLayer:EventEmitter = new EventEmitter();

    constructor() {

    }

    onClick() {
        this.onClickLayer.next();
    }
}
