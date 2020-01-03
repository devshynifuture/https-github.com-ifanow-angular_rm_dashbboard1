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
  // @Input() keyValidator: RegExp = ValidatorType.ALPHA_NUMERIC_WITH_SPACE;
  @Input() inputValidator: RegExp = ValidatorType.ALPHA_NUMERIC_WITH_SPACE;

  constructor(
    private _el: ElementRef,
    private renderer: Renderer2) {
  }

  private prevValue: string;

  @HostListener('keypress', ['$event']) onKeyPress(event) {

    // console.log('InputValueValidationDirective keypress event : ', event);
    // console.log('InputValueValidationDirective onInputChange event : ', event);
    // console.log('InputValueValidationDirective onInputChange maxValue : ', this.maxValue);
    // console.log('InputValueValidationDirective onInputChange minValue : ', this.minValue);
    // console.log('event.key ', event);
    // const inputChar = event;
    /* if (!this.keyValidator.test(inputChar)) {
       console.log('event.key keyValidator failed', event.key);
       console.log('event.key keyValidator failed', this.keyValidator);
       event.preventDefault();
     } else {
       this.prevValue = this._el.nativeElement.value;
     }*/
    this.prevValue = this._el.nativeElement.value;

  }

  @HostListener('input', ['$event']) onInputChange(event) {
    let currValue = this._el.nativeElement.value;
    console.log('InputValueValidationDirective input event : ', event);
    console.log('InputValueValidationDirective input currValue : ', currValue);
    console.log('InputValueValidationDirective input this.maxLength : ', this.maxLength);

    if (currValue == '') {
      return;
    }
    if (this.maxLength && currValue.length > this.maxLength) {
      currValue = currValue.slice(0, this.maxLength);
      // this.renderer.setProperty(this._el.nativeElement, 'value', currValue.slice(0, this.maxLength));
    }
    if (!isNaN(currValue)) {
      console.log('InputValueValidationDirective onInputChange isNaN : ', currValue);
      if (this.maxValue && this.maxValue < currValue) {
        currValue = this.maxValue;
      } else if (this.minValue && this.minValue > currValue) {
        currValue = this.minValue;
      }
    }
    if (!this.inputValidator.test(currValue)) {
      console.log('InputValueValidationDirective onInputChange inputValidator failed : ', this.inputValidator);

      console.log('InputValueValidationDirective onInputChange inputValidator failed : ', currValue);
      currValue = this.prevValue;
    }
    if (currValue !== this._el.nativeElement.value) {
      console.log('InputValueValidationDirective onInputChange inputValidator replacing with : ', currValue);

      this.renderer.setProperty(this._el.nativeElement, 'value', currValue);
    }

    /*Validator */
    /*initialValue = initialValue.replace(this.validatorType, '');
    this.renderer.setProperty(this._el.nativeElement, 'value', initialValue);
    // console.log(initialValue);
    if (initialValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }*/
  }
}



