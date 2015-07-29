import {Component, View, ElementRef} from 'angular2/angular2';

import {VgAPI} from 'com/2fdevs/videogular/services/vg-api';
import {VgAbstractControl} from 'com/2fdevs/videogular/components/vg-abstract-control/vg-abstract-control';

@Component({
    selector: 'vg-scrub-bar',
    host: {
        '(mousedown)': 'onMouseDownScrubBar($event)'
    }
})
@View({
    templateUrl: 'com/2fdevs/videogular/plugins/vg-controls/vg-scrub-bar/vg-scrub-bar.html'
})
export class VgScrubBar extends VgAbstractControl {

    constructor(public ref:ElementRef, public API:VgAPI) {
        super(ref, API);
    }

    onMouseDownScrubBar($event) {
        var percentage = $event.offsetX * 100 / this.elem.scrollWidth;

        this.target.seekTime(percentage, true);
    }
}
