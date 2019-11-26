import { Directive, ElementRef, Input, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[formatNumber]'
})
export class FormatNumberDirective implements AfterViewInit {
  @Input('formatNumber') locale: string;
  @Input('shouldRoundOff') shouldRoundOff: boolean = false;

  constructor(private el: ElementRef) { }

  ngAfterViewInit() {
    if (this.el.nativeElement.innerText && this.el.nativeElement.innerText !== "") {
      let numberValue: number = parseInt(this.el.nativeElement.innerText);
      if (!isNaN(numberValue)) {
        (this.shouldRoundOff) ? numberValue = Math.round(numberValue) : numberValue;

        this.el.nativeElement.innerText = numberValue.toLocaleString(this.locale);
      }
    } else {
      this.el.nativeElement.innerText = '';
    }
  }
}