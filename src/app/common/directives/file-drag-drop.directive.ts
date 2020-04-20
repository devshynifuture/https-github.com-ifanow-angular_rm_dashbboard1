import { Directive, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[appFileDragDrop]'
})
export class FileDragDropDirective {
  @Output() fileDropped = new EventEmitter<FileList>();
  constructor() { }
  @HostListener('drop', ['$event'])
  onDrop($event) {
    console.log($event)
    $event.preventDefault();
  }
}
