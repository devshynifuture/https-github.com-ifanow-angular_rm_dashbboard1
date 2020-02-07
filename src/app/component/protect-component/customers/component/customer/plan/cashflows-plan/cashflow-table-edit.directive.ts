import { Directive, HostListener, ElementRef, Renderer2, Input, EventEmitter, Output } from '@angular/core';

@Directive({
  selector: '[appCashflowTableEdit]'
})
export class CashflowTableEditDirective {
  @Input() editModeTable;
  @Output() disableClickOnOtherTd = new EventEmitter();
  editMode: boolean = false;
  constructor(private el: ElementRef, private renderer: Renderer2) { }

  @HostListener('click') editTableTdValue() {
    this.disableClickOnOtherTd.emit(true);
    this.editTableData();
  }

  @HostListener('keydown.enter') editTableTdValueOnEnter() {
    this.editTableData();
  }

  editTableData() {
    this.editMode = !this.editMode;
    if (this.editModeTable) {

      // set click for other tds as false... instead for this 

      let span1 = this.el.nativeElement.querySelector('span.tableValue');
      let span2 = this.el.nativeElement.querySelector('span.inputValue');

      const input = span2.querySelector('input');

      if (this.editMode) {
        // show input hide data
        this.renderer.addClass(span1, 'd-none');
        this.renderer.removeClass(span2, 'd-none');
        input.focus();
      } else {
        // show data hide input
        this.renderer.addClass(span2, 'd-none');
        this.renderer.removeClass(span1, 'd-none');
      }
    }
  }

}
