import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appShowListActions]'
})
export class ShowListActionsDirective {

  constructor() { }
  // @HostListener('mouseenter') showActionsOnList() {
  //   console.log('actions added')
  // }

  // @HostListener('mouseleave') removeActionsFromList() {
  //   console.log('actions removed');
  // }
}
