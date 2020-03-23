import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ImageTransform, ImageCroppedEvent } from 'ngx-image-cropper';

@Component({
    selector: 'app-image-cropper',
    templateUrl: './image-cropper.component.html',
    styleUrls: ['./image-cropper.component.scss']
})
export class ImageCropperComponent {

    // currently the library requires the event of file change
    @Input() imageChangedEvent: any = '';
    @Input() imageURL: string = '';
    @Input() maintainAspectRatio: boolean = true;
    @Input() aspectRatio: number = 1/1;
    @Input() options: any = {
        outputCroppedWidth: 64,
        outputCroppedHeight: 64
    };
    @Output() croppedImage: EventEmitter<any> = new EventEmitter();

    containWithinAspectRatio = false
    constructor() {

    }

    canvasRotation = 0;
    rotation = 0;
    scale = 1;
    transform: ImageTransform = {};

    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage.emit(event.base64)
    }


    resetImage() {
        this.scale = 1;
        this.rotation = 0;
        this.canvasRotation = 0;
        this.transform = {};
    }

    zoomOut() {
        this.scale -= .1;
        this.transform = {
            ...this.transform,
            scale: this.scale
        };
    }

    zoomIn() {
        this.scale += .1;
        this.transform = {
            ...this.transform,
            scale: this.scale
        };
    }
}
