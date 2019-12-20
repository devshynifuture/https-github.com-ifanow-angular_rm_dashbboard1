import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appSkeletonLoading]'
})
export class SkeletonLoadingDirective {

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
  }

  isLoading: boolean = false;

  @Input('appSkeletonLoading') set appSkeletonLoading(isLoading) {
    this.isLoading = isLoading;
    if (this.isLoading) {
      this.addClass('skeletonAnimation');
    } else {
      this.removeClass('skeletonAnimation');
    }
  }

  addClass(className: string) {
    this.renderer.addClass(this.elementRef.nativeElement, className);

  }

  removeClass(className: string) {
    this.renderer.removeClass(this.elementRef.nativeElement, className);
  }

}
