import {Component, View, ElementRef} from 'angular2/angular2';

import {VgAPI} from 'com/2fdevs/videogular/services/vg-api';
import {VgAbstractControl} from 'com/2fdevs/videogular/components/vg-abstract-control/vg-abstract-control';

@Component({
    selector: 'vg-play-pause',
    host: {
        '(click)': 'onClick()'
    }
})
@View({
    templateUrl: 'com/2fdevs/videogular/plugins/vg-controls/vg-play-pause/vg-play-pause.html'
})
export class VgPlayPause extends VgAbstractControl {

    constructor(public ref:ElementRef, public API:VgAPI) {
        super(ref, API);
    }

    getState() {
        var state = this.target.state;
        
        if (this.target.state instanceof Array) {
            state = 'pause';
            for (var i = 0, l = this.target.state.length; i < l; i++){
                if (this.target.state[i].state === 'play'){
                    state = 'play';
                    break;
                }
            }
        }
        return state;
    }

    onClick() {
        var state = this.getState();

        switch (state) {
            case 'play':
                this.target.pause();
                break;

            case 'pause':
                this.target.play();
                break;
        }
    }
}
