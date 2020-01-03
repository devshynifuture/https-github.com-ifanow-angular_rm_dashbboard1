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
        console.log();
        if(inputVal.length === 2 || inputVal.length === 4){
            this.res = inputVal + '/';
        } else {
            this.res = inputVal;
        }

        console.log(this.res);
        // this.renderer.setProperty(this.el.nativeElement, 'value', res);
    }
}