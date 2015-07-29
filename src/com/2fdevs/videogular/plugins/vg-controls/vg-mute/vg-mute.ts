import {Component, View, ElementRef} from 'angular2/angular2';

import {VgAPI} from 'com/2fdevs/videogular/services/vg-api';
import {VgAbstractControl} from 'com/2fdevs/videogular/components/vg-abstract-control/vg-abstract-control';

@Component({
    selector: 'vg-mute',
    host: {
        '(click)': 'onClick()'
    }
})
@View({
    templateUrl: 'com/2fdevs/videogular/plugins/vg-controls/vg-mute/vg-mute.html'
})
export class VgMute extends VgAbstractControl {
    currentVolume:number;

    constructor(public ref:ElementRef, public API:VgAPI) {
        super(ref, API);

        this.currentVolume = this.target.volume;
    }

    onClick() {
        if (this.target.volume === 0) {
            this.target.volume = this.currentVolume;
        }
        else {
            this.currentVolume = this.target.volume;
            this.target.volume = 0;
        }
    }
}
