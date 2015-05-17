/// <reference path="../../../../../../typings/angular2/angular2.d.ts" />

import {Component, View, EventEmitter, Parent, ElementRef} from 'angular2/angular2';
import {Inject} from 'angular2/di';

import {VgPlayer} from 'com/2fdevs/videogular/components/vg-player/vg-player';

@Component({
    selector: 'vg-overlay-play',
    events: ['onClickLayer']
})
@View({
    templateUrl: 'com/2fdevs/videogular/plugins/vg-overlay-play/vg-overlay-play.html'
})
export class VgOverlayPlay {
    elem:HTMLElement;
    onClickLayer:EventEmitter = new EventEmitter();

    constructor(@Parent() player:VgPlayer, @Inject(ElementRef) ref:ElementRef) {
        console.log(player);
        this.elem = ref.domElement;
    }

    onClick() {
        console.log("on click play");
        var event:CustomEvent = new CustomEvent('vgPlay', {bubbles: true, cancelable: true});
        console.log(event);
        this.elem.dispatchEvent(event);
    }
}
