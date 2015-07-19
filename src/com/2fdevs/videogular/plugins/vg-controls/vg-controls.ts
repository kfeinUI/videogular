import {Component, View, ElementRef} from 'angular2/angular2';

import {VgAPI} from 'com/2fdevs/videogular/services/vg-api';

@Component({
    selector: 'vg-controls'
})
@View({
    templateUrl: 'com/2fdevs/videogular/plugins/vg-controls/vg-controls.html'
})
export class VgControls {
    constructor(public API:VgAPI) {

    }
}
