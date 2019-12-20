import { Directive, ElementRef, Renderer2, Input } from '@angular/core';

@Directive({
  selector: '[appSkeletonLoading]'
})
export class SkeletoneLoadingDirective {


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

  get appSkeletonLoading() {
    return this.isLoading;
  }

  addClass(className: string) {
    this.renderer.addClass(this.elementRef.nativeElement, className);

  }

  removeClass(className: string) {
    this.renderer.removeClass(this.elementRef.nativeElement, className);
  }


}
