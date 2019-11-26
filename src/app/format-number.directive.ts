import {AfterViewInit, Directive, ElementRef, Input} from '@angular/core';

@Directive({
  selector: '[appFormatNumber]'
})
export class FormatNumberDirective implements AfterViewInit {
  @Input('formatNumber') locale;
  @Input('shouldRoundOff') shouldRoundOff = true;

  @Input() set value(value) {

    // console.log('FormatNumberDirective ', this.locale, this.shouldRoundOff);
    // console.log('this.el.nativeElement.innerText ', this.el.nativeElement.innerText)
    this.el.nativeElement.innerText = this.formatAndRoundOffNumber(value);
  }

  constructor(private el: ElementRef) {
  }

  ngAfterViewInit() {
    /* this.el.nativeElement.innerText = */
    this.formatAndRoundOffNumber(this.el.nativeElement.innerText);
  }

  formatAndRoundOffNumber(text) {
    if (!this.locale) {
      this.locale = 'en-IN';
    }
    // console.log('FormatNumberDirective ', this.locale, this.shouldRoundOff);
    if (text && text !== "") {
      let numberValue: number = parseInt(text);
      if (!isNaN(numberValue)) {
        if (this.shouldRoundOff) {
          numberValue = Math.round(numberValue);
        }
        text = numberValue.toLocaleString(this.locale);
      }
    } else {
      text = '';
    }

    return text;
  }

}
