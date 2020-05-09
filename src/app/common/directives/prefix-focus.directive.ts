import {AfterViewInit, Directive, ElementRef, OnInit} from '@angular/core';

@Directive({
  selector: '[appPrefixFocusDirective]',
})
export class PrefixFocusDirective implements OnInit, AfterViewInit {

  constructor(private el: ElementRef) {
    if (!el.nativeElement.focus) {
      throw new Error('Element does not accept focus.');
    }
  }

  ngOnInit(): void {

    // input.select();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.el.nativeElement.focus(), 0);
  }
}
