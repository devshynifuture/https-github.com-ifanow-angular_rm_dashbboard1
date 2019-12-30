import {Injectable} from '@angular/core/src/metadata/*';

@Injectable({
  providedIn: 'root'
})
export class MathUtilService {
  static formatAndRoundOffNumber(text, shouldRoundOff = true, locale = 'en-IN') {
    if (typeof (text) === 'string') {
      if (text.includes(',')) {
        return text;
      }
    }
    // if (!this.locale) {
    //   this.locale = 'en-IN';
    // }
    // console.log('FormatNumberDirective ', this.locale, this.shouldRoundOff);
    if (text && text !== '') {
      if (!isNaN(text)) {
        let numberValue: number = parseFloat(text);
        if (shouldRoundOff) { // true
          numberValue = Math.round(numberValue);
        }
        text = numberValue.toLocaleString(locale);
      }
    } else {
      text = '';
    }
    return text;
  }
}
