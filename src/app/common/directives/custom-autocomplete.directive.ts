import {Directive, EventEmitter, Output} from '@angular/core';
import {ElementRef, HostListener, Renderer2} from '@angular/core/src/metadata/*';
import {Observable, Subscription} from 'rxjs';
import {debounceTime, startWith} from 'rxjs/operators';

@Directive({
  selector: '[appCustomAutoComplete]'
})
export class CustomAutocompleteDirective {
  bankAccountList: any;
  advisorId: any;
  clientId: any;
  filteredOptions: Observable<any> = new Observable<any>();
  filteredOptionSubscriber: Subscription;
  @Output() changedValue = new EventEmitter();

  constructor(
    private _el: ElementRef,
    private renderer: Renderer2) {
    _el.nativeElement.oninput = (event) => {
      console.log('CustomAutocompleteDirective constructor input event : ', event);
      // this.onInputChange(event);
    };
  }

  @HostListener('input', ['$event'])
  onInputChange(event) {
    if (this.filteredOptionSubscriber) {
      this.filteredOptionSubscriber.unsubscribe();
    }
    this.filteredOptionSubscriber = this.filteredOptions.pipe(
      startWith(''),
      debounceTime(1500)).subscribe((result) => {
      this.changedValue.emit(this._el.nativeElement.value);

    });
    // this._el.nativeElement.value = this.prevValue;
  }

}
