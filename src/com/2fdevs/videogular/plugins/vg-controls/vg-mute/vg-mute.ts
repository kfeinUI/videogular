import {Component, View, ElementRef} from 'angular2/angular2';

import {VgAPI} from 'com/2fdevs/videogular/services/vg-api';

@Component({
    selector: 'vg-mute',
    host: {
        '(click)': 'onClick()'
    }
})
@View({
    templateUrl: 'com/2fdevs/videogular/plugins/vg-controls/vg-mute/vg-mute.html'
})
export class VgMute {
    constructor(public API:VgAPI) {

    }

    onClick() {

    }
}
