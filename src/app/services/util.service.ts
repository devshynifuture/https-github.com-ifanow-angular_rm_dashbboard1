// tslint:disable:radix
// tslint:disable:triple-equals

import {ElementRef, Injectable, Input, OnDestroy} from '@angular/core';
import {DatePipe, DecimalPipe} from '@angular/common';
import {EventService} from '../Data-service/event.service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {SubscriptionService} from '../component/protect-component/AdviserComponent/Subscriptions/subscription.service';
import {FormGroup} from '@angular/forms';
import {BehaviorSubject, Subject} from 'rxjs';
import {AuthService} from '../auth-service/authService';
import {quotationTemplate} from './quotationTemplate';
import {debounce, debounceTime} from 'rxjs/operators';
import {AppConstants} from './app-constants';


@Injectable({
  providedIn: 'root'
})
export class UtilService {
  responseData: any;
  client: any;

  constructor(
    private eventService: EventService,
    private http: HttpClient,
    private subService: SubscriptionService,
    private datePipe: DatePipe
  ) {
    this.client = AuthService.getClientData();

  }

  private static decimalPipe = new DecimalPipe('en-US');


  @Input()
  public positiveMethod: Function;
  fragmentData: any;
  fileURL: any;
  private counter = 0;
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

  static deleteRow(element, list: any[]) {
    const index: number = list.indexOf(element);
    if (index !== -1) {
      list.splice(index, 1);
    }
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

  static roundOffToNearest1(data: number) {
    return Math.round(data);
  }

  static escapeRegExp(s) {
    return s.replace(/([.*+?^=!:${}()|[\]\/\\])/g, '\\$1');
  }

  static mutualFundRoundAndFormat(data, noOfPlaces: number = 0) {
    if (data) {
      if (isNaN(data)) {
        return data;
      } else {
        return this.roundOff(data, noOfPlaces).toLocaleString('en-IN');
      }
    } else {
      return '0';
    }
  }

  static obfuscateEmail(email: string) {
    let tempMail: string;
    let arr = email.split('@');
    email = email.replace(/\./g, '');
    return this.nameMasking(arr[0]) + '@' + this.domainMasking(arr[1]);
  }

  static nameMasking(str) {
    const midLength = Math.floor(str.length / 2);
    const firstName = str.substr(0, midLength);
    return firstName + 'X'.repeat(midLength + 1);
  }

  static domainMasking(str) {
    return 'x'.repeat(str.indexOf('.')) + str.substr(str.indexOf('.'), str.length - 1);
  }

  static obfuscateMobile(mobileNo: string) {
    return mobileNo.substr(0, 2) + 'XXXXX' + mobileNo.substr(7, 9);
  }

  public static getNumberToWord(numberValue) {
    let strNumber = '';
    if (!numberValue) {
      if (isNaN(numberValue)) {
        return numberValue;
      }
    }
    if (numberValue > 10000000) {
      strNumber = this.mutualFundRoundAndFormat(numberValue / 10000000.0, 2) + ' Crores';
    } else if (numberValue > 100000) {
      strNumber = this.mutualFundRoundAndFormat(numberValue / 100000.0, 2) + ' Lacs';
    } else if (numberValue > 1000) {
      strNumber = this.mutualFundRoundAndFormat(numberValue / 1000.0, 2) + ' K';
    } else {
      strNumber = numberValue.toString();
    }
    return strNumber;

  }

  public static getHttpParam(data) {
    let httpParams = new HttpParams();
    for (const key of Object.keys(data)) {
      httpParams = httpParams.set(key, data[key]);
    }
    return httpParams;
  }

  setSubscriptionStepData(data) {
    this.subscriptionStepData = data;
  }

  addZeroBeforeNumber(num, padlen, padchar?) {
    const pad_char = typeof padchar !== 'undefined' ? padchar : '0';
    const pad = new Array(1 + padlen).join(pad_char);
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
      const birthDate = (element.dateOfBirth) ? new Date(element.dateOfBirth) : new Date();
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


  public replacePlaceholder(inputValue: string, placeHolder) {
    if (!!inputValue) {
      // let regex = $client_name\)/gi;
      inputValue = inputValue.replace(new RegExp(escapeRegExp('$client_name'), 'g'), placeHolder.clientName);
      // regex = /\$\(client_address\)/gi;
      inputValue = inputValue.replace(new RegExp(escapeRegExp('$client_address'), 'g'), placeHolder.clientAddress);
      // inputValue = inputValue.replace(regex, placeHolder.clientAddress);
      // regex = /\$\(advisor_name\)/gi;
      inputValue = inputValue.replace(new RegExp(escapeRegExp('$advisor_name'), 'g'), placeHolder.advisorName);
      // inputValue = inputValue.replace(regex, placeHolder.advisorName);
      // regex = /\$\(advisor_address\)/gi;
      inputValue = inputValue.replace(new RegExp(escapeRegExp('$advisor_address'), 'g'), placeHolder.advisorAddress);
      // inputValue = inputValue.replace(regex, placeHolder.advisorAddress);
      return inputValue;
    }
    return null;
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

  capitalise(event) {
    if (event.target.value != '') {
      event.target.value = event.target.value.replace(/\b\w/g, l => l.toUpperCase());
    }
  }

  getBrowserName() {
    const agent = window.navigator.userAgent.toLowerCase();
    switch (true) {
      case agent.indexOf('edge') > -1:
        return 'edge';
      case agent.indexOf('opr') > -1 && !!(window as any).opr:
        return 'opera';
      case agent.indexOf('chrome') > -1 && !!(window as any).chrome:
        return 'chrome';
      case agent.indexOf('trident') > -1:
        return 'ie';
      case agent.indexOf('firefox') > -1:
        return 'firefox';
      case agent.indexOf('safari') > -1:
        return 'safari';
      default:
        return 'other';
    }
  }

  htmlToPdf(inputData, pdfName, landscape, fragData: any = {}, key = null, svg = null) {
    this.client = AuthService.getClientData();
    if (fragData.isSubscription) {
      this.client = {
        name: fragData.clientName
      };

    }
    inputData = inputData.split(AppConstants.RUPEE_LETTER).join('&#8377;');
    const date = this.datePipe.transform(new Date(), 'dd-MMM-yyyy');
    const obj = {
      htmlInput: inputData,
      name: pdfName,
      landscape,
      key,
      svg
    };
    const browser = this.getBrowserName();
    console.log(browser);
    if (!this.client) {
      this.client = {};
      this.client.name = '';
    }
    return this.http.post(
      'http://dev.ifanow.in:8080/futurewise/api/v1/web//subscription/html-to-pdf', obj,
      {responseType: 'blob'}).subscribe(
      data => {
        const file = new Blob([data], {type: 'application/pdf'});
        fragData.isSpinner = false;
        // window.open(fileURL,"hello");
        const namePdf = this.client.name + '\'s ' + pdfName + ' as on ' + date;
        const a = document.createElement('a');
        a.href = window.URL.createObjectURL(file);
        a.download = namePdf + '.pdf';
        a.click();
        // a.download = fileURL;
        return (this.fileURL) ? this.fileURL : null;
      }
    );
  }

  bulkHtmlToPdf(data) {
    this.client = AuthService.getClientData();
    const obj = {
      htmlInput: data.htmlInput,
      name: data.name,
      fromEmail: data.fromEmail,
      landscape: data.landscape,
      toEmail: data.toEmail,
      clientId: data.clientId,
      advisorId: data.advisorId,
      svg: data.svg,
      mfBulkEmailRequestId: data.mfBulkEmailRequestId
    };

    return this.http.post(
      'http://dev.ifanow.in:8080/futurewise/api/v1/web/pdfAndEmail/bulk-mail/html-to-pdf', obj,
    ).subscribe(
      data => {
        console.log('done email', data);
        this.responseData = data;
        alert(this.responseData.status);
      });
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

  // do not use this function. use the loader function below
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

  // dirty fix to shift the view to top for right slider
  // TODO:- need to find a better solution and fix this mess as js code is not recommended by angular
  scrollToTopForRightSlider() {
    document.querySelector('.right_sidenav').scrollTop = 0;
  }

  scrollToBottomForRightSlider() {
    const height = document.querySelector('.right_sidenav').scrollHeight;
    document.querySelector('.right_sidenav').scrollTop = height;
  }

  static getDocumentTemplates(documentType) {
    let froalaTemplate;
    if (documentType == 1) {

    } else if (documentType == 2) {

    } else if (documentType == 7) {

    } else if (documentType == 7) {
      return quotationTemplate;
    } else {
      return 'docText';
    }
  }

  /**
   * Compares and returns int value based on date comparision
   * @param date1 date object or date string
   * @param date2 date object or date string
   * @returns 0 if dates are equal, 1 if second is greater than first, -1 otherwise
   */
  public static compareDates(date1, date2) {
    const firstD = new Date(date1).getTime();
    const secondD = new Date(date2).getTime();

    if (firstD === secondD) {
      return 0;
    } else if (firstD > secondD) {
      return -1;
    } else {
      return 1;
    }
  }

}


export class ValidatorType {

  // static NUMBER_ONLY = new RegExp(/^\d{1,6}(\.\d{1,2})?$/);
  static NUMBER_ONLY = new RegExp(/^\d+(\.\d{0,4})?$/);
  static NUMBER_SEPCIALCHAR = new RegExp(/^[0-9*#_@$/+-]+$/);
  static NUMBER_ONLY_WITH_FOUR_DECIMAL = new RegExp(/^[0-9]+(\.{1}[0-9]{1,4})?$/);
  static NUMBER_ONLY_WITH_TWO_DECIMAL = new RegExp(/^\d+\.?\d{0,2}$/);
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
  static LOGIN_PASS_REGEX = new RegExp(/(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()])(?=.{8,})/);
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
 * @description private loader function which tells when all api's have been resolved.
 * You will need to add this to the component's providers to make this function private
 *
 * Update: 1-July-2020:- You can now set your functions to be executed once the counter reaches 0
 * @callback setFunctionToExeOnZero:- sets the callback you'd like to execute once counter reaches 0
 */
export class LoaderFunction implements OnDestroy {

  public get loading() {
    return this.isLoading;
  }

  private apiDebounceSubject: Subject<any> = new Subject();

  private counter = 0;
  private isLoading = false;
  private execOnZero: Function;


  public increaseCounter() {
    this.isLoading = true;
    this.counter++;
  }

  public decreaseCounter() {
    this.counter--;
    if (this.counter == 0) {
      this.isLoading = false;
      this.apiDebounceSubject.next();
    }
  }

  /**
   * @description Executes the method once counter is 0
   * @param obj the instance of the class/object
   * @param func the function you'd like to execute
   * @see https://stackoverflow.com/a/29827015
   */
  public setFunctionToExeOnZero(obj: Object, func: () => void) {
    this.apiDebounceSubject.pipe(debounceTime(100)).subscribe(() => func.call(obj));
  }

  ngOnDestroy() {
    this.apiDebounceSubject.unsubscribe();
  }

}
