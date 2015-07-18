import {Component, View, ElementRef} from 'angular2/angular2';

import {VgAPI} from 'com/2fdevs/videogular/services/vg-api';

@Component({
    selector: 'vg-overlay-play'
})
@View({
    templateUrl: 'com/2fdevs/videogular/plugins/vg-overlay-play/vg-overlay-play.html'
})
export class VgOverlayPlay {
    elem:HTMLElement;

    constructor(public API:VgAPI) {

    }

    onClick() {
        this.API.play();
    }
}
