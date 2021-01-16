
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'namedNumber'
})
export class NamedNumberPipe implements PipeTransform {
  special = ['zeroth', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 'eighteenth', 'nineteenth'];
  deca = ['twent', 'thirt', 'fort', 'fift', 'sixt', 'sevent', 'eight', 'ninet'];
  transform(value: any): any {
    if (value) {
      return this.stringifyNumber(value);
    }
  }

  stringifyNumber(num) {
    if (num < 20) return this.special[num];
    if (num % 10 === 0) return this.deca[Math.floor(num / 10) - 2] + 'ieth';
    return this.deca[Math.floor(num / 10) - 2] + 'y-' + this.special[num % 10];
  }

}