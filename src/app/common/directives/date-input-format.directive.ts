import { ElementRef, Renderer2 } from '@angular/core/src/metadata/*';
import { Directive, HostListener } from '@angular/core';

@Directive({
    selector: '[appDateInputFormat]'
})
export class DateInputFormatDirective {
    res: string = '';
    constructor(private el: ElementRef, private renderer: Renderer2) {}
    @HostListener('input') onKeyPress(){
        let inputVal = this.el.nativeElement.value;

        if(inputVal.length === 4){
            inputVal = inputVal.split("").splice(3, 0, '/').join("");
        }
        if(inputVal.length === 8){
            inputVal = inputVal.split("").splice(3, 0, '/').splice(6, 0, '/').join("");
        }
        console.log(inputVal);
        // this.renderer.setProperty(this.el.nativeElement, 'value', res);
    }
}