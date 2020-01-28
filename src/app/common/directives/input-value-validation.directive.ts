import {ValidatorType} from '../../services/util.service';
import {Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2} from '@angular/core';

/** A hero's name can't match the given regular expression */

/*export function forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const forbidden = nameRe.test(control.value);
    return forbidden ? {forbiddenName: {value: control.value}} : null;
  };
}*/

@Directive({
  selector: '[appInputValueValidation]',
  // providers: [{provide: NG_VALIDATORS, useExisting: InputValueValidationDirective, multi: true}]

  // animations: [
  //   getRightSliderAnimation(this.percentageOpen)
  // ]
})


export class InputValueValidationDirective /*implements Validator*/ {

  get maxValue() {
    return this._maxValue;
  }

  @Input() set maxValue(maxValue) {
    if (maxValue) {
      this._maxValue = parseFloat(String(maxValue));
    } else {
      this._maxValue = null;
    }
  }

  // @Input() minLength;
  @Input() maxLength;
  @Input() minValue: number;
  @Output() changedValue = new EventEmitter();
  _maxValue: number;

  constructor(
    private _el: ElementRef,
    private renderer: Renderer2) {
    _el.nativeElement.oninput = (event) => {
      console.log('InputValueValidationDirective constructor input event : ', event);

      // this.onInputChange(event);
    };
  }

  @Output() errorMessage = new EventEmitter<string>();
  @Output() isValid = new EventEmitter<boolean>();
  // @Input() keyValidator: RegExp = ValidatorType.ALPHA_NUMERIC_WITH_SPACE;
  @Input() inputValidator: RegExp = ValidatorType.ALPHA_NUMERIC_WITH_SPACE;

  private prevValue: string;

  /* validate(control: AbstractControl): { [key: string]: any } | null {
     return this.forbiddenName ? forbiddenNameValidator(new RegExp(this.forbiddenName, 'i'))(control)
       : null;
   }*/

  /* @HostListener('keypress', ['$event']) onKeyPress(event) {

     console.log('InputValueValidationDirective keypress event : ', event);
     console.log('InputValueValidationDirective keypress event.location : ', event.location);
     console.log('InputValueValidationDirective keypress event.key : ', event.key);
     this.prevValue = this._el.nativeElement.value;
     const currValue = event.target.value;
     console.log('InputValueValidationDirective keypress event.target.value : ', currValue);

     if (this.checkCurrentValue(currValue)) {

     } else {
       console.log('InputValueValidationDirective keypress prevValue : ', this.prevValue);
       event.preventDefault();
     }
     console.log('InputValueValidationDirective keypress prevValue : ', this.prevValue);
   }*/

  @HostListener('keypress', ['$event']) onKeyUp(event) {

    console.log('InputValueValidationDirective keypress event : ', event);
    console.log('InputValueValidationDirective keypress event.location : ', event.location);
    console.log('InputValueValidationDirective keypress event.key : ', event.key);
    this.prevValue = this._el.nativeElement.value;
    if (event.target.value) {
      const currValue = event.target.value;
      console.log('InputValueValidationDirective keypress event.target.value : ', currValue);

      if (this.checkCurrentValue(currValue)) {

      } else {
        console.log('InputValueValidationDirective keypress prevValue : ', this.prevValue);
        event.preventDefault();
      }
    }
    console.log('InputValueValidationDirective keypress prevValue : ', this.prevValue);
  }

  @HostListener('input', ['$event'])
  onInputChange(event) {
    console.log('InputValueValidationDirective onInputChange event.target.value : ', event);


    const currValue = event.target.value;
    console.log('InputValueValidationDirective keypress event.target.value : ', currValue);

    if (this.checkCurrentValue(currValue)) {

    } else {
      console.log('InputValueValidationDirective keypress prevValue : ', this.prevValue);
      event.preventDefault();
      this.renderer.setProperty(this._el.nativeElement, 'value', this.prevValue);
      /*  setTimeout(() => {
          console.log('InputValueValidationDirective keypress  setTimeout prevValue : ', this.prevValue);
          this._el.nativeElement.value = this.prevValue;
        }, 100);*/
      this.changedValue.emit(this.prevValue);
    }
    // console.log(event);

  }

  checkCurrentValue(currValue) {
    // const initialCurValue = currValue;
    if (currValue == '') {
      return true;
    }
    if (this.maxLength && currValue.length > this.maxLength) {
      currValue = currValue.slice(0, this.maxLength);
      return false;
      // this.renderer.setProperty(this._el.nativeElement, 'value', currValue.slice(0, this.maxLength));
    }
    if (!isNaN(currValue)) {
      // console.log('InputValueValidationDirective onInputChange isNaN : ', currValue);
      if (this._maxValue && this._maxValue < currValue) {
        console.log('InputValueValidationDirective input this.maxValue  : ', this._maxValue, ' currentValue 1 : ', currValue);
        currValue = this._maxValue;
        return false;
      } else if (this.minValue && this.minValue > currValue) {
        currValue = this.minValue;
        console.log('InputValueValidationDirective input this.minValue  : ', this.minValue, ' currentValue : ', currValue);
        return false;
      }
    }
    if (this.inputValidator.test(currValue)) {
      console.log('InputValueValidationDirective onInputChange inputValidator success : ', currValue);

      return true;
    } else {
      // currValue = currValue.slice(0, 0);
      // currValue = currValue.concat(this.prevValue);
      // currValue = this.prevValue;
      console.log('InputValueValidationDirective onInputChange inputValidator failed : ', currValue);
      return false;
    }
    /*if (currValue !== initalCurValue) {
      console.log('InputValueValidationDirective onInputChange this._el : ', this._el);
      this._el.nativeElement.value = currValue;
      // this._el.nativeElement.focus();
      this.renderer.setProperty(this._el.nativeElement, 'value', currValue);
      this.changedValue.emit(currValue);
    }*/
  }
}



