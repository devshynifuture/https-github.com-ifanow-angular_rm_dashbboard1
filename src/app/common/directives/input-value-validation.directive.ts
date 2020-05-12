import {ValidatorType} from '../../services/util.service';
import {Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2} from '@angular/core';

@Directive({
  selector: '[appInputValueValidation]',
})


export class InputValueValidationDirective {

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

  @Input() maxLength;
  @Input() minValue: number;
  @Output() changedValue = new EventEmitter();
  _maxValue: number;

  constructor(private _el: ElementRef) {}

  @Output() errorMessage = new EventEmitter<string>();
  @Output() isValid = new EventEmitter<boolean>();
  @Input() inputValidator: RegExp = ValidatorType.ALPHA_NUMERIC_WITH_SPACE;

  private prevValue: string;
  @HostListener('focus') onFocus() {
    this.prevValue = this._el.nativeElement.value;
  }

  @HostListener('input', ['$event']) onInputChange(event) {
    const currValue = event.target.value;
    if (!this.checkCurrentValue(currValue)) {
      event.preventDefault();
      if(this.prevValue) {
        this._el.nativeElement.value = this.prevValue;
        this.changedValue.emit(this.prevValue);
      } else {
        this._el.nativeElement.value = '';
        this.changedValue.emit('');
      }
    }
  }

  checkCurrentValue(currValue) {
    if (currValue == '') {
      return true;
    }
    if (this.maxLength && currValue.length > this.maxLength) {
      currValue = currValue.slice(0, this.maxLength);
      const newVal = currValue.slice(0, this.maxLength);
      this.changedValue.emit(newVal);
      this._el.nativeElement.value = newVal;
      // this.renderer.setProperty(this._el.nativeElement, 'value', currValue.slice(0, this.maxLength));
    }
    if (!isNaN(currValue)) {
      if (this._maxValue && this._maxValue < currValue) {
        currValue = this._maxValue;
        return false;
      } else if (this.minValue && this.minValue > currValue) {
        currValue = this.minValue;
        return false;
      }
    }
    if (this.inputValidator.test(currValue)) {
      return true;
    } else {
      return false;
    }
  }
}



