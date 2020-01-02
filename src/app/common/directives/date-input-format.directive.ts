import { Directive, Input } from '@angular/core';

@Directive({
    selector: '[appDateInputFormat]'
})
export class DateInputFormatDirective {
    @Input() _value;
    set value(value){
        this._value = value;
    }
}