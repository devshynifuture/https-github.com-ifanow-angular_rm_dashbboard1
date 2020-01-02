import {Directive, ElementRef, HostListener, Input, Renderer2} from '@angular/core/src/metadata/*';

@Directive({
  selector: '[appInputValueValidation]',
  // animations: [
  //   getRightSliderAnimation(this.percentageOpen)
  // ]
})
export class InputValueValidationDirective {

  @Input() minLength;
  @Input() maxLength;

  @Input() minValue;
  @Input() maxValue;

  @Input() validatorType;

  constructor(
    private _el: ElementRef,
    private renderer: Renderer2) {
  }

  @HostListener('input', ['$event']) onInputChange(event) {
    let initialValue = this._el.nativeElement.value;
    if (this._el.nativeElement.value.length <= this.maxLength) {
      if (initialValue > 100) {
        initialValue = '100';
      } else {
        initialValue = initialValue.replace(/[^0-9.]+/g, '');
      }
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

/*export enum ValidatorType {
  TEXT_ONLY = /[^0-9.]+/g,
  NUMBER_ONLY = /[^0-9.]+/g,
  ALPHA_NUMBERIC = /[^0-9.]+/g,
  TEXT_WITH_SPACE = /[^0-9.]+/g,
  ALPHA_NUMERIC_WITH_SPACE = /[^0-9.]+/g
}*/
