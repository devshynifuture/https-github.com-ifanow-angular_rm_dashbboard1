import { Directive, ElementRef, HostListener, Input, Renderer2 } from '@angular/core';
@Directive({
  selector: '[appAlphanumric]'
})
export class AlphanumricDirective {

  constructor( private _el: ElementRef,
    private renderer: Renderer2) { }
    @HostListener('input', ['$event']) onInputChange(event) {
      let initialValue = this._el.nativeElement.value;
      var k = initialValue;
      return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || (k >= 48 && k <= 57));
    }
}
