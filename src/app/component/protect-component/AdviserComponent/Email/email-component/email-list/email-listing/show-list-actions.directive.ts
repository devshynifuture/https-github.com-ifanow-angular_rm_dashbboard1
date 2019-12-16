import { Directive, HostListener, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appShowListActions]'
})
export class ShowListActionsDirective {

  constructor(private el: ElementRef,
    private renderer: Renderer2) { }
  @HostListener('mouseenter') showActionsOnList() {
    const lastTd = this.el.nativeElement.querySelector('td.mat-cell:last-of-type')
    const icons = lastTd.querySelector('[data-show="icons"]');
    const date = lastTd.querySelector('[data-show="date"]');

    this.removeClass('d-none', icons);
    this.removeClass('d-block', date);
    this.addClass('d-block', icons);
    this.addClass('d-none', date);
  }


  @HostListener('mouseleave') removeActionsFromList() {
    const lastTd = this.el.nativeElement.querySelector('td.mat-cell:last-of-type')
    const icons = lastTd.querySelector('[data-show="icons"]');
    const date = lastTd.querySelector('[data-show="date"]');

    this.removeClass('d-block', icons);
    this.removeClass('d-none', date);
    this.addClass('d-none', icons);
    this.addClass('d-block', date);
  }

  addClass(className: string, elementRef) {
    this.renderer.addClass(elementRef, className);
  }

  removeClass(className: string, elementRef) {
    this.renderer.removeClass(elementRef, className);
  }
}
