import {Component, View, ElementRef} from 'angular2/angular2';

import {VgAPI} from 'com/2fdevs/videogular/services/vg-api';

@Component({
    selector: 'vg-fullscreen',
    host: {
        '(click)': 'onClick()'
    }
})
@View({
    templateUrl: 'com/2fdevs/videogular/plugins/vg-controls/vg-fullscreen/vg-fullscreen.html'
})
export class VgFullscreen {
    constructor(public API:VgAPI) {

    }

    onClick() {
        this.API.toggleFullscreen();
    }
}
