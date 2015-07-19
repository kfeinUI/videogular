import {Component, View, ElementRef} from 'angular2/angular2';

import {VgAPI} from 'com/2fdevs/videogular/services/vg-api';

@Component({
    selector: 'vg-play-pause',
    host: {
        '(click)': 'onClick()'
    }
})
@View({
    templateUrl: 'com/2fdevs/videogular/plugins/vg-controls/vg-play-pause/vg-play-pause.html'
})
export class VgPlayPause {
    constructor(public API:VgAPI) {

    }

    onClick() {
        switch (this.API.getState()) {
            case 'play':
                this.API.pause();
                break;

            case 'pause':
            case 'stop':
                this.API.play();
                break;
        }
    }
}
