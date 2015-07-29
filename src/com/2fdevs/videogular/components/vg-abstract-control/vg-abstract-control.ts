import {ElementRef} from 'angular2/angular2';

import {VgAPI} from 'com/2fdevs/videogular/services/vg-api';

export class VgAbstractControl {
    elem:HTMLElement;
    target:string;

    constructor(ref:ElementRef, public API:VgAPI) {
        this.elem = ref.nativeElement;

        this.target = this.API.getDefaultMedia();

        if (this.elem.getAttribute('for')) {
            if (this.elem.getAttribute('for') === '*') {
                this.target = this.API;
            }
            else {
                this.target = this.API.getMediaById(this.elem.getAttribute('for'));
            }
        }
    }
}
