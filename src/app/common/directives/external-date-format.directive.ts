import { Directive } from '@angular/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';
export const DATE_FORMAT_1 = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Directive({
  selector: '[appExternalDateFormat]',
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: DATE_FORMAT_1},
  ],
})
export class ExternalDateFormatDirective {

  constructor() { }

}
