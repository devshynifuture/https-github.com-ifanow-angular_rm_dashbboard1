import {ValidatorType} from '../../services/util.service';
import {Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2} from '@angular/core';

@Directive({
  selector: '[appInputValueValidation]',
  // animations: [
  //   getRightSliderAnimation(this.percentageOpen)
  // ]
})
export class InputValueValidationDirective {

  // @Input() minLength;
  @Input() maxLength;

  @Input() minValue: number;
  @Input() maxValue: number;
  @Output() errorMessage = new EventEmitter<string>();
  @Output() isValid = new EventEmitter<boolean>();
  @Input() validatorType: RegExp = ValidatorType.ALPHA_NUMERIC_WITH_SPACE;

  constructor(
    private _el: ElementRef,
    private renderer: Renderer2) {
  }

  @HostListener('input', ['$event']) onInputChange(event) {
    let initialValue = this._el.nativeElement.value;
    if (this.maxLength && initialValue.length > this.maxLength) {
      this.renderer.setProperty(this._el.nativeElement, 'value', initialValue.slice(0, this.maxLength));
    }
    if (!isNaN(initialValue)) {
      if (this.maxValue && this.maxValue < initialValue) {
        initialValue = this.maxValue;
      } else if (this.minValue && this.minValue > initialValue) {
        initialValue = this.minValue;
      }
    }
    initialValue = initialValue.replace(this.validatorType, '');
    this.renderer.setProperty(this._el.nativeElement, 'value', initialValue);
    // console.log(initialValue);
    if (initialValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}



