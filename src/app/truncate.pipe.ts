import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'truncate'
})
export class TruncateStringPipe implements PipeTransform {
    transform(value: any, limit?: number): any {
        limit ? limit : 20;
        if (value !== null && value) {
            return `${value.slice(0, limit)}${value.length < 10 ? '' : '...'}`;
        } else {
            return value;
        }
    }
}