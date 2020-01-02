import { Directive, Input, HostListener, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[NumberOnly]'
})
export class InputValidationDirective {

  @Input() maxLength;
  @Input() case;
  constructor(
    private _el: ElementRef,
    private renderer: Renderer2) { }

  @HostListener('input', ['$event']) onInputChange(event) {
    let initialValue = this._el.nativeElement.value;
    console.log('####',event)
    if (this._el.nativeElement.value.length <= this.maxLength) {
      if (initialValue > 100) {
        initialValue = '100'
      } else {
        initialValue = initialValue.replace(/[^0-9.]+/g, '');
      }
      this.renderer.setProperty(this._el.nativeElement, 'value', initialValue);
      // console.log(initialValue);
      if (initialValue !== this._el.nativeElement.value) {
        event.stopPropagation();
      }
    }
    else {
      this.renderer.setProperty(this._el.nativeElement, 'value', initialValue.slice(0, this.maxLength));
    }
  }
}
@Directive({
  selector: '[Alphanumeric]'
})
export class AlphanumricDirective {

  constructor( private _el: ElementRef,
    private renderer: Renderer2) { }
    @HostListener('input', ['$event']) onInputChange(event) {
      console.log(event)
      let initialValue = this._el.nativeElement.value;
      var k = initialValue;
      initialValue = initialValue.replace(/[^a-z0-9]/gi,''); 
      this.renderer.setProperty(this._el.nativeElement, 'value', initialValue);
    }
}

@Directive({
  selector: '[TextOnly]'
})
export class TextOnlyDirective {
  constructor( private _el: ElementRef,
    private renderer: Renderer2) { }
    @HostListener('input', ['$event']) onInputChange(event) {
      console.log(event)
      let initialValue = this._el.nativeElement.value;
      var k = initialValue;
      initialValue = initialValue.replace(/[^a-z]/gi,''); 
      this.renderer.setProperty(this._el.nativeElement, 'value', initialValue);
    }
}
@Directive({
  selector: '[appFormatter]'
})
export class Formatter {
  constructor( private _el: ElementRef,
    private renderer: Renderer2) { }
    @HostListener('input', ['$event']) onInputChange(event) {
      console.log(event)
      let initialValue = this._el.nativeElement.value;
      return Math.round(initialValue);
    }
}