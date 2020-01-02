import {Directive, ElementRef, HostListener, Input, Renderer2} from '@angular/core';

@Directive({
  selector: '[appNumberValidation]'
})
export class NumberValidationDirective {
  @Input() maxLength;

  constructor(
    private _el: ElementRef,
    private renderer: Renderer2) {
  }

  @HostListener('input', ['$event']) onInputChange(event) {
    let initialValue = this._el.nativeElement.value;
    if (this._el.nativeElement.value.length <= this.maxLength) {
      initialValue = initialValue.replace(/[^0-9.]+/g, '');
      this.renderer.setProperty(this._el.nativeElement, 'value', initialValue);
      console.log(initialValue);
      if (initialValue !== this._el.nativeElement.value) {
        event.stopPropagation();
      }
    } else {
      this.renderer.setProperty(this._el.nativeElement, 'value', initialValue.slice(0, this.maxLength));
    }
  }
}
