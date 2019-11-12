import {Directive, ElementRef, HostListener, Input, Renderer2} from '@angular/core';

@Directive({
  selector: '[appRadioGroupDirective]'
})
export class RadioGroupDirectiveDirective {

  _selected = false;

  // @Input() selected: boolean;

  @Input()
  set appRadioGroupDirective(selected) {
    console.log('RadioGroupDirectiveDirective _selected set : ', this._selected);
    this._selected = selected;
    if (this._selected) {
      this.removeClass('b-a');
      this.addClass('b-a-custom');
      this.addClass('text-primary');
    } else {
      this.removeClass('b-a-custom');
      this.removeClass('text-primary');
      this.addClass('b-a');
    }
    console.log('finalClassName : ', this.elementRef.nativeElement);

    // const finalClassName = this.elementRef.nativeElement.getAttribute('class');
    // console.log('finalClassName : ', finalClassName);
    // this.elementRef.nativeElement.
  }

  get appRadioGroupDirective(): any {
    return this._selected;
  }

  // constructor() { }
  // constructor(private el: ElementRef) {
  // }
  constructor(private renderer: Renderer2, private elementRef: ElementRef) {
  }

  addClass(className: string) {
    // this.elementRef.nativeElement
    this.renderer.addClass(this.elementRef.nativeElement, className);
    // this.renderer.addClass(this.elementRef.nativeElement, className);

  }

  removeClass(className: string) {
    this.renderer.removeClass(this.elementRef.nativeElement, className);
  }

  // @HostListener('change')

}
