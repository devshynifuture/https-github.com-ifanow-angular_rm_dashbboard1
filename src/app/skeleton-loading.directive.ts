import {Directive, ElementRef, Input, Renderer2} from '@angular/core';

@Directive({
  selector: '[appSkeletonLoading]'
})
export class SkeletonLoadingDirective {

  isLoading: boolean = false;

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {
  }

  @Input('appSkeletonLoading') set appSkeletonLoading(isLoading) {
    this.isLoading = isLoading;
    if (this.isLoading) {
      this.addClass('skeleton');
    } else {
      this.removeClass('skeleton');
    }
  }

  addClass(className: string) {
    this.renderer.addClass(this.elementRef.nativeElement, className);

  }

  removeClass(className: string) {
    this.renderer.removeClass(this.elementRef.nativeElement, className);
  }

}
