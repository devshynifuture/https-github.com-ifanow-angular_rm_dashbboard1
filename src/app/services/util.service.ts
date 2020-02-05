import {Injectable} from '@angular/core';
import {DatePipe, DecimalPipe} from '@angular/common';
import {EventService} from '../Data-service/event.service';
import {HttpClient} from '@angular/common/http';
import {SubscriptionService} from '../component/protect-component/AdviserComponent/Subscriptions/subscription.service';


@Injectable({
  providedIn: 'root'
})
export class UtilService {

  private static decimalPipe = new DecimalPipe('en-US');
  advisorId: any;

  constructor(private eventService: EventService, private http: HttpClient, private subService: SubscriptionService) {
  }
  subscriptionStepData;
  getFamilyMemberData: any;

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
      const object = { selected: false };
      object[keyNameForOutput] = inputObject[key];
      object[keyValueForOutput] = key;

      outputArray.push(object);
    });

    return outputArray;
  }

  static isDialogClose(data) {
    return data && data.state && data.state === 'close';
  }
  setSubscriptionStepData(data) {
    this.subscriptionStepData = data
  }
  checkSubscriptionastepData(stepNo) {
    let tempData;
    tempData = Object.assign([], this.subscriptionStepData)
    tempData = tempData.filter(element => element.stepTypeId == stepNo)
    if (tempData.length != 0) {
      return tempData[0].completed;
    }
  }
  static isRefreshRequired(data) {
    // let closeState = {
    //   "state": data.state,
    //   "refreshRequired": data.refreshRequired
    // }
    return data && data.state && data.state === 'close' && data.refreshRequired;
  }

  static getStartOfTheDay(date: Date) {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  }

  static getEndOfDay(date: Date) {
    date.setHours(23);
    date.setMinutes(59);
    date.setSeconds(59);
    date.setMilliseconds(999);
    return date;

  }

  static convertDateObjectToDateString(datePipe: DatePipe, date: any) {
    return datePipe.transform(date, 'yyyy-MM-dd');
  }

  static checkStatusId(element) {
    element.forEach(obj => {
      if (obj.maturityDate < new Date()) {
        obj.statusId = 'MATURED';
      } else {
        obj.statusId = 'LIVE';
      }
    });
    console.log('Status >>>>>>', element);
  }

  static roundOff(data: number, noOfPlaces: number = 0) {
    // return (Math.round(data * 10 ^ noOfPlaces) / 10 ^ noOfPlaces);
    // console.log(' roundedOffString', this.decimalPipe.transform(data, '9.0-2', null).replace(/,/g, ''));

    return parseFloat(this.decimalPipe.transform(data, '9.0-' + noOfPlaces, null).replace(/,/g, ''));
  }


  totalCalculator(data: number[]) {
    return data.reduce((accumulator, currentValue) => {
      accumulator = accumulator + currentValue;
      return accumulator;
    }, 0);
  }

  formatNumbers(data) {
    return (parseInt(data)).toLocaleString('en-IN');
  }

  formatter(data) {
    return Math.round(data);
  }

  calculateAgeFromCurrentDate(data) {
    data.forEach(element => {
      const bdate = new Date(element.dateOfBirth);
      const timeDiff = Math.abs(Date.now() - bdate.getTime());
      const age = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
      element.age = age;
    });
    this.getFamilyMemberData = data;
    console.log('family Member with age', this.getFamilyMemberData);
    return this.getFamilyMemberData;
  }

  // Allows only numbers
  keyPress(event: any) {
    const pattern = /[0-9\+\-\. ]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  // Allow Only text NOT number and special character
  onlyText(event: any) {
    // const pattern = /[0-9\+\-\. ]/;
    const pattern = new RegExp(/^[a-zA-Z /-]*$/);
    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
    // const k = event.keyCode;
    // return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || (k >= 48 && k <= 57));
  }

  // allows text and number NOT special character
  alphaNumric(event: any) {
    const k = event.keyCode;
    return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || (k >= 48 && k <= 57));
  }

  // used for dateFormat allows numbers and / character
  dateFormat(event: any) {
    let res: string;
    if (this.alphaNumric(event)) {
      res = event.target.value;

      if (((event.keyCode == 47) || (event.keyCode >= 48 && event.keyCode <= 57))) {
        if (event.target.value.length && event.target.value.length !== null) {
          // console.log(event.target.value);
          if (event.target.value.length === 2 || event.target.value === 4) {
            res += '/';
            return res;
          }
        }
      } else {
        return res;
      }
    } else {
      return '';
    }
  }


  htmlToPdf(inputData, pdfName) {
    const obj = {
      htmlInput: inputData,
      name: pdfName
    };
    this.http.post('http://dev.ifanow.in:8080/futurewise/api/v1/web//subscription/html-to-pdf', obj, { responseType: 'blob' }).subscribe(
      data => {
        const file = new Blob([data], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL);
        const a = document.createElement('a');
        a.download = fileURL;
      }
    );
  }
}

export class ValidatorType {

  // static NUMBER_ONLY = new RegExp(/^\d{1,6}(\.\d{1,2})?$/);
  static NUMBER_ONLY = new RegExp(/^\d+(\.\d{0,4})?$/);
  static PERSON_NAME = new RegExp(/^[a-zA-Z]*[a-zA-Z]+[a-zA-Z ]*$/);
  // static PERSON_NAME = new RegExp(/^[a-zA-Z0-9]*[ a-zA-Z]+[a-zA-Z0-9]*$/);/*With Number*/
  static NUMBER_KEY_ONLY = new RegExp(/[^0-9.]+/g);
  static TEXT_ONLY = new RegExp(/^[a-zA-Z ]/);
  static TEXT_WITH_SPACE = new RegExp(/^[a-zA-Z ]/gi);

  static ALPHA_NUMERIC = new RegExp(/^[a-zA-Z0-9/-]*$/);
  static ALPHA_NUMERIC_WITH_SPACE = new RegExp(/^[a-zA-Z0-9 /-]*$/);
  static EMAIL = new RegExp(/^[a-z0-9]+(.[_a-z0-9]+)@[a-z0-9-]+(.[a-z0-9-]+)(.[a-z]{2,15})$/);
  // static EMAIL = new RegExp(/^[a-z0-9!#$%&'*+\=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/);
  // static EMAIL_ONLY = new RegExp(/\b[\w.!#$%&’*+\/=?^`{|}~-]+@[\w-]+(?:\.[\w-]+)*\b/);
  // static EMAIL_ONLY = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
}

// Escape characters that have a special meaning in Regular Expressions
export function escapeRegExp(s: string): string {
  return s.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
}
