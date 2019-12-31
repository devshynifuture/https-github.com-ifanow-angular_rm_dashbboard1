import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appNumberValidation]'
})
export class NumberValidationDirective {
  @Input() maxLength;
  constructor(private _el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this._el.nativeElement.value;
    if (this._el.nativeElement.value.length <= this.maxLength) {
      this._el.nativeElement.value = initalValue.replace(/[^0-9]*/g, '');
      if (initalValue !== this._el.nativeElement.value) {
        event.stopPropagation();
      }
    }
    else {
      this._el.nativeElement.value.split("")[this._el.nativeElement.value.length - 1] = '';

    }
  }
}
