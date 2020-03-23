import { Component, OnInit, Input, Output } from '@angular/core';
import { ImageTransform, ImageCroppedEvent } from 'ngx-image-cropper';
import { EventEmitter } from 'protractor';

@Component({
  selector: 'app-image-cropper',
  templateUrl: './image-cropper.component.html',
  styleUrls: ['./image-cropper.component.scss']
})
export class ImageCropperComponent {

    // currently the library requires the event of file change
    @Input() imageChangedEvent: any = '';
    @Input() imageURL: string = '';
    @Input() maintainAspectRatio:boolean = true;
    @Input() aspectRatio: string = '1:1';
    @Output() croppedImageInBase64: EventEmitter;

    canvasRotation = 0;
    rotation = 0;
    scale = 1;
    transform: ImageTransform = {};

  imageCropped(event: ImageCroppedEvent) {
      this.croppedImageInBase64.emit(event.base64)
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
