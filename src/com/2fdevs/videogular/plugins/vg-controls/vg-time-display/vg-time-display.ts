import {Component, View, ElementRef} from 'angular2/angular2';

import {VgAPI} from 'com/2fdevs/videogular/services/vg-api';

@Component({
    selector: 'vg-time-display'
})
@View({
    templateUrl: 'com/2fdevs/videogular/plugins/vg-controls/vg-time-display/vg-time-display.html'
})
export class VgTimeDisplay {
    constructor(public API:VgAPI) {

    }
}
