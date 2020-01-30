import { Directive, HostListener, ElementRef, Renderer2, Input } from '@angular/core';

@Directive({
  selector: '[appCashflowTableEdit]'
})
export class CashflowTableEditDirective {
  @Input() editModeTable;
  editMode: boolean = false;
  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @HostListener('click') editTableTdValue() {
    this.editTableData();
  }

  @HostListener('keydown.enter') editTableTdValueOnEnter() {
    this.editTableData();
  }

  editTableData() {
    this.editMode = !this.editMode;
    if (this.editModeTable) {

      let span1 = this.el.nativeElement.querySelector('span.tableValue');
      let span2 = this.el.nativeElement.querySelector('span.inputValue');

      const input = span2.querySelector('input');

      if (this.editMode) {
        this.renderer.addClass(span1, 'd-none');
        this.renderer.removeClass(span2, 'd-none');
        input.focus();
      } else {
        this.renderer.addClass(span2, 'd-none');
        this.renderer.removeClass(span1, 'd-none');
      }
    }
  }

}
