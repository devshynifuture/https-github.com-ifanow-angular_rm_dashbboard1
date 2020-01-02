import {ValidatorType} from '../../services/util.service';
import {Directive, ElementRef, HostListener, Input, Renderer2} from '@angular/core';

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

  @Input() validatorType: RegExp = ValidatorType.ALPHA_NUMERIC_WITH_SPACE;

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
        initialValue = initialValue.replace(this.validatorType, '');
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



