import {Injectable} from '@angular/core';
import {DatePipe} from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor() {
  }

  static convertObjectToArray(inputObject: object): object[] {
    const outputArray = [];
    Object.keys(inputObject).map(key => {
      outputArray.push({
        name: inputObject[key],
        value: key,
        selected: false
      });
    });

    return outputArray;
  }

  static convertObjectToCustomArray(inputObject: object, keyNameForOutput: string, keyValueForOutput: string): object[] {
    const outputArray = [];
    Object.keys(inputObject).map(key => {
      const object = {selected: false};
      object[keyNameForOutput] = inputObject[key];
      object[keyValueForOutput] = key;

      outputArray.push(object);
    });

    return outputArray;
  }

  static isDialogClose(data) {
    return data && data.state && data.state === 'close';
  }

  static getStartOfTheDay(date: Date) {
    date.setHours(0)
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  }

  static getEndOfDay(date: Date) {
    date.setHours(23)
    date.setMinutes(59);
    date.setSeconds(59);
    date.setMilliseconds(999);
    return date;

  }

  formatter(data) {
    data = Math.round(data);
    return data;
  }

  keyPress(event: any) {
    const pattern = /[0-9\+\-\. ]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  static convertDateObjectToDateString(datePipe: DatePipe, date: Date) {
    return datePipe.transform(date, 'yyyy-MM-dd');
  }
}
