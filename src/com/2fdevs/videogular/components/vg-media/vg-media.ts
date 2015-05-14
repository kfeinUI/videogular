/// <reference path="../../../../../../typings/angular2/angular2.d.ts" />

import {Component, View, For} from 'angular2/angular2';

@Component({
    selector: 'vg-media',
    properties: {
        sources: 'vg-src',
        controls: 'vg-native-controls',
        autoplay: 'vg-autoplay',
        loop: 'vg-loop',
        preload: 'vg-preload'
    }
})
@View({
    templateUrl: 'com/2fdevs/videogular/components/vg-media/vg-media.html',
    directives: [For]
})
export class VgMedia {
    sources:Array<Object>;
    controls:boolean = false;
    autoplay:boolean = false;
    loop:boolean = false;
    preload:string = 'auto';

    constructor() {

    }
}
