/// <reference path="../../../../../../typings/angular2/angular2.d.ts" />

import {Component, View, ElementRef} from 'angular2/angular2';
import {Inject} from 'angular2/di';

@Component({
    selector: 'vg-overlay-play'
})
@View({
    templateUrl: 'com/2fdevs/videogular/plugins/vg-overlay-play/vg-overlay-play.html'
})
export class VgOverlayPlay {
    elem:HTMLElement;

    constructor(@Inject(ElementRef) ref:ElementRef) {
        this.elem = ref.domElement;
    }

    onClick() {
        var event:CustomEvent = new CustomEvent('vgPlay', {bubbles: true, cancelable: true});
        this.elem.dispatchEvent(event);
    }
}
