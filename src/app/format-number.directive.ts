import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appFormatNumber]'
})
export class FormatNumberDirective implements AfterViewInit {
  @Input() locale = 'en-IN';
  @Input() shouldRoundOff: any = true;

  @Input() set value(value) {

    this.el.nativeElement.innerText = this.formatAndRoundOffNumber(value);

  }
  valueRound: boolean = true;
  @Input() set stockValue(value) {
    this.valueRound = false;
    this.el.nativeElement.innerText = this.formatOfNumber(value);
  }

  constructor(private el: ElementRef) {
  }

  ngAfterViewInit() {
    /* this.el.nativeElement.innerText = */
    if (this.valueRound) {
      this.el.nativeElement.innerText = this.formatAndRoundOffNumber(this.el.nativeElement.innerText);
    }
  }

  formatAndRoundOffNumber(text) {

    if (typeof (text) === 'string') {
      if (text.includes(',')) {
        return text;
      }
    }
    // if (!this.locale) {
    //   this.locale = 'en-IN';
    // }
    if (text && text !== '') {
      if (!isNaN(text)) {
        let numberValue: number = parseFloat(text);
        switch (this.shouldRoundOff) {
          case true:
            numberValue = Math.round(numberValue);
            break;
          case 'floor':
            numberValue = Math.floor(numberValue);
            break;
        }
        text = numberValue.toLocaleString(this.locale);
      } else {

      }
    } else {
      if (text !== 0) {
        text = '';
      }
    }

    return text;
  }

  formatOfNumber(text) {

    if (typeof (text) === 'string') {
      if (text.includes(',')) {
        return text;
      }
    }
    // if (!this.locale) {
    //   this.locale = 'en-IN';
    // }
    if (text && text !== '') {
      if (!isNaN(text)) {
        let numberValue: number = parseFloat(text);
        switch (this.shouldRoundOff) {
          case true:
            // numberValue = Math.round(numberValue);
            break;
          case 'floor':
            numberValue = Math.floor(numberValue);
            break;
        }
        text = numberValue.toLocaleString(this.locale);
      } else {

      }
    } else {
      if (text !== 0) {
        text = '';
      }
    }

    return text;
  }

}
