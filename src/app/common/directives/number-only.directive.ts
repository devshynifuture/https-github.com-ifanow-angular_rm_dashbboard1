import {Directive, ElementRef, HostListener, Input, Renderer2} from '@angular/core';

@Directive({
  selector: '[appNumberOnly]'
})
export class NumberOnlyDirective {

  @Input() maxLength;

  // @Input() case;

  constructor(
    private _el: ElementRef,
    private renderer: Renderer2) {
  }

  @HostListener('input', ['$event']) onInputChange(event) {
    let initialValue = this._el.nativeElement.value;

    if (this._el.nativeElement.value.length <= this.maxLength) {
      // console.log('initial value : ', initialValue);
      // if (initialValue > 100) {
      //   initialValue = '100';
      // } else {
      initialValue = initialValue.replace(/[^0-9.]+/g, '');
      // }
      this.renderer.setProperty(this._el.nativeElement, 'value', initialValue);
      // console.log(initialValue);
      if (initialValue !== this._el.nativeElement.value) {
        event.stopPropagation();
      }
    } else {
      this.renderer.setProperty(this._el.nativeElement, 'value', initialValue.slice(0, this.maxLength));
    }
  }
}

@Directive({
  selector: '[appAlphaNumeric]'
})
export class AlphaNumericDirective {

  constructor(private _el: ElementRef,
              private renderer: Renderer2) {
  }

  @HostListener('input', ['$event']) onInputChange(event) {
    console.log(event);
    let initialValue = this._el.nativeElement.value;
    // const k = initialValue;
    initialValue = initialValue.replace(/[^a-z0-9]/gi, '');
    this.renderer.setProperty(this._el.nativeElement, 'value', initialValue);
  }
}

@Directive({
  selector: '[appTextOnly]'
})
export class TextOnlyDirective {
  constructor(private _el: ElementRef,
              private renderer: Renderer2) {
  }

  @HostListener('input', ['$event']) onInputChange(event) {
    console.log(event);
    let initialValue = this._el.nativeElement.value;
    // const k = initialValue;
    initialValue = initialValue.replace(/[^a-z]/gi, '');
    this.renderer.setProperty(this._el.nativeElement, 'value', initialValue);
  }
}

@Directive({
  selector: '[appCodeText]'
})
export class CodeTextDirective {
  constructor(private _el: ElementRef,
              private renderer: Renderer2) {
  }

  @HostListener('input', ['$event']) onInputChange(event) {
    console.log(event);
    let initialValue = this._el.nativeElement.value;
    // const k = initialValue;
    initialValue = initialValue.replace(/[^a-z0-9-/]/gi, '');
    this.renderer.setProperty(this._el.nativeElement, 'value', initialValue);
  }
}

@Directive({
  selector: '[appFormatter]'
})
export class Formatter {
  constructor(private _el: ElementRef,
              private renderer: Renderer2) {
  }

  @HostListener('input', ['$event']) onInputChange(event) {
    console.log(event);
    const initialValue = this._el.nativeElement.value;
    return Math.round(initialValue);
  }
}
