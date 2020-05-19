// tslint:disable:radix
// tslint:disable:triple-equals

import {ElementRef, Injectable, Input} from '@angular/core';
import {DatePipe, DecimalPipe} from '@angular/common';
import {EventService} from '../Data-service/event.service';
import {HttpClient} from '@angular/common/http';
import {SubscriptionService} from '../component/protect-component/AdviserComponent/Subscriptions/subscription.service';
import {FormGroup} from '@angular/forms';
import {BehaviorSubject} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UtilService {
  @Input()
  public positiveMethod: Function;
  fragmentData: any;

  constructor(
    private eventService: EventService,
    private http: HttpClient,
    private subService: SubscriptionService,
  ) {
  }

  private static decimalPipe = new DecimalPipe('en-US');
  private counter: number = 0;
  public isLoading = false;
  loaderObservable = new BehaviorSubject<boolean>(false);
  isLoadingObservable = this.loaderObservable.asObservable();
  advisorId: any;

  subscriptionStepData;

  static getGenderStringFromGenderId(genderId) {
    if (genderId == 1) {
      return 'Male';
    } else if (genderId == 2) {
      return 'Female';
    } else {
      return 'Other';
    }
  }

  static getTransactionStatusFromStatusId(statusId) {
    if (statusId == 0) {
      return 'Unknown';
    } else if (statusId == 1) {
      return 'Failure';
    } else if (statusId == 2) {
      return 'Pending Authorization';
    } else if (statusId == 3) {
      return 'Otp authorized';
    } else if (statusId == 4) {
      return 'Pending submission to AMC';
    } else if (statusId == 5) {
      return 'Order submitted to AMC';
    } else if (statusId == 6) {
      return 'Order processed';
    } else if (statusId == 7) {
      return 'Transaction rejected';
    } else if (statusId == 8) {
      return 'Success';
    } else {
      return 'Other';
    }
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

  static obfuscateEmail(email: string) {
    let tempMail: string;
    const indexOfAt = email.indexOf('@');
    email = email.replace(/\./g, '');
    let replaceTxt = email.substr(indexOfAt + 1, email.length);
    tempMail = email.replace(replaceTxt, 'X'.repeat(email.length - indexOfAt));
    return tempMail;
  }

  static obfuscateMobile(mobileNo: string) {
    return mobileNo.substr(0, 2) + 'XXXXX' + mobileNo.substr(7, 9);
  }

  setSubscriptionStepData(data) {
    this.subscriptionStepData = data;
  }

  addZeroBeforeNumber(num, padlen, padchar?) {
    var pad_char = typeof padchar !== 'undefined' ? padchar : '0';
    var pad = new Array(1 + padlen).join(pad_char);
    return (pad + num).slice(-pad.length);
  }

  checkSubscriptionastepData(stepNo) {
    let tempData;
    tempData = Object.assign([], this.subscriptionStepData);
    tempData = tempData.filter(element => element.stepTypeId == stepNo);
    if (tempData.length != 0) {
      return tempData[0].completed;
    }
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

  /**
   * Returns a new array of family member object with age key.
   * @param familyList - Array of family objects. Must contain key - dateOfBirth - otherwise it will fail.
   */
  calculateAgeFromCurrentDate(familyList: any[]) {
    return familyList.map(element => {
      const today = new Date();
      const birthDate = new Date(element.dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      element.age = age;
      return element;
    });
  }

  formValidations(whichTable) {
    // console.log("this is formGroup::::::::::", whichTable);
    for (const key in whichTable.controls) {
      if (whichTable.get(key).invalid) {
        whichTable.get(key).markAsTouched();
        return false;
      }
    }
    return (whichTable.valid) ? true : false;
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

  areTwoObjectsSame(a: {}, b: {}): boolean {

    const aProps = Object.getOwnPropertyNames(a);
    const bProps = Object.getOwnPropertyNames(b);

    if (aProps.length != bProps.length) {
      return false;
    }

    for (let i = 0; i < aProps.length; i++) {
      const propName = aProps[i];

      if (a[propName] !== b[propName]) {
        return false;
      }
    }
    return true;
  }

  toUpperCase(formGroup, event) {
    if (event.data == undefined) {
      return;
    }
    formGroup.patchValue(event.target.value.toUpperCase());
  }

  htmlToPdf(inputData, pdfName, fragData) {
    const obj = {
      htmlInput: inputData,
      name: pdfName
    };
    return this.http.post('http://dev.ifanow.in:8080/futurewise/api/v1/web//subscription/html-to-pdf', obj, {responseType: 'blob'}).subscribe(
      data => {
        const file = new Blob([data], {type: 'application/pdf'});
        const fileURL = URL.createObjectURL(file);
        fragData.isSpinner = false;
        window.open(fileURL);
        const a = document.createElement('a');
        a.download = fileURL;
      }
    );
    // return (this.fileURL) ? this.fileURL : null;
  }

  /**
   * Convert base64 image string to proper image file
   * @param dataURI - Base 64 string of image file
   * @returns - png formatted image file with randomized name
   */
  convertB64toImageFile(dataURI) {
    // Naming the image
    const date = new Date().valueOf();
    let text = '';
    const possibleText = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      text += possibleText.charAt(Math.floor(Math.random() * possibleText.length));
    }
    // Replace extension according to your media type
    const imageName = date + '.' + text + '.png';

    // convert base64/URLEncoded data component to raw binary data held in a string
    let byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(dataURI.split(',')[1]);
    } else {
      byteString = unescape(dataURI.split(',')[1]);
    }

    // separate out the mime component
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const imageBlob = new Blob([ia], {type: mimeString});
    return new File([imageBlob], imageName, {type: 'image/png'});
  }

  /**
   * Focuses on the first invalid option
   * @param fg - FormGroup instance of the form you would like to make the focus on
   * @param el - viewchild ElementRef of the form
   */
  focusOnInvalid(fg: FormGroup, el: ElementRef) {
    for (const key of Object.keys(fg.controls)) {
      if (fg.controls[key].invalid) {
        const invalidControl = el.nativeElement.querySelector('[formcontrolname="' + key + '"]');
        invalidControl.focus();
        break;
      }
    }
  }

  isArraySame(array1, array2) {
    if (array1.length === array2.length) {
      if (JSON.stringify(array1) === JSON.stringify(array2)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  isEmptyObj(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
  }

  isObjectPresentInArray(obj, list) {
    for (let i = 0; i < list.length; i++) {
      if (list[i] === obj) {
        return true;
      }
    }
    return false;
  }

  loader(increament: number) {
    if (increament === 0) {
      this.counter = 0;
    }
    this.counter += increament;
    if (this.counter == 0) {
      this.isLoading = false;
      this.loaderObservable.next(false);
    } else {
      this.isLoading = true;
      this.loaderObservable.next(true);
    }
  }
}

export class ValidatorType {

  // static NUMBER_ONLY = new RegExp(/^\d{1,6}(\.\d{1,2})?$/);
  static NUMBER_ONLY = new RegExp(/^\d+(\.\d{0,4})?$/);
  static NUMBER_ONLY_WITH_FOUR_DECIMAL = new RegExp(/^[0-9]+(\.{1}[0-9]{1,4})?$/);
  static NUMBER_ONLY_WITH_FORWARD_SLASH = new RegExp(/^[0-9\.\-\/]+$/);
  static NUMBER_ONLY_WITHOUT_DOT = new RegExp(/^\d+(\\d{0,4})?$/);
  static PERSON_NAME = new RegExp(/^[a-zA-Z]*[a-zA-Z]+[a-zA-Z ]*$/);
  static ALPHA_NUMERIC_PARANTHESIS_DOT_SPACE = new RegExp(/^[\w .,(),-]+$/);
  static NO_SPACE = new RegExp(/^\S*$/);
  // static PERSON_NAME = new RegExp(/^[a-zA-Z0-9]*[ a-zA-Z]+[a-zA-Z0-9]*$/);/*With Number*/
  static NUMBER_KEY_ONLY = new RegExp(/[^0-9.]+/g);
  // static TEXT_ONLY = new RegExp(/^[a-zA-Z ]/);
  static TEXT_ONLY = new RegExp(/^[a-zA-Z ]*$/);
  static TEXT_WITH_SPACE = new RegExp(/^[a-zA-Z ]/gi);
  static LOGIN_PASS_REGEX = new RegExp(/(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%])(?=.{8,})/);
  static ALPHA_NUMERIC = new RegExp(/^[a-zA-Z0-9/-]*$/);
  static COMPULSORY_ALPHA_NUMERIC = new RegExp(/^[a-zA-Z]+[a-zA-Z0-9/-]*$/);
  static ALPHA_NUMERIC_WITH_SPACE = new RegExp(/^[a-zA-Z0-9 /-]*$/);
  static CAPITAL_CASE = new RegExp(/^[ A-Z0-9_@./#&+-]*$/);

  static EMAIL = new RegExp(/^(([A-Za-z0-9]+_+)|([A-Za-z0-9]+\-+)|([A-Za-z0-9]+\.+)|([A-Za-z0-9]+\++))*[A-Za-z0-9]+@((\w+\-+)|(\w+\.))*\w{1,63}\.[a-zA-Z]{2,6}$/);
  static ALPHA_NUMERIC_WITH_SLASH = new RegExp(/^[A-Z0-9//-]+$/);
  static TEN_DIGITS = new RegExp(/^\d{10}$/);
  static PAN = new RegExp(/[A-Za-z]{5}\d{4}[A-Za-z]{1}/);
  static ADHAAR = new RegExp(/^[0-9]{12,}$/);
  static ALPHA_NUMERIC_WITH_SPEC_CHAR = new RegExp(/^[ A-Za-z0-9_@./#&+-]*$/);
  static PASSPORT = new RegExp(/^[A-Z]{1}[0-9]{7}$/);
  // static DRIVING_LICENCE = new RegExp(/^(?[A-Z]{2})(?\d{2})(?\d{4})(?\d{7})$/);
  static VOTER_ID = new RegExp(/^([a-zA-Z]){3}([0-9]){7}?$/);
}

// Escape characters that have a special meaning in Regular Expressions
export function escapeRegExp(s: string): string {
  return s.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
}

/**
 * @description private loader function which tells when all api's have been resolved
 * You will need to add this to the component's providers to make this function private
 */
export class LoaderFunction {
  private counter = 0;
  private isLoading = false;

  public get loading() {
    return this.isLoading;
  }

  public increaseCounter() {
    this.isLoading = true;
    this.counter++;
  }

  public decreaseCounter() {
    this.counter--;
    if (this.counter == 0) {
      this.isLoading = false;
    }
  }


}
