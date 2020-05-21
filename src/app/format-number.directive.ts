import {AfterViewInit, Directive, ElementRef, Input} from '@angular/core';

@Directive({
  selector: '[appFormatNumber]'
})
export class FormatNumberDirective implements AfterViewInit {
  @Input() locale = 'en-IN';
  @Input() shouldRoundOff = true;

  @Input() set value(value) {

    this.el.nativeElement.innerText = this.formatAndRoundOffNumber(value);

  }

  constructor(private el: ElementRef) {
  }

  ngAfterViewInit() {
    /* this.el.nativeElement.innerText = */

    this.el.nativeElement.innerText = this.formatAndRoundOffNumber(this.el.nativeElement.innerText);
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
        if (this.shouldRoundOff) { // true
          numberValue = Math.round(numberValue);
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
