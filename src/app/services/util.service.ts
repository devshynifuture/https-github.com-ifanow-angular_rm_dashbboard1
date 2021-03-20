// tslint:disable:radix
// tslint:disable:triple-equals

import { ElementRef, Injectable, Input, OnDestroy } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { EventService } from '../Data-service/event.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SubscriptionService } from '../component/protect-component/AdviserComponent/Subscriptions/subscription.service';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import { AuthService } from '../auth-service/authService';
import { quotationTemplate } from './quotationTemplate';
import { debounceTime } from 'rxjs/operators';
import { AppConstants } from './app-constants';
import { apiConfig } from '../config/main-config';
import { element } from 'protractor';

@Injectable({
  providedIn: 'root',
})
export class UtilService {

  constructor(
    private eventService: EventService,
    private http: HttpClient,
    private subService: SubscriptionService,
    private datePipe: DatePipe
  ) {
    this.client = AuthService.getClientData();
  }

  private static decimalPipe = new DecimalPipe('en-US');
  responseData: any;
  client: any;

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
    Object.keys(inputObject).map((key) => {
      outputArray.push({
        name: inputObject[key],
        value: key,
        selected: false,
      });
    });

    return outputArray;
  }

  static getAumFilterList() {
    return [
      { name: 'KARVY', value: 1, checked: true },
      { name: 'CAMS', value: 2, checked: true },
      { name: 'FRANKLIN TEMPLETON', value: 3, checked: true },
      { name: 'PRUDENT', value: 4, checked: true },
      { name: 'NJ', value: 5, checked: true },
      { name: 'CAS IMPORT', value: 6, checked: false },
      { name: 'MANUAL', value: 14, checked: false },
    ]
  }

  static getFilterSelectedAumIDs(List) {
    let AumIdList = []
    List.forEach(element => {
      if (element.checked) {
        AumIdList.push(element.value)
      }
    })
    return AumIdList;
  }

  static convertObjectToCustomArray(
    inputObject: object,
    keyNameForOutput: string,
    keyValueForOutput: string
  ): object[] {
    const outputArray = [];
    Object.keys(inputObject).map((key) => {
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
    element.forEach((obj) => {
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

    return parseFloat(
      this.decimalPipe
        .transform(data, '9.0-' + noOfPlaces, null)
        .replace(/,/g, '')
    );
  }

  static roundOffString(
    data: number,
    minNoOfPlaces = 0,
    maxNoOfPlaces: number = 0
  ) {
    return this.decimalPipe
      .transform(data, '9.' + minNoOfPlaces + '-' + maxNoOfPlaces, null)
      .replace(/,/g, '');
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
    const arr = email.split('@');
    email = email.replace(/\./g, '');
    return this.nameMasking(arr[0]) + '@' + this.domainMasking(arr[1]);
  }

  static nameMasking(str) {
    const midLength = Math.floor(str.length / 2);
    const firstName = str.substr(0, midLength);
    return firstName + 'X'.repeat(midLength + 1);
  }

  static domainMasking(str) {
    return (
      'x'.repeat(str.indexOf('.')) +
      str.substr(str.indexOf('.'), str.length - 1)
    );
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
      strNumber =
        this.mutualFundRoundAndFormat(numberValue / 10000000.0, 2) + ' Crores';
    } else if (numberValue > 100000) {
      strNumber =
        this.mutualFundRoundAndFormat(numberValue / 100000.0, 2) + ' Lacs';
    } else if (numberValue > 1000) {
      strNumber = this.mutualFundRoundAndFormat(numberValue / 1000.0, 2) + 'K';
    } else {
      strNumber = numberValue.toString();
    }
    return strNumber;
  }

  static transactionDocumentsRequired(taxMasterId) {
    let headerText
    if (taxMasterId == 1) {
      headerText = "AOF and cancelled cheque"
    } else if (taxMasterId == 2) {
      headerText = "Birth certificate of the minor/School leaving certificate /Any other suitable proof evidencing the date of birth of the minor. If the guardian is other than natural guardian (Mother/Father) then the court proof of the appointed guardian."
    } else if (taxMasterId == 3) {
      headerText = "AOF (signed by the KARTA under his seal), HUF PAN COPYand cancelled cheque."
    } else if (taxMasterId == 4) {
      headerText = "AOF (UCC to be created in Firms Name), cancelled cheque, Board of Resolution, Authorised Signatory list."
    } else if (taxMasterId == 5) {
      headerText = "AOF and cancelled cheque (UCC to be created in Firms Name)"
    } else if (taxMasterId == 6) {
      headerText = "AOF (UCC to be created in Firms Name) PAN copy of Partner Ship Firm, Partnership Deed UCC to be created in Firms Name,AOF and cancelled cheque"
    } else if (taxMasterId == 8) {
      headerText = "AOF (UCC to be created in Trust Name) PAN copy of Trust, Board Resolution (BR) & Authorised Signatory list (ASL) and cancelled cheque."
    }
    // else if (taxMasterId == 13) {
    //   headerText = "AOF and cancelled cheque of NRO A/C"
    // }
    else if (taxMasterId == 11 && taxMasterId == 14 && taxMasterId == 17 && taxMasterId == 41) {
      headerText = "AOF and cancelled cheque of NRE A/C"
    } else if (taxMasterId == 13) {
      headerText = "AOF signed by proprietor, PAN copy and cancelled cheque."
    }
    return headerText;
  }

  public static getHttpParam(data) {
    let httpParams = new HttpParams();
    for (const key of Object.keys(data)) {
      httpParams = httpParams.set(key, data[key]);
    }
    return httpParams;
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

  static getViewPermission(capabilityList, defaultValue) {
    let returnValue = defaultValue;
    if (capabilityList) {
      returnValue = capabilityList.some((singleElement) => {
        return singleElement.id == 1 && singleElement.enabledOrDisabled == 1;
      });
    }
    return returnValue;
  }

  static getAddPermission(capabilityList, defaultValue) {
    let returnValue = defaultValue;

    if (capabilityList) {
      capabilityList.forEach(singleElement => {
        if (singleElement.id == 2) {
          returnValue = singleElement.enabledOrDisabled == 1;
        }
      });
    }
    return returnValue;
  }

  static getEditermission(capabilityList, defaultValue) {
    let returnValue = defaultValue;

    if (capabilityList) {
      capabilityList.forEach(singleElement => {
        if (singleElement.id == 3) {
          returnValue = singleElement.enabledOrDisabled == 1;
        }
      });
    }
    return returnValue;
  }

  static getDeletePermission(capabilityList, defaultValue) {
    let returnValue = defaultValue;

    if (capabilityList) {
      capabilityList.forEach(singleElement => {
        if (singleElement.id == 4) {
          returnValue = singleElement.enabledOrDisabled == 1;
        }
      });
    }
    return returnValue;
  }

  static getCapabilityMap(capabilityList) {
    const capabilityMap: any = {};
    capabilityMap.view = this.getViewPermission(capabilityList, true);
    capabilityMap.add = this.getAddPermission(capabilityList, true);
    capabilityMap.edit = this.getEditermission(capabilityList, true);
    capabilityMap.delete = this.getDeletePermission(capabilityList, true);
    return capabilityMap;
  }


  static getDetailedCapabilityMap(capabilityList) {
    const capabilityMap: any = this.getCapabilityMap(capabilityList);
    capabilityMap.download = this.getDownloadPermission(capabilityList, true);

    return capabilityMap;
  }

  static getDownloadPermission(capabilityList, defaultValue) {
    let returnValue = defaultValue;
    if (capabilityList) {
      capabilityList.forEach(singleElement => {
        if (singleElement.id == 14) {
          returnValue = singleElement.enabledOrDisabled == 1;
          // break;
        }
      });
    }
    return returnValue;
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
    } else if (firstD >= secondD) {
      return -1;
    } else {
      return 1;
    }
  }
  public static compareDatesFor(date1, date2) {
    const firstD = new Date(date1).getTime();
    const secondD = new Date(date2).getTime();

    // if (firstD === secondD) {
    //   return 0;
    if (firstD >= secondD) {
      return -1;
    } else {
      return 1;
    }
  }

  segregateNormalAndAdvancedPermissions(data: any[], featureId) {
    const permissions_json = {
      view: data.find((permission) => permission.capabilityName == 'View'),
      add: data.find((permission) => permission.capabilityName == 'Add'),
      edit: data.find((permission) => permission.capabilityName == 'Edit'),
      delete: data.find((permission) => permission.capabilityName == 'Delete'),
    };
    for (const k in permissions_json) {
      if (permissions_json[k]) {
        permissions_json[k].featureId = featureId;
      } else {
        delete permissions_json[k];
      }
    }
    const advanced_permissions = data.filter((permission) => permission.basicOrAdvanceCapability == 2);
    advanced_permissions.forEach((permission) => {
      permission.featureId = featureId;
    });
    return { permissions: permissions_json, advanced_permissions };
  }

  convertEnabledOrDisabledAsBoolean(segregatedPermissions) {
    for (const k in segregatedPermissions.permissions) {
      segregatedPermissions.permissions[k].enabledOrDisabled = segregatedPermissions.permissions[k].enabledOrDisabled == 1 ? true : false;
    }

    segregatedPermissions.advanced_permissions.forEach((permission) => {
      permission.enabledOrDisabled = permission.enabledOrDisabled == 1 ? true : false;
    });

    return segregatedPermissions;
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
    tempData = tempData.filter((element) => element.stepTypeId == stepNo);
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
    return parseInt(data).toLocaleString('en-IN');
  }

  formatter(data) {
    return Math.round(data);
  }

  /**
   * Returns a new array of family member object with age key.
   * @param familyList - Array of family objects. Must contain key - dateOfBirth - otherwise it will fail.
   */
  calculateAgeFromCurrentDate(familyList: any[]) {
    return familyList.map((element) => {
      const today = new Date();
      const birthDate = element.dateOfBirth
        ? new Date(element.dateOfBirth)
        : new Date();
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
    return whichTable.valid ? true : false;
  }

  public replacePlaceholder(inputValue: string, placeHolder) {
    if (!!inputValue) {
      // let regex = $client_name\)/gi;
      inputValue = inputValue.replace(
        new RegExp(escapeRegExp('$client_name'), 'g'),
        placeHolder.clientName
      );
      // regex = /\$\(client_address\)/gi;
      inputValue = inputValue.replace(
        new RegExp(escapeRegExp('$client_address'), 'g'),
        placeHolder.clientAddress
      );
      // inputValue = inputValue.replace(regex, placeHolder.clientAddress);
      // regex = /\$\(advisor_name\)/gi;
      inputValue = inputValue.replace(
        new RegExp(escapeRegExp('$advisor_name'), 'g'),
        placeHolder.advisorName
      );
      // inputValue = inputValue.replace(regex, placeHolder.advisorName);
      // regex = /\$\(advisor_address\)/gi;
      inputValue = inputValue.replace(
        new RegExp(escapeRegExp('$advisor_address'), 'g'),
        placeHolder.advisorAddress
      );
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
    return (
      (k > 64 && k < 91) ||
      (k > 96 && k < 123) ||
      k == 8 ||
      (k >= 48 && k <= 57)
    );
  }

  // used for dateFormat allows numbers and / character
  dateFormat(event: any) {
    let res: string;
    if (this.alphaNumric(event)) {
      res = event.target.value;

      if (event.keyCode == 47 || (event.keyCode >= 48 && event.keyCode <= 57)) {
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
      event.target.value = event.target.value.replace(/\b\w/g, (l) =>
        l.toUpperCase()
      );
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

  formatFileSize(bytes, decimalPoint) {
    if (bytes == 0) return '0 Bytes';
    var k = 1000,
      dm = decimalPoint || 2,
      sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  htmlToPdf(header, inputData, pdfName, landscape, fragData: any = {}, key = null, svg = null, showFooter, clientName) {
    this.client = AuthService.getClientData();
    if (fragData.isSubscription) {
      this.client = {
        name: fragData.clientName,
      };
    }
    clientName = clientName ? clientName + '\'s ' : this.client.name + '\'s ';
    inputData = inputData.split(AppConstants.RUPEE_LETTER).join('&#8377;');
    const date = this.datePipe.transform(new Date(), 'dd-MMM-yyyy');
    const obj = {
      htmlInput: inputData,
      header: header,
      name: pdfName,
      showMfFooter: showFooter == false ? false : true,
      landscape,
      key,
      svg,
    };
    const browser = this.getBrowserName();
    console.log(browser);
    if (!this.client) {
      this.client = {};
      this.client.name = '';
    }
    return this.http
      .post(
        apiConfig.MAIN_URL + 'subscription/html-to-pdf',
        obj,
        { responseType: 'blob' }
      )
      .subscribe((data) => {
        const file = new Blob([data], { type: 'application/pdf' });
        fragData.isSpinner = false;
        fragData.size = this.formatFileSize(data.size, 0);
        fragData.date = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
        var date = new Date();
        fragData.time = date.toLocaleTimeString('en-US');
        // window.open(fileURL,"hello");
        const namePdf = clientName + pdfName + ' as on ' + date;
        const a = document.createElement('a');
        a.href = window.URL.createObjectURL(file);
        a.download = namePdf + '.pdf';
        a.click();
        // a.download = fileURL;
        return this.fileURL ? this.fileURL : null;
      });
  }
  htmlToPdfPort(header, inputData, pdfName, landscape, fragData: any = {}, key = null, svg = null, showFooter, clientName, svgs) {
    this.client = AuthService.getClientData();
    if (fragData.isSubscription) {
      this.client = {
        name: fragData.clientName,
      };
    }
    inputData = inputData.split(AppConstants.RUPEE_LETTER).join('&#8377;');
    clientName = clientName ? clientName + '\'s ' : this.client.name + '\'s ';
    const date = this.datePipe.transform(new Date(), 'dd-MMM-yyyy');
    const obj = {
      htmlInput: inputData,
      header: header,
      name: pdfName,
      showMfFooter: showFooter == false ? false : true,
      landscape,
      key,
      svg,
      svgs,
    };
    const browser = this.getBrowserName();
    console.log(browser);
    if (!this.client) {
      this.client = {};
      this.client.name = '';
    }
    return this.http
      .post(
        apiConfig.MAIN_URL + 'subscription/html-to-pdf',
        obj,
        { responseType: 'blob' }
      )
      .subscribe((data) => {
        const file = new Blob([data], { type: 'application/pdf' });
        fragData.isSpinner = false;
        fragData.size = this.formatFileSize(data.size, 0);
        fragData.date = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
        var date = new Date();
        fragData.time = date.toLocaleTimeString('en-US');
        // window.open(fileURL,"hello");
        const namePdf = clientName + pdfName + ' as on ' + date;
        const a = document.createElement('a');
        a.href = window.URL.createObjectURL(file);
        a.download = namePdf + '.pdf';
        a.click();
        // a.download = fileURL;
        return this.fileURL ? this.fileURL : null;
      });
  }
  static convertArrayListToObject(list) {
    let obj = {}
    for (let i of list) {
      obj[i.capabilityName] = i.enabledOrDisabled == 1 ? true : false
    }
    return obj
  }

  bulkHtmlToPdf(data) {
    this.client = AuthService.getClientData();
    const obj = {
      htmlInput: data.htmlInput,
      name: data.name,
      header: data.header,
      fromEmail: data.fromEmail,
      landscape: data.landscape,
      showMfFooter: true,
      toEmail: data.toEmail,
      clientId: data.clientId,
      advisorId: data.advisorId,
      svg: data.svg,
      mfBulkEmailRequestId: data.mfBulkEmailRequestId,
    };

    return this.http
      .post(
        apiConfig.MAIN_URL + 'pdfAndEmail/bulk-mail/html-to-pdf',
        obj
      )
      .subscribe((data) => {
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
    const possibleText =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
      text += possibleText.charAt(
        Math.floor(Math.random() * possibleText.length)
      );
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
    const imageBlob = new Blob([ia], { type: mimeString });
    return new File([imageBlob], imageName, { type: 'image/png' });
  }

  /**
   * Focuses on the first invalid option
   * @param fg - FormGroup instance of the form you would like to make the focus on
   * @param el - viewchild ElementRef of the form
   */
  focusOnInvalid(fg: FormGroup, el: ElementRef) {
    for (const key of Object.keys(fg.controls)) {
      if (fg.controls[key].invalid) {
        const invalidControl = el.nativeElement.querySelector(
          '[formcontrolname="' + key + '"]'
        );
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

  static removeSpecialCharactersFromString(string) {
    if (!string) {
      string = ''
    }
    string = string.replace(/[\\\#+()@!^&;|[$~%.'":*?<>_={}-]/g, '')
    string = string.replace(/[\x00-\x08\x0E-\x1F\x7F-\uFFFF]/g, '')
    string = string.replace(']', '')
    return string
  }

  static formatGoogleGeneratedAddress(address: string) {
    let firstLine = address.substring(0, 39)
    firstLine = firstLine.substr(0, firstLine.lastIndexOf(' '))
    firstLine = firstLine.trim();
    let secondLine = address.substring(firstLine.lastIndexOf(' '), 79)
    secondLine = secondLine.trim()
    secondLine = secondLine.substr(secondLine.indexOf(' '), 79)
    return { firstLine, secondLine }
  }

  static formatAddressInThreeLine(address1, address2, address3) {
    let firstLine, secondLine, thirdLine;
    if (address1 != '' && address1.length > 40) {
      firstLine = address1.substring(0, 39);
      let remainingFirstLine = firstLine.substr(firstLine.lastIndexOf(' '), firstLine.length) + address1.substring(39, address1.length)
      firstLine = firstLine.trim();
      address2 = remainingFirstLine + ' ' + address2;
      firstLine = firstLine.substr(0, firstLine.lastIndexOf(' '))
    }
    if (address2 != '' && address2.length > 40) {
      let remainingSecondLine = address2.substring(39, address2.length);
      secondLine = address2.substring(0, 39);
      secondLine = secondLine.trim()
      address3 = remainingSecondLine + '' + address3;
      secondLine = secondLine.substr(0, secondLine.lastIndexOf(' '))
    }
    if (address3 != '' && address3.length > 40) {
      thirdLine = address3.substring(0, 39)
    }
    return {
      firstLine: firstLine ? firstLine : address1,
      secondLine: secondLine ? secondLine : address2,
      thirdLine: thirdLine ? thirdLine : address3
    }
    // secondLine = secondLine.substr(secondLine.indexOf(' '), 79)
  };

  static checkEmailListUpdation(originalEmailList, editedEmailList) {
    let emailListJson = [];
    if (originalEmailList.length == 0) {
      editedEmailList.value.forEach(element => {
        element.defaultFlag = element.markAsPrimary;
      })
      // editedEmailList.value[0].defaultFlag = editedEmailList.value[0].markAsPrimary
      emailListJson = editedEmailList.value;
    } else {
      originalEmailList.forEach(singleEmail => {
        editedEmailList.value.forEach(secondEmail => {
          if (singleEmail.id === secondEmail.id) {
            if ((singleEmail.email != secondEmail.emailAddress || singleEmail.defaultFlag != secondEmail.markAsPrimary)) {
              singleEmail['isUpdate'] = 1;
              singleEmail['isActive'] = 1;
              singleEmail['email'] = secondEmail.emailAddress;
              singleEmail['defaultFlag'] = secondEmail.markAsPrimary
              emailListJson.push(singleEmail);
            } else {
              emailListJson.push(singleEmail);
            }
          }
          if (secondEmail.id == undefined) {
            emailListJson.push({
              email: secondEmail.emailAddress,
              userId: singleEmail.userId,
              defaultFlag: secondEmail.markAsPrimary
            });
          }
          // if (editedEmailList.value.some(element => element.id && element.id != singleEmail.id)) {
          //   emailListJson.push({
          //     email: singleEmail.email,
          //     userId: singleEmail.userId,
          //     isUpdate: 1,
          //     isActive: 0,
          //     defaultFlag: singleEmail.markAsPrimary ? singleEmail.markAsPrimary : singleEmail.defaultFlag
          //   });
          //   emailListJson[0].defaultFlag = true;
          // }
        });
      })
    }
    emailListJson = UtilService.getUniqueListBy(emailListJson, 'id')
    return emailListJson;
  }

  static checkMobileListUpdation(originalMobileList, editedMobileList) {
    let mobileListJson = []
    if (originalMobileList.length == 0) {
      mobileListJson = editedMobileList.value;
    } else {
      originalMobileList.forEach(singleMobile => {
        editedMobileList.value.forEach(secondMobile => {
          if (singleMobile.id == secondMobile.id && (singleMobile.mobileNo != secondMobile.number) || singleMobile.isdCodeId != secondMobile.code) {
            singleMobile['isUpdate'] = 1;
            singleMobile['isActive'] = 1;
            singleMobile['mobileNo'] = secondMobile.number;
            singleMobile['isdCodeId'] = secondMobile.code
            mobileListJson.push(singleMobile);
          } else if (secondMobile.id == undefined) {
            singleMobile['defaultFlag'] = true;
            mobileListJson.push({
              mobileNo: secondMobile.number,
              isdCodeId: secondMobile.code,
              defaultFlag: true,
              userId: singleMobile.userId
            });
          }
          else if ((singleMobile.id == secondMobile.id && singleMobile.mobileNo == secondMobile.number)) {
            singleMobile['isdCodeId'] = secondMobile.code
            mobileListJson.push(singleMobile);
          }
          else if (editedMobileList.value.some(element => element.id != singleMobile.id)) {
            mobileListJson.push({
              mobileNo: secondMobile.number,
              isdCodeId: secondMobile.code,
              defaultFlag: true,
              userId: singleMobile.userId,
              isUpdate: 1,
              isActive: 0
            });
            mobileListJson[0].defaultFlag = true;
          }
        });
      })
    }
    mobileListJson = UtilService.getUniqueListBy(mobileListJson, 'id')
    return mobileListJson;
  }

  static getUniqueListBy(arr, key) {
    return [...new Map(arr.map(item => [item[key], item])).values()];
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

  static getImageOfFamilyMember(familyMemberList) {
    familyMemberList.forEach(member => {
      if ((member.relationshipId == 2) || (member.relationshipId == 4 && member.age > 18)) {
        member['imgUrl'] = "/assets/images/svg/man-profile.svg";
        member['width'] = "48px";
      }
      else if ((member.relationshipId == 3) || member.relationshipId == 5 && member.age > 18) {
        member['imgUrl'] = "/assets/images/svg/women-profile-icon.svg";
        member['width'] = "48px";
      }
      else if (member.relationshipId == 4 && member.age <= 18) {
        member['imgUrl'] = "/assets/images/svg/son-profile.svg";
        member['width'] = "36px";
      }
      else if (member.relationshipId == 5 && member.age <= 18) {
        member['imgUrl'] = "/assets/images/svg/daughter-profile.svg";
        member['width'] = "36px";
      }
      else if (member.relationshipId == 7) {
        member['imgUrl'] = "/assets/images/svg/mother-profile.svg";
        member['width'] = "48px";
      }
      else if (member.relationshipId == 6) {
        member['imgUrl'] = "/assets/images/svg/father-profile.svg";
        member['width'] = "48px";
      }
      else if (member.relationshipId == 10 || member.relationshipId == 8 || member.relationshipId == 9 || member.relationshipId == 11 || member.relationshipId == 12 || member.relationshipId == 13 || member.relationshipId == 14 || member.relationshipId == 15 || member.relationshipId == 16 || member.relationshipId == 0) {
        member['imgUrl'] = "/assets/images/svg/others.svg";
        member['width'] = "48px";
      }
      else if (member.relationshipId == 17 || member.relationshipId == 18 || member.relationshipId == 19 || member.relationshipId == 23 || member.relationshipId == 24 || member.relationshipId == 25) {
        member['imgUrl'] = "/assets/images/svg/office-building.svg";
        member['width'] = "48px";
      } else {
        member['imgUrl'] = "/assets/images/svg/others.svg";
        member['width'] = "48px";
      }
    });
    return familyMemberList;
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
}

export class ValidatorType {
  // static NUMBER_ONLY = new RegExp(/^\d{1,6}(\.\d{1,2})?$/);
  static NUMBER_ONLY = new RegExp(/^\d+(\.\d{0,4})?$/);
  static NUMBER_SEPCIALCHAR = new RegExp(/^[0-9*#_@$/+-]+$/);
  static NUMBER_ONLY_WITH_FOUR_DECIMAL = new RegExp(
    /^[0-9]+(\.{1}[0-9]{1,4})?$/
  );
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
  static LOGIN_PASS_REGEX = new RegExp(
    /(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()])(?=.{8,})/
  );
  static ALPHA_NUMERIC = new RegExp(/^[a-zA-Z0-9/-]*$/);
  static COMPULSORY_ALPHA_NUMERIC = new RegExp(/^[a-zA-Z]+[a-zA-Z0-9/-]*$/);
  static ALPHA_NUMERIC_WITH_SPACE = new RegExp(/^[a-zA-Z0-9 /-]*$/);
  static CAPITAL_CASE = new RegExp(/^[ A-Z0-9_@./#&+-]*$/);

  static EMAIL = new RegExp(
    /^(([A-Za-z0-9]+_+)|([A-Za-z0-9]+\-+)|([A-Za-z0-9]+\.+)|([A-Za-z0-9]+\++))*[A-Za-z0-9]+@((\w+\-+)|(\w+\.))*\w{1,63}\.[a-zA-Z]{2,6}$/
  );
  static ALPHA_NUMERIC_WITH_SLASH = new RegExp(/^[A-Z0-9//-]+$/);
  static TEN_DIGITS = new RegExp(/^\d{10}$/);
  static PAN = new RegExp(/[A-Za-z]{5}\d{4}[A-Za-z]{1}/);
  static ADHAAR = new RegExp(/^[0-9]{12,}$/);
  static ALPHA_NUMERIC_WITH_SPEC_CHAR = new RegExp(/^[ A-Za-z0-9_@./#&+-]*$/);
  static PASSPORT = new RegExp(/^[A-Z]{1}[0-9]{7}$/);
  // static DRIVING_LICENCE = new RegExp(/^(?[A-Z]{2})(?\d{2})(?\d{4})(?\d{7})$/);
  static VOTER_ID = new RegExp(/^([a-zA-Z]){3}([0-9]){7}?$/);
  static DOMAIN = new RegExp(/^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/);
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
    this.apiDebounceSubject
      .pipe(debounceTime(100))
      .subscribe(() => func.call(obj));
  }

  ngOnDestroy() {
    this.apiDebounceSubject.unsubscribe();
  }
}
