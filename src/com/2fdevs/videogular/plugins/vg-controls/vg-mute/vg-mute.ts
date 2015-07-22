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
    currentVolume:number;

    constructor(public API:VgAPI) {
        this.currentVolume = this.API.getVolume();
    }

    onClick() {
        if (this.API.getVolume() > 0) {
            this.currentVolume = this.API.getVolume();
            this.API.setVolume(null, 0);
        }
        else {
            this.API.setVolume(null, this.currentVolume);
        }
    }
}
